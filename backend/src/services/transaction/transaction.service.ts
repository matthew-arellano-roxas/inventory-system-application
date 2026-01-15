import { PrismaClient, Transaction, TransactionType } from '@models';
import { TransactionPayload } from '@/types/transaction';
import createHttpError from 'http-errors';
import {
  createSaleTransaction,
  createPurchaseTransaction,
  createReturnTransaction,
  createDamageTransaction,
} from '@/services/transaction';
import { prisma } from '@root/lib/prisma';
import { addMonths, startOfMonth } from 'date-fns';
import { ProductService } from '../product/product.service';

export class TransactionService {
  private prismaClient: PrismaClient;
  private productService: ProductService;

  constructor(productService: ProductService, prismaClient: PrismaClient = prisma) {
    this.productService = productService;
    this.prismaClient = prismaClient;
  }

  // Create a transaction based on its type
  async createTransaction(payload: TransactionPayload): Promise<Transaction> {
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
  }

  // Get recent transactions with product names
  async getTransactions() {
    const transactions = await this.prismaClient.transaction.findMany({
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
            const product = await this.productService.getProductById(item.productId);
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
  }

  // Get total damage amount for the current month
  async getTotalDamageAmount() {
    const now = new Date();
    const monthStart = startOfMonth(now);
    const nextMonthStart = startOfMonth(addMonths(now, 1));

    const result = await this.prismaClient.transaction.aggregate({
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
  }
}
