import { prisma } from '@prisma';
import { TransactionPayload } from '@/types/transaction';
import type { Product, Transaction } from '@root/generated/prisma/client';
import {
  StockMovementReason,
  StockMovementType,
  TransactionType,
} from '@root/generated/prisma/enums';
import {
  createStockMovement,
  createTransactionItem,
  findProduct,
  getProductStock,
  checkCostPerUnit,
  checkProductExistence,
  checkSellingPrice,
  isThereEnoughStock,
  isLowStock,
} from '@/services/transaction';
import { getItemTotalCost, getItemTotalPrice, getProfitAmount } from '@/services/transaction';
import { logger } from '@/config';

export async function createSaleTransaction(payload: TransactionPayload): Promise<Transaction> {
  logger.info('Create sale transaction');
  const currentDate = new Date();
  return await prisma.$transaction(async (tx) => {
    const productInfo = new Map<number, Pick<Product, 'name' | 'sellingPrice' | 'costPerUnit'>>();
    let totalAmount: number = 0;
    for (const item of payload.items) {
      const product = await findProduct(tx, item);

      checkProductExistence(item.productName, product);

      // Set to Hashmap
      productInfo.set(item.productId, product);

      // Get Stock
      const currentStock = await getProductStock(tx, item);
      const branchName = await tx.branch
        .findFirst({
          where: { id: payload.branchId },
          select: {
            name: true,
          },
        })
        .then((branch) => branch?.name ?? 'Unknown');

      // Compare available stock and user item quantity
      isThereEnoughStock(item.productName, currentStock, item.quantity);
      isLowStock(item.productName, branchName, currentStock - item.quantity, 30);
      // Create Stock Movement Record
      await createStockMovement(tx, {
        productId: item.productId,
        quantity: item.quantity,
        movementType: StockMovementType.OUT,
        movementReason: StockMovementReason.SALE,
        oldValue: currentStock,
        newValue: currentStock - item.quantity,
        createdAt: currentDate,
      });

      // Accumulated value of total amount of all items
      totalAmount += getItemTotalPrice(product.sellingPrice, item.quantity);
    }

    // Create Transaction
    const transaction = await tx.transaction.create({
      data: {
        branchId: payload.branchId,
        type: TransactionType.SALE,
        totalAmount, // Total Amount from earlier
        createdAt: currentDate,
      },
    });

    for (const item of payload.items) {
      const currentItem = productInfo.get(item.productId);
      checkSellingPrice(item.productName, currentItem);
      checkCostPerUnit(item.productName, currentItem);

      const salesAmount = getItemTotalCost(currentItem.sellingPrice, item.quantity);

      const profitAmount = getProfitAmount(
        currentItem.costPerUnit,
        currentItem.sellingPrice,
        item.quantity,
      );
      // Create Transaction Item
      await createTransactionItem(tx, {
        productId: item.productId,
        transactionId: transaction.id,
        quantity: item.quantity,
        price: salesAmount,
        transactionType: TransactionType.SALE,
        createdAt: currentDate,
      });

      // Reflect on Product Report
      await tx.productReport.update({
        where: { productId: item.productId },
        data: {
          sales: { increment: salesAmount },
          profit: { increment: profitAmount },
          stock: { decrement: item.quantity },
        },
      });
      // Reflect on Branch Report
      await tx.branchReport.update({
        where: { branchId: payload.branchId },
        data: {
          sales: { increment: salesAmount },
          profit: { increment: profitAmount },
        },
      });
    }

    return transaction;
  });
}
