import { prisma } from '@prisma';
import { Product } from '@models';
import createError from 'http-errors';
import { calculateSkip } from '@/helpers/calculateskipitems';

const ITEMS_LIMIT = 30;

const defaultIncludes = {
  category: true,
  branch: true,
};

// Helper to calculate pagination

export class ProductService {
  // Get all products with pagination
  async getProducts(page = 1, limit = ITEMS_LIMIT): Promise<Product[]> {
    return prisma.product.findMany({
      skip: calculateSkip(page, limit),
      take: limit,
      orderBy: { name: 'asc' },
      include: defaultIncludes,
    });
  }

  // Get product by ID
  getProductById(id: number): Promise<Product | null> {
    return prisma.product.findUnique({
      where: { id },
      include: defaultIncludes,
    });
  }

  // Search products by name (case-insensitive, partial match)
  getProductsByName(name: string): Promise<Product[]> {
    return prisma.product.findMany({
      where: { name: { contains: name, mode: 'insensitive' } },
      include: defaultIncludes,
    });
  }

  // Create a new product
  async createProduct(data: Omit<Product, 'createdAt' | 'id'>): Promise<Product> {
    const isNameTaken = await this.isProductNameTaken(data.name);
    if (isNameTaken) {
      throw new createError.Conflict(`Product name "${data.name}" is already taken.`);
    }
    return prisma.product.create({ data });
  }

  // Update product by ID
  async updateProduct(
    id: number,
    data: Partial<Omit<Product, 'createdAt' | 'id'>>,
  ): Promise<Product> {
    const existingProduct = await this.getProductById(id);
    if (!existingProduct) {
      throw new createError.NotFound(`Product with ID ${id} not found.`);
    }
    if (data.name && data.name !== existingProduct.name) {
      const isNameTaken = await this.isProductNameTaken(data.name);
      if (isNameTaken) {
        throw new createError.Conflict(`Product name "${data.name}" is already taken.`);
      }
    }
    return prisma.product.update({
      where: { id },
      data,
    });
  }

  // Delete product by ID
  async deleteProduct(id: number): Promise<Product> {
    const existingProduct = await this.getProductById(id);
    if (!existingProduct) {
      throw new createError.NotFound(`Product with ID ${id} not found.`);
    }
    return prisma.product.delete({
      where: { id },
    });
  }

  // Count total products
  countProducts(): Promise<number> {
    return prisma.product.count();
  }

  // Check if product name already exists
  async isProductNameTaken(name: string): Promise<boolean> {
    const count = await prisma.product.count({
      where: { name },
    });
    return count > 0;
  }

  // Get products by category with pagination
  async getProductsByCategory(
    categoryId: number,
    page = 1,
    limit = ITEMS_LIMIT,
  ): Promise<Product[]> {
    return prisma.product.findMany({
      where: { categoryId },
      skip: calculateSkip(page, limit),
      take: limit,
      orderBy: { name: 'asc' },
      include: defaultIncludes,
    });
  }

  // Get product transactions (paginated)
  async getProductTransactions(productId: number, page = 1, limit = ITEMS_LIMIT) {
    return prisma.product.findUnique({
      where: { id: productId },
      select: {
        transactions: {
          skip: calculateSkip(page, limit),
          take: limit,
          orderBy: { transactionAt: 'desc' },
        },
      },
    });
  }

  // Get product stock history (paginated)
  async getProductStockHistory(productId: number, page = 1, limit = ITEMS_LIMIT) {
    return prisma.product.findUnique({
      where: { id: productId },
      select: {
        stockHistories: {
          skip: calculateSkip(page, limit),
          take: limit,
          orderBy: { stockAddedAt: 'desc' },
        },
        user: true,
      },
    });
  }
}
