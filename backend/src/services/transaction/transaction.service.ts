import { PrismaClient, Transaction, TransactionType } from '@models';
import { TransactionPayload } from '@/types';
import createHttpError from 'http-errors';
import {
  createSaleTransaction,
  createPurchaseTransaction,
  createReturnTransaction,
  createDamageTransaction,
} from '@/services/transaction';
import { prisma } from '@root/lib/prisma';
import { addMonths, startOfMonth } from 'date-fns';
import { productService } from '@/services';

const prismaClient: PrismaClient = prisma;

// Create a transaction based on its type
export const createTransaction = async (payload: TransactionPayload): Promise<Transaction> => {
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
export const getTransactions = async () => {
  const transactions = await prismaClient.transaction.findMany({
    include: {
      transactionItem: {
        select: {
          productId: true,
          quantity: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
    take: 50,
  });

  const transactionsWithProducts = await Promise.all(
    transactions.map(async (transaction) => {
      const transactionItems = await Promise.all(
        transaction.transactionItem.map(async (item) => {
          const product = await productService.getProductById(item.productId);
          return {
            ...item,
            productName: product.name,
          };
        }),
      );

      return {
        ...transaction,
        transactionItem: transactionItems,
      };
    }),
  );

  return transactionsWithProducts;
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

export const transactionService = {
  createTransaction,
  getTransactions,
  getTotalDamageAmount,
};
