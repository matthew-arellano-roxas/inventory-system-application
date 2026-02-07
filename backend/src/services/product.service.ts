import { prisma } from '@prisma';
import { calculateSkip } from '@/helpers';
import { Product } from '@models';
import { Prisma } from '@models';
import { branchService, categoryService } from '@/services';
import { GetProductQuery } from '@/schemas';
import type { ProductDetail } from '@/types';
import createHttpError from 'http-errors';

const itemLimit = 30;

// Get products with optional filters
const getProducts = async (query: GetProductQuery): Promise<ProductDetail[]> => {
  const where: Prisma.ProductWhereInput = {};

  const select: Prisma.ProductSelect | undefined = query.details
    ? undefined
    : {
        id: true,
        name: true,
      };

  where.categoryId = query.categoryId;
  where.branchId = query.branchId;
  where.soldBy = query.soldBy;

  where.name = {
    contains: query.search,
    mode: 'insensitive',
  };

  const skip = calculateSkip(query.page, itemLimit);

  const productData = await prisma.product.findMany({
    select,
    where,
    orderBy: { id: 'asc' },
    take: itemLimit,
    skip,
  });

  return productData as ProductDetail[];
};

// Get product by ID
const getProductById = async (id: number): Promise<Product> => {
  const product = await prisma.product.findFirst({ where: { id } });
  if (!product) throw new createHttpError.NotFound('Product Not Found.');
  return product;
};

// Create a new product
const createProduct = async (data: Omit<Product, 'id' | 'createdAt'>) => {
  const branch = await branchService.getBranchById(data.branchId);
  const category = await categoryService.getCategoryById(data.categoryId);

  if (!branch) throw new createHttpError.NotFound('Branch does not exist.');
  if (!category) throw new createHttpError.NotFound('Category does not exist.');
  if (!isProfitable)
    throw new createHttpError.BadRequest('Cost per unit cannot be greater than selling price.');

  return prisma.$transaction(async (tx) => {
    const product = await tx.product.create({
      data: { ...data, createdAt: new Date() },
    });

    await tx.productReport.create({ data: { productId: product.id } });

    return product;
  });
};

// Update product
const updateProduct = async (id: number, data: Partial<Omit<Product, 'createdAt' | 'id'>>) => {
  await getProductById(id);
  return prisma.product.update({ where: { id }, data });
};

// Delete product
const deleteProduct = async (id: number): Promise<Product> => {
  await getProductById(id);
  return prisma.product.delete({ where: { id } });
};

const isProfitable = (costPerUnit: number, sellingPrice: number) => {
  return costPerUnit < sellingPrice;
};

export const productService = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
