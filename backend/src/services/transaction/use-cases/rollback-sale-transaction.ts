import { prisma } from '@prisma';
import type { Transaction } from '@root/generated/prisma/client';
import { TransactionType } from '@root/generated/prisma/enums';
import createHttpError from 'http-errors';
import { logger } from '@/config';
import { getProductStock, isThereEnoughStock } from '@/services/transaction';

export async function rollbackSaleTransaction(saleTransactionId: number): Promise<Transaction> {
  logger.info(`Rollback sale transaction ${saleTransactionId}`);

  return prisma.$transaction(async (tx) => {
    const saleTransaction = await tx.transaction.findFirst({
      where: { id: saleTransactionId },
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

    if (!saleTransaction) {
      throw new createHttpError.NotFound('Transaction not found.');
    }

    if (saleTransaction.transactionItem.length === 0) {
      throw new createHttpError.BadRequest('Transaction has no items to roll back.');
    }

    for (const item of saleTransaction.transactionItem) {
      const currentStock = await getProductStock(tx, {
        productId: item.productId,
        productName: item.product.name,
        quantity: item.quantity,
      });

      const profitToReverse = item.price - item.product.costPerUnit * item.quantity;

      switch (saleTransaction.type) {
        case TransactionType.SALE:
          await tx.productReport.update({
            where: { productId: item.productId },
            data: {
              revenue: { decrement: item.price },
              profit: { decrement: profitToReverse },
              stock: { increment: item.quantity },
            },
          });

          await tx.branchReport.update({
            where: { branchId: saleTransaction.branchId },
            data: {
              revenue: { decrement: item.price },
              profit: { decrement: profitToReverse },
            },
          });
          break;

        case TransactionType.PURCHASE:
          isThereEnoughStock(item.product.name, currentStock, item.quantity);

          await tx.productReport.update({
            where: { productId: item.productId },
            data: {
              stock: { decrement: item.quantity },
            },
          });
          break;

        case TransactionType.RETURN:
          isThereEnoughStock(item.product.name, currentStock, item.quantity);

          await tx.productReport.update({
            where: { productId: item.productId },
            data: {
              revenue: { increment: item.price },
              profit: { increment: profitToReverse },
              stock: { decrement: item.quantity },
            },
          });

          await tx.branchReport.update({
            where: { branchId: saleTransaction.branchId },
            data: {
              revenue: { increment: item.price },
              profit: { increment: profitToReverse },
            },
          });
          break;

        case TransactionType.DAMAGE:
          await tx.productReport.update({
            where: { productId: item.productId },
            data: {
              profit: { increment: item.price },
              stock: { increment: item.quantity },
            },
          });

          await tx.branchReport.update({
            where: { branchId: saleTransaction.branchId },
            data: {
              profit: { increment: item.price },
            },
          });
          break;

        default:
          throw new createHttpError.BadRequest('Unsupported transaction type.');
      }
    }

    return tx.transaction.delete({
      where: { id: saleTransaction.id },
    });
  });
}
