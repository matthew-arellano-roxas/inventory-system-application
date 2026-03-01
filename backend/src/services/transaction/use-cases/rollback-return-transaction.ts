import { prisma } from '@prisma';
import type { Transaction } from '@root/generated/prisma/client';
import { TransactionType } from '@root/generated/prisma/enums';
import createHttpError from 'http-errors';
import { logger } from '@/config';
import { getProductStock, isThereEnoughStock } from '@/services/transaction';

export async function rollbackReturnTransaction(transactionId: number): Promise<Transaction> {
  logger.info(`Rollback return transaction ${transactionId}`);

  return prisma.$transaction(async (tx) => {
    const returnTransaction = await tx.transaction.findFirst({
      where: { id: transactionId },
      include: {
        transactionItem: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                costPerUnit: true,
              },
            },
          },
        },
      },
    });

    if (!returnTransaction) {
      throw new createHttpError.NotFound('Return transaction not found.');
    }

    if (returnTransaction.type !== TransactionType.RETURN) {
      throw new createHttpError.BadRequest('Only return transactions can be rolled back.');
    }

    if (returnTransaction.transactionItem.length === 0) {
      throw new createHttpError.BadRequest('Return transaction has no items to roll back.');
    }

    for (const item of returnTransaction.transactionItem) {
      const currentStock = await getProductStock(tx, {
        productId: item.productId,
        productName: item.product.name,
        quantity: item.quantity,
      });

      isThereEnoughStock(item.product.name, currentStock, item.quantity);

      const profitToRestore = item.price - item.product.costPerUnit * item.quantity;

      await tx.productReport.update({
        where: { productId: item.productId },
        data: {
          revenue: { increment: item.price },
          profit: { increment: profitToRestore },
          stock: { decrement: item.quantity },
        },
      });

      await tx.branchReport.update({
        where: { branchId: returnTransaction.branchId },
        data: {
          revenue: { increment: item.price },
          profit: { increment: profitToRestore },
        },
      });
    }

    return tx.transaction.delete({
      where: { id: returnTransaction.id },
    });
  });
}
