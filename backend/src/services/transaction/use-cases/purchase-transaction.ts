import { TransactionPayload } from '@/types';
import { prisma } from '@prisma';
import { Transaction } from '@root/generated/prisma/client';
import {
  StockMovementReason,
  StockMovementType,
  TransactionType,
} from '@root/generated/prisma/enums';
import {
  checkProductExistence,
  findProduct,
  getProductStock,
  checkCostPerUnit,
  createStockMovement,
  increaseProductStock,
} from '@/services/transaction';
import { ProductPriceInfo } from '@/types';
import { getItemTotalCost } from '@/services/transaction';
import { logger } from '@/config';

export async function createPurchaseTransaction(payload: TransactionPayload): Promise<Transaction> {
  logger.info('Create purchase transaction');
  const currentDate = new Date();
  return prisma.$transaction(async (tx) => {
    const productInfo = new Map<number, ProductPriceInfo>();
    let totalCost: number = 0;
    for (const item of payload.items) {
      const product = await findProduct(tx, item);

      checkProductExistence(item.productName, product);
      productInfo.set(item.productId, product);
      const productStock = await getProductStock(tx, item);

      // Create Stock Movement Record for each item
      await createStockMovement(tx, {
        productId: item.productId,
        movementType: StockMovementType.IN,
        movementReason: StockMovementReason.PURCHASE,
        quantity: item.quantity,
        oldValue: productStock,
        newValue: productStock + item.quantity,
        createdAt: currentDate,
      });

      // Update product report stock to reflect new data
      await increaseProductStock(tx, item.productId, item.quantity);

      totalCost += getItemTotalCost(product.costPerUnit, item.quantity);
    }

    // Create a record of transaction and return
    const transaction = await tx.transaction.create({
      data: {
        branchId: payload.branchId,
        type: TransactionType.PURCHASE,
        totalAmount: totalCost,
        createdAt: currentDate,
      },
    });

    for (const item of payload.items) {
      const currentProduct = productInfo.get(item.productId);
      checkCostPerUnit(item.productName, currentProduct);
      const itemTotalCost = getItemTotalCost(currentProduct.costPerUnit, item.quantity);
      await tx.transactionItem.create({
        data: {
          productId: item.productId,
          transactionId: transaction.id,
          quantity: item.quantity,
          transactionType: TransactionType.PURCHASE,
          price: itemTotalCost,
          createdAt: currentDate,
        },
      });
    }

    return transaction;
  });
}
