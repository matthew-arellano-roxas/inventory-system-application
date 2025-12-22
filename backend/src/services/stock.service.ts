import { prisma } from '@prisma';
import createError from 'http-errors';
import { Stock } from '@models';
import { Prisma } from '@models';
import { nowPH } from '@/helpers';

export const StockService = {
  // Get all stock entries with optional pagination
  async getStocks(options?: { productId?: number; limit?: number; cursor?: number }) {
    const { productId, limit = 20, cursor } = options || {};

    const where: Prisma.StockWhereInput = {};
    if (productId) where.productId = productId;
    if (cursor) where.id = { lt: cursor }; // fetch stocks older than cursor for infinite scroll

    return await prisma.stock.findMany({
      where,
      take: limit,
      orderBy: {
        stockAddedAt: 'desc', // newest first
      },
      include: {
        product: {
          select: { id: true, name: true },
        },
      },
    });
  },
  // Get stock by id
  async getStockById(id: number) {
    if (isNaN(id)) {
      throw new createError.BadRequest('Invalid stock ID.');
    }

    const stock = await prisma.stock.findUnique({
      where: { id },
    });

    if (!stock) throw new createError.NotFound('Stock Not Found.');

    return stock;
  },

  // Add Stock
  async createStock(data: Omit<Stock, 'id' | 'stockAddedAt'>) {
    // Ensure product exists (FK safety)
    const product = await prisma.product.findUnique({
      where: { id: data.productId },
    });

    if (!product) {
      throw new createError.BadRequest('Product does not exist.');
    }

    return await prisma.stock.create({
      data: {
        ...data,
        stockAddedAt: nowPH(),
      },
    });
  },

  // Update Stock Quantity
  async updateStock(id: number, data: Partial<Omit<Stock, 'stockAddedAt'>>) {
    const stock = await this.getStockById(id);
    if (!stock) throw new createError.NotFound('Stock Not Found!');
    return await prisma.stock.update({
      where: { id },
      data,
    });
  },

  async deleteStock(id: number) {
    const stock = await this.getStockById(id);
    if (!stock) throw new createError.NotFound('Stock Not Found!');
    return await prisma.stock.delete({
      where: { id },
    });
  },
};
