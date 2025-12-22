import { prisma } from '@prisma';
import { calculateSkip, nowPH } from '@/helpers';
import createError from 'http-errors';
import { Product } from '@models';
import { Prisma } from '@models';
import { BranchService, CategoryService } from '@/services';

const itemLimit = 30;

export const ProductService = {
  async getProducts(page: number = 1, categoryId?: number) {
    const where: Prisma.ProductWhereInput = {};
    if (categoryId) where.categoryId = categoryId;
    const skip = calculateSkip(page, itemLimit);
    return await prisma.product.findMany({
      orderBy: {
        id: 'asc',
      },
      take: itemLimit,
      skip,
      where,
    });
  },

  async getProductById(id: number) {
    const product = await prisma.product.findFirst({
      where: {
        id,
      },
    });
    if (!product) throw new createError.NotFound('Product Not Found.');

    return product;
  },

  async createProduct(data: Omit<Product, 'id' | 'createdAt'>) {
    const product = await prisma.product.findFirst({
      where: {
        name: data.name,
        branchId: data.branchId,
      },
    });

    const _branch = await BranchService.getBranchById(data.branchId);
    const _category = await CategoryService.getCategoryById(data.categoryId);

    if (product) throw new createError.Conflict('Product Already Exist.');

    return await prisma.product.create({
      data: { ...data, createdAt: nowPH },
    });
  },

  async updateProduct(id: number, data: Partial<Omit<Product, 'createdAt'>>) {
    const product = await this.getProductById(id);

    if (!product) throw new createError.NotFound('Product Not Found.');

    return await prisma.product.update({
      where: {
        id: id,
      },
      data,
    });
  },

  async deleteProduct(id: number) {
    const product = await this.getProductById(id);
    if (!product) throw new createError.NotFound('Product Not Found.');
    return await prisma.product.delete({
      where: {
        id,
      },
    });
  },
};
