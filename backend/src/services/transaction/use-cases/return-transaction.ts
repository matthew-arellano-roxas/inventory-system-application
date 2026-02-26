import { prisma } from '@prisma';
import { Product } from '@root/generated/prisma/client';
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
} from '../transaction-repository';
import {
  checkCostPerUnit,
  checkProductExistence,
  checkSellingPrice,
} from '../transaction-validation';
import { logger } from '@/config';
import { getItemTotalPrice, getProfitAmount } from '@/services/transaction';
import { TransactionBody } from '@/schemas';

export async function createReturnTransaction(payload: TransactionBody) {
  logger.info('Create return transaction');
  const productInfo = new Map<number, Pick<Product, 'sellingPrice' | 'costPerUnit' | 'name'>>();
  let totalAmount: number = 0;
  const currentDate = new Date();
  return prisma.$transaction(async (tx) => {
    for (const item of payload.items) {
      // Check Product if existing
      const product = await findProduct(tx, item);
      checkProductExistence(item.productName, product);
      // Save info in the hashmap
      productInfo.set(item.productId, product);

      const productStock = await getProductStock(tx, item);

      await createStockMovement(tx, {
        productId: item.productId,
        movementType: StockMovementType.IN,
        movementReason: StockMovementReason.RETURN,
        quantity: item.quantity,
        oldValue: productStock,
        newValue: productStock + item.quantity,
        createdAt: currentDate,
      });

      totalAmount += item.quantity * product.sellingPrice - item.discount;
    }
    const transaction = await tx.transaction.create({
      data: {
        branchId: payload.branchId,
        type: TransactionType.RETURN,
        totalAmount,
        createdAt: currentDate,
      },
    });

    for (const item of payload.items) {
      const currentItem = productInfo.get(item.productId);
      checkCostPerUnit(item.productName, currentItem);
      checkSellingPrice(item.productName, currentItem);

      const salesAmount =
        getItemTotalPrice(currentItem.sellingPrice, item.quantity) - item.discount;
      const profitAmount =
        getProfitAmount(currentItem.costPerUnit, currentItem.sellingPrice, item.quantity) -
        item.discount;

      await createTransactionItem(tx, {
        productId: item.productId,
        transactionId: transaction.id,
        quantity: item.quantity,
        price: salesAmount,
        transactionType: TransactionType.RETURN,
        createdAt: currentDate,
      });

      await tx.productReport.update({
        where: { productId: item.productId },
        data: {
          revenue: { decrement: salesAmount },
          stock: { increment: item.quantity },
          profit: { decrement: profitAmount },
        },
      });

      await tx.branchReport.update({
        where: { branchId: payload.branchId },
        data: {
          revenue: { decrement: salesAmount },
          profit: { decrement: profitAmount },
        },
      });
    }
    return transaction;
  });
}
