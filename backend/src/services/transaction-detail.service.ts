import { prisma } from '@prisma';
import createError from 'http-errors';
import { TransactionDetail } from '@models';
import { Prisma } from '@models';
import { nowPH } from '@/helpers';

export const TransactionDetailService = {
  // Get all transaction details (optional filters)
  async getTransactionDetails(branchId?: number, productId?: number, transactionId?: number) {
    const where: Prisma.TransactionDetailWhereInput = {};

    if (branchId) where.branchId = branchId;
    if (productId) where.productId = productId;
    if (transactionId) where.transactionId = transactionId;

    return await prisma.transactionDetail.findMany({
      where,
      orderBy: {
        transactionDate: 'desc',
      },
      include: {
        product: true,
        branch: true,
        transaction: true,
      },
    });
  },

  // Get transaction detail by ID
  async getTransactionDetailById(id: number) {
    if (isNaN(id)) {
      throw new createError.BadRequest('Invalid transaction detail ID.');
    }

    const detail = await prisma.transactionDetail.findUnique({
      where: { id },
    });

    if (!detail) {
      throw new createError.NotFound('Transaction Detail Not Found.');
    }

    return detail;
  },

  // Create transaction detail
  async createTransactionDetail(data: Omit<TransactionDetail, 'id' | 'transactionAt'>) {
    // Validate foreign keys to prevent constraint errors
    const [product, branch, transaction] = await Promise.all([
      prisma.product.findUnique({ where: { id: data.productId } }),
      prisma.branch.findUnique({ where: { id: data.branchId } }),
      prisma.transaction.findUnique({ where: { id: data.transactionId } }),
    ]);

    if (!product) throw new createError.BadRequest('Product does not exist.');
    if (!branch) throw new createError.BadRequest('Branch does not exist.');
    if (!transaction) throw new createError.BadRequest('Transaction does not exist.');

    return await prisma.transactionDetail.create({
      data: { ...data, transactionDate: nowPH },
    });
  },

  // Update transaction detail
  async updateTransactionDetail(
    id: number,
    data: Partial<Omit<TransactionDetail, 'transactionAt'>>,
  ) {
    const detail = await this.getTransactionDetailById(id);
    if (!detail) throw new createError.NotFound('Transaction details not found.');

    return await prisma.transactionDetail.update({
      where: { id },
      data,
    });
  },

  // Delete transaction detail
  async deleteTransactionDetail(id: number) {
    const detail = await this.getTransactionDetailById(id);
    if (!detail) throw new createError.NotFound('Transaction details not found.');
    return await prisma.transactionDetail.delete({
      where: { id },
    });
  },
};
