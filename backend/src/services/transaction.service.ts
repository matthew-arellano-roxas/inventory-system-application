import { prisma } from '@prisma';
import createError from 'http-errors';
import { nowPH } from '@/helpers';

interface TransactionDetailPayload {
  productId: number;
  branchId: number;
  stockSold: number;
  payment: number;
}

interface TransactionPayload {
  details: TransactionDetailPayload[];
}

export const TransactionService = {
  // Create a transaction
  async createTransaction(payload: TransactionPayload) {
    if (!payload.details || payload.details.length === 0) {
      throw new createError.BadRequest('Transaction details required.');
    }

    return await prisma.$transaction(async (tx) => {
      let totalPrice = 0;

      // Validate stock
      for (const item of payload.details) {
        const totalAdded = await tx.stock
          .aggregate({
            where: { productId: item.productId },
            _sum: { quantity: true },
          })
          .then((r) => r._sum.quantity || 0);

        const totalSold = await tx.transactionDetail
          .aggregate({
            where: { productId: item.productId },
            _sum: { stockSold: true },
          })
          .then((r) => r._sum.stockSold || 0);

        const currentStock = totalAdded - totalSold;

        if (currentStock < item.stockSold) {
          throw new createError.BadRequest(`Not enough stock for product ID ${item.productId}.`);
        }

        totalPrice += item.payment;
      }

      // Create transaction
      const transaction = await tx.transaction.create({
        data: { totalPrice, transactionDate: nowPH },
      });

      // Create transaction details
      await tx.transactionDetail.createMany({
        data: payload.details.map((d) => ({
          transactionId: transaction.id,
          productId: d.productId,
          branchId: d.branchId,
          stockSold: d.stockSold,
          payment: d.payment,
          transactionDate: nowPH,
        })),
      });

      return transaction;
    });
  },

  // Update a transaction
  async updateTransaction(id: number, payload: TransactionPayload) {
    if (!payload.details || payload.details.length === 0) {
      throw new createError.BadRequest('Transaction details required.');
    }

    return await prisma.$transaction(async (tx) => {
      const existing = await tx.transaction.findUnique({
        where: { id },
        include: { transactionDetails: true },
      });
      if (!existing) throw new createError.NotFound('Transaction not found.');

      let totalPrice = 0;

      for (const item of payload.details) {
        const totalAdded = await tx.stock
          .aggregate({
            where: { productId: item.productId },
            _sum: { quantity: true },
          })
          .then((r) => r._sum.quantity || 0);

        // Exclude this transaction's current details when checking stock
        const totalSold = await tx.transactionDetail
          .aggregate({
            where: {
              productId: item.productId,
              NOT: { transactionId: id },
            },
            _sum: { stockSold: true },
          })
          .then((r) => r._sum.stockSold || 0);

        const currentStock = totalAdded - totalSold;

        if (currentStock < item.stockSold) {
          throw new createError.BadRequest(`Not enough stock for product ID ${item.productId}.`);
        }

        totalPrice += item.payment;
      }

      // Update transaction totalPrice and transactionDate
      await tx.transaction.update({
        where: { id },
        data: { totalPrice, transactionDate: nowPH },
      });

      // Delete existing transaction details
      await tx.transactionDetail.deleteMany({ where: { transactionId: id } });

      // Create new transaction details
      await tx.transactionDetail.createMany({
        data: payload.details.map((d) => ({
          transactionId: id,
          productId: d.productId,
          branchId: d.branchId,
          stockSold: d.stockSold,
          payment: d.payment,
          transactionDate: nowPH,
        })),
      });

      // Return updated transaction with details
      return await tx.transaction.findUnique({
        where: { id },
        include: { transactionDetails: true },
      });
    });
  },

  // Delete a transaction
  async deleteTransaction(id: number) {
    return await prisma.$transaction(async (tx) => {
      const existing = await tx.transaction.findUnique({
        where: { id },
        include: { transactionDetails: true },
      });
      if (!existing) throw new createError.NotFound('Transaction not found.');

      // Delete transaction details first
      await tx.transactionDetail.deleteMany({ where: { transactionId: id } });

      // Delete transaction
      return await tx.transaction.delete({ where: { id } });
    });
  },

  // Get transaction by ID
  async getTransactionById(id: number) {
    const transaction = await prisma.transaction.findUnique({
      where: { id },
      include: { transactionDetails: true },
    });
    if (!transaction) throw new createError.NotFound('Transaction not found.');
    return transaction;
  },

  // List transactions with optional cursor (date-based) for infinite scroll
  async getTransactions(cursor?: Date, limit = 20) {
    const where = cursor ? { transactionDate: { lt: cursor } } : {};

    return await prisma.transaction.findMany({
      where,
      take: limit,
      orderBy: { transactionDate: 'desc' }, // newest first
      include: { transactionDetails: true },
    });
  },
};
