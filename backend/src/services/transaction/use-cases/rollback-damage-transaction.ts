import { prisma } from '@prisma';
import type { Transaction } from '@root/generated/prisma/client';
import { TransactionType } from '@root/generated/prisma/enums';
import createHttpError from 'http-errors';
import { logger } from '@/config';

export async function rollbackDamageTransaction(transactionId: number): Promise<Transaction> {
  logger.info(`Rollback damage transaction ${transactionId}`);

  return prisma.$transaction(async (tx) => {
    const damageTransaction = await tx.transaction.findFirst({
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

    if (!damageTransaction) {
      throw new createHttpError.NotFound('Damage transaction not found.');
    }

    if (damageTransaction.type !== TransactionType.DAMAGE) {
      throw new createHttpError.BadRequest('Only damage transactions can be rolled back.');
    }

    if (damageTransaction.transactionItem.length === 0) {
      throw new createHttpError.BadRequest('Damage transaction has no items to roll back.');
    }

    for (const item of damageTransaction.transactionItem) {
      await tx.productReport.update({
        where: { productId: item.productId },
        data: {
          profit: { increment: item.price },
          stock: { increment: item.quantity },
        },
      });

      await tx.branchReport.update({
        where: { branchId: damageTransaction.branchId },
        data: {
          profit: { increment: item.price },
        },
      });
    }

    return tx.transaction.delete({
      where: { id: damageTransaction.id },
    });
  });
}
