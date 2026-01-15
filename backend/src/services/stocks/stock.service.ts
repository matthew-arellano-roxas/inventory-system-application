import { prisma } from '@prisma';
import createHttpError from 'http-errors';

export class StockService {
  async getStockMovements() {
    return prisma.stockMovement.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }

  async getStockMovementsByProductId(id: number) {
    return prisma.stockMovement.findMany({
      where: { productId: id },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });
  }

  async getProductStock(productId: number) {
    return prisma.productReport
      .findFirst({
        where: { productId },
        select: { productId: true, stock: true },
      })
      .catch((_err) => {
        throw createHttpError.NotFound('Product stock not found');
      });
  }
}
