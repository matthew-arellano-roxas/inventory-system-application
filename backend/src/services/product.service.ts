import { prisma } from '@prisma';
import { calculateSkip, nowPH } from '@/helpers';
import createError from 'http-errors';
import { Product } from '@models';
import { Prisma } from '@models';
import { BranchService, CategoryService } from '@/services';
import { Unit } from '@root/generated/prisma/enums';

const itemLimit = 30;

export const ProductService = {
  // Get products with optional filters
  async getProducts(page: number = 1, categoryId?: number, branchId?: number, soldBy?: Unit) {
    const where: Prisma.ProductWhereInput = {};

    if (categoryId) where.categoryId = categoryId;
    if (branchId) where.branchId = branchId;
    if (soldBy) where.soldBy = soldBy; // soldBy must be Unit.PC or Unit.KG

    const skip = calculateSkip(page, itemLimit);

    return prisma.product.findMany({
      where,
      orderBy: { id: 'asc' },
      take: itemLimit,
      skip,
    });
  },

  async getProductById(id: number) {
    const product = await prisma.product.findFirst({ where: { id } });
    if (!product) throw new createError.NotFound('Product Not Found.');
    return product;
  },

  async createProduct(data: Omit<Product, 'id' | 'createdAt'>) {
    const product = await prisma.product.findFirst({
      where: { name: data.name, branchId: data.branchId },
    });

    // Ensure branch and category exist
    await BranchService.getBranchById(data.branchId);
    await CategoryService.getCategoryById(data.categoryId);

    if (product) throw new createError.Conflict('Product Already Exist.');

    return await prisma.product.create({
      data: { ...data, createdAt: nowPH() },
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

  async deleteProduct(id: number) {
    const product = await this.getProductById(id);
    if (!product) throw new createError.NotFound('Product Not Found.');
    return await prisma.product.delete({ where: { id } });
  },
};
