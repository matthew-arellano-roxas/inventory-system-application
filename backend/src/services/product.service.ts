import { prisma } from '@prisma';
import { calculateSkip, nowPH } from '@/helpers';
import createError from 'http-errors';
import { Product, Unit } from '@models';
import { Prisma } from '@models';
import { BranchService, CategoryService } from '@/services';
import { GetProductQuery } from '@/schemas';
import { StockWhereInput, TransactionDetailWhereInput } from '@root/generated/prisma/models';
import type { ProductDetail, SalesStockDetails } from '@/types/product';

const itemLimit = Number(process.env.PAGINATION_ITEM_LIMIT);

export const ProductService = {
  // Get products with optional filters
  async getProducts(query: GetProductQuery): Promise<ProductDetail[]> {
    const where: Prisma.ProductWhereInput = {};
    // details in query not true means will not show product details
    const select: Prisma.ProductSelect | undefined = query.details
      ? undefined
      : {
          id: true,
          name: true,
        };

    where.categoryId = query.categoryId;
    where.branchId = query.branchId;

    if (query.soldBy) {
      const unit = query.soldBy?.toUpperCase();
      where.soldBy = unit === 'KG' || unit === 'PC' ? (unit as Unit) : undefined;
    }

    where.name = {
      contains: query.search,
      mode: 'insensitive',
    };
    // Calculation for pagination
    const skip = calculateSkip(query.page, itemLimit);
    const productData = await prisma.product.findMany({
      select,
      where,
      orderBy: { id: 'asc' },
      take: itemLimit,
      skip,
    });
    // Process each product to have it's data completed
    const dataCombined = await Promise.all(
      productData.map(async (product) => {
        // Get Months sold, sales, stock
        const { stockSold, stock, monthSales } = await this.getProductSalesStockDetails(product.id);
        return {
          ...product,
          stockSold,
          stock,
          monthSales,
        };
      }),
    );
    return dataCombined as ProductDetail[];
  },

  async getProductById(id: number): Promise<ProductDetail> {
    const product = await prisma.product.findFirst({ where: { id } });
    if (!product) throw new createError.NotFound('Product Not Found.');
    // Get Overall Stock & Transaction
    const { stockSold, stock, monthSales } = await this.getProductSalesStockDetails(product.id);
    return { ...product, stock, monthSales, stockSold };
  },

  async createProduct(data: Omit<Product, 'id' | 'createdAt'>) {
    // Check If product already Exist
    const existing = await prisma.product.findFirst({
      where: { name: data.name, branchId: data.branchId },
    });
    await BranchService.getBranchById(data.branchId);
    await CategoryService.getCategoryById(data.categoryId);
    if (existing) throw new createError.Conflict('Product Already Exist.');
    // Normalize and validate enum
    const unit = data.soldBy?.toUpperCase();
    if (unit !== 'KG' && unit !== 'PC') {
      throw new createError.BadRequest('Invalid soldBy unit');
    }

    return await prisma.product.create({
      data: {
        ...data,
        soldBy: unit as Unit, // Safe cast
        createdAt: nowPH(),
      },
    });
  },

  async updateProduct(id: number, data: Partial<Omit<Product, 'createdAt'>>) {
    const product = await this.getProductById(id);
    if (!product) throw new createError.NotFound('Product Not Found.');
    return await prisma.product.update({
      where: { id },
      data,
    });
  },

  async deleteProduct(id: number): Promise<Product> {
    const product = await this.getProductById(id);
    if (!product) throw new createError.NotFound('Product Not Found.');
    return await prisma.product.delete({ where: { id } });
  },

  async getProductTotalStock(productId: number, lastNMonth?: number) {
    const now: Date = nowPH();
    const targetMonth = new Date(now.getFullYear(), now.getMonth() - (lastNMonth ?? 0), 1);
    const where: StockWhereInput = {};
    if (lastNMonth) {
      where.productId = productId;
      where.stockAddedAt = {
        gte: targetMonth,
        lte: now,
      };
    }
    const stock = await prisma.stock.aggregate({
      where,
      _sum: { quantity: true },
    });

    return { productId, ...stock._sum };
  },

  async getProductTotalTransaction(productId: number, lastNMonth?: number) {
    const now: Date = nowPH();
    const targetMonth = new Date(now.getFullYear(), now.getMonth() - (lastNMonth ?? 0), 1);
    const where: TransactionDetailWhereInput = {};
    if (lastNMonth) {
      where.productId = productId;
      where.transactionDate = {
        gte: targetMonth,
        lte: now,
      };
    }
    const transaction = await prisma.transactionDetail.aggregate({
      where,
      _sum: { stockSold: true, payment: true },
    });

    return {
      productId,
      stockSold: transaction._sum.stockSold ?? 0,
      sales: transaction._sum.payment ?? 0,
    };
  },

  async getProductSalesStockDetails(productId: number): Promise<SalesStockDetails> {
    // Get Sum of Stock and Stock Sold
    const productStock = (await this.getProductTotalStock(productId)).quantity ?? 0;
    const productStockSold = (await this.getProductTotalTransaction(productId)).stockSold ?? 0;
    // Get Monthly Sold Stocks & Sales
    const transactionData = await this.getProductTotalTransaction(productId, 0);
    const monthSales = transactionData.sales ?? 0;
    const monthStockSold = transactionData.stockSold ?? 0;
    // Compute the Stock
    const stock = productStock - productStockSold;
    return { stockSold: monthStockSold, stock, monthSales };
  },
};
