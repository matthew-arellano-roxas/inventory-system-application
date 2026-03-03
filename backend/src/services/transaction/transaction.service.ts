import { PrismaClient, Transaction, TransactionType } from '@models';
import createHttpError from 'http-errors';
import {
  createSaleTransaction,
  createPurchaseTransaction,
  createReturnTransaction,
  createDamageTransaction,
  rollbackDamageTransaction,
  rollbackPurchaseTransaction,
  rollbackReturnTransaction,
  rollbackSaleTransaction,
} from '@/services/transaction';
import { prisma } from '@root/lib/prisma';
import { addMonths, startOfMonth } from 'date-fns';
import { TransactionBody } from '@/schemas';

const prismaClient: PrismaClient = prisma;
const TRANSACTION_PAGE_SIZE = 20;

// Create a transaction based on its type
export const createTransaction = async (payload: TransactionBody): Promise<Transaction> => {
  switch (payload.type as TransactionType) {
    case TransactionType.SALE:
      return createSaleTransaction(payload);
    case TransactionType.DAMAGE:
      return createDamageTransaction(payload);
    case TransactionType.PURCHASE:
      return createPurchaseTransaction(payload);
    case TransactionType.RETURN:
      return createReturnTransaction(payload);
    default:
      throw new createHttpError.BadRequest('Invalid transaction type.');
  }
};

// Get recent transactions with product names
export const getTransactions = async (page = 1) => {
  const safePage = Math.max(1, page);
  const transactions = await prismaClient.transaction.findMany({
    include: {
      transactionItem: {
        select: {
          productId: true,
          quantity: true,
          price: true,
          product: {
            select: {
              name: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
    skip: (safePage - 1) * TRANSACTION_PAGE_SIZE,
    take: TRANSACTION_PAGE_SIZE,
  });

  return transactions.map((transaction) => ({
    ...transaction,
    transactionItem: transaction.transactionItem.map(({ product, ...item }) => ({
      ...item,
      productName: product.name,
    })),
  }));
};

// Get total damage amount for the current month
export const getTotalDamageAmount = async () => {
  const now = new Date();
  const monthStart = startOfMonth(now);
  const nextMonthStart = startOfMonth(addMonths(now, 1));

  const result = await prismaClient.transaction.aggregate({
    where: {
      type: TransactionType.DAMAGE,
      createdAt: {
        gte: monthStart,
        lt: nextMonthStart,
      },
    },
    _sum: {
      totalAmount: true,
    },
  });

  return result._sum.totalAmount ?? 0;
};

export const rollbackTransaction = async (transactionId: number): Promise<Transaction> => {
  const transaction = await prismaClient.transaction.findFirst({
    where: { id: transactionId },
    select: { type: true },
  });

  if (!transaction) {
    throw new createHttpError.NotFound('Transaction not found.');
  }

  switch (transaction.type as TransactionType) {
    case TransactionType.SALE:
      return rollbackSaleTransaction(transactionId);
    case TransactionType.PURCHASE:
      return rollbackPurchaseTransaction(transactionId);
    case TransactionType.RETURN:
      return rollbackReturnTransaction(transactionId);
    case TransactionType.DAMAGE:
      return rollbackDamageTransaction(transactionId);
    default:
      throw new createHttpError.BadRequest('Unsupported transaction type.');
  }
};

export const transactionService = {
  createTransaction,
  getTransactions,
  getTotalDamageAmount,
  rollbackTransaction,
};
