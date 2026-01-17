import { TransactionPayload } from '@/types/transaction';
import { prisma } from '@prisma';
import {
  StockMovementReason,
  StockMovementType,
  TransactionType,
} from '@root/generated/prisma/enums';
import {
  findProduct,
  getProductStock,
  checkCostPerUnit,
  checkProductExistence,
  isThereEnoughStock,
  createStockMovement,
} from '@/services/transaction';
import { ProductPriceInfo } from '@/types/product';
import { decreaseProductStock } from '@/services/transaction';
import { getItemTotalCost } from '@/services/transaction';
import { logger } from '@/config';

export async function createDamageTransaction(payload: TransactionPayload) {
  logger.info('Create damage transaction');
  const currentDate = new Date();
  return await prisma.$transaction(async (tx) => {
    const productInfo = new Map<number, ProductPriceInfo>();
    let totalCost: number = 0;
    for (const item of payload.items) {
      const product = await findProduct(tx, item);
      // Check if product exist
      checkProductExistence(item.productName, product);
      productInfo.set(item.productId, product);
      const productStock = await getProductStock(tx, item);
      isThereEnoughStock(item.productName, productStock, item.quantity);
      const newStock = productStock - item.quantity;

      await createStockMovement(tx, {
        productId: item.productId,
        movementType: StockMovementType.OUT,
        movementReason: StockMovementReason.DAMAGE,
        quantity: item.quantity,
        oldValue: productStock,
        newValue: newStock,
        createdAt: currentDate,
      });

      totalCost += getItemTotalCost(product.costPerUnit, item.quantity);
    }

    const transaction = await tx.transaction.create({
      data: {
        branchId: payload.branchId,
        type: TransactionType.DAMAGE,
        totalAmount: totalCost,
        createdAt: currentDate,
      },
    });

    for (const item of payload.items) {
      const currentItem = productInfo.get(item.productId);
      checkCostPerUnit(item.productName, currentItem);

      const currentItemTotalCost = getItemTotalCost(currentItem.costPerUnit, item.quantity);
      await tx.transactionItem.create({
        data: {
          transactionId: transaction.id,
          productId: item.productId,
          quantity: item.quantity,
          transactionType: TransactionType.DAMAGE,
          price: currentItemTotalCost,
          createdAt: currentDate,
        },
      });

      await tx.productReport.update({
        where: { productId: item.productId },
        data: { profit: { decrement: currentItemTotalCost } },
      });

      await decreaseProductStock(tx, item.productId, item.quantity);

      await tx.branchReport.update({
        where: { branchId: payload.branchId },
        data: { profit: { decrement: currentItemTotalCost } },
      });
    }

    return transaction;
  });
}
