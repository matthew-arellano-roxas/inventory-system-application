import { prisma } from '@prisma';
import type { Transaction } from '@root/generated/prisma/client';
import { TransactionType } from '@root/generated/prisma/enums';
import createHttpError from 'http-errors';
import { logger } from '@/config';
import { getProductStock, isThereEnoughStock } from '@/services/transaction';

export async function rollbackPurchaseTransaction(transactionId: number): Promise<Transaction> {
  logger.info(`Rollback purchase transaction ${transactionId}`);

  return prisma.$transaction(async (tx) => {
    const purchaseTransaction = await tx.transaction.findFirst({
      where: { id: transactionId },
      include: {
        transactionItem: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    if (!purchaseTransaction) {
      throw new createHttpError.NotFound('Purchase transaction not found.');
    }

    if (purchaseTransaction.type !== TransactionType.PURCHASE) {
      throw new createHttpError.BadRequest('Only purchase transactions can be rolled back.');
    }

    if (purchaseTransaction.transactionItem.length === 0) {
      throw new createHttpError.BadRequest('Purchase transaction has no items to roll back.');
    }

    for (const item of purchaseTransaction.transactionItem) {
      const currentStock = await getProductStock(tx, {
        productId: item.productId,
        productName: item.product.name,
        quantity: item.quantity,
      });

      isThereEnoughStock(item.product.name, currentStock, item.quantity);

      await tx.productReport.update({
        where: { productId: item.productId },
        data: {
          stock: { decrement: item.quantity },
        },
      });
    }

    return tx.transaction.delete({
      where: { id: purchaseTransaction.id },
    });
  });
}
