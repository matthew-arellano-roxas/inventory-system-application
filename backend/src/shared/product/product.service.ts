import { prisma } from '@prisma';
import { Product } from '@models';
import createError from 'http-errors';

// Constants
const ITEMS_LIMIT = 30;

const defaultIncludes = {
  category: true,
  branch: true,
};

// Helper to calculate pagination
const calculateSkip = (page: number, limit: number) => (page - 1) * limit;

// Get all products with pagination
export const getProducts = async (page = 1, limit = ITEMS_LIMIT): Promise<Product[]> => {
  return prisma.product.findMany({
    skip: calculateSkip(page, limit),
    take: limit,
    orderBy: { name: 'asc' },
    include: defaultIncludes,
  });
};

// Get product by ID
export const getProductById = (id: number): Promise<Product | null> =>
  prisma.product.findUnique({
    where: { id },
    include: defaultIncludes,
  });

// Search products by name (case-insensitive, partial match)
export const getProductsByName = (name: string): Promise<Product[]> =>
  prisma.product.findMany({
    where: { name: { contains: name, mode: 'insensitive' } },
    include: defaultIncludes,
  });

// Create a new product
export const createProduct = async (data: Omit<Product, 'createdAt' | 'id'>): Promise<Product> => {
  const isNameTaken = await isProductNameTaken(data.name);
  if (isNameTaken) {
    throw new createError.Conflict(`Product name "${data.name}" is already taken.`);
  }
  return prisma.product.create({ data });
};

// Update product by ID
export const updateProduct = async (
  id: number,
  data: Partial<Omit<Product, 'createdAt' | 'id'>>,
): Promise<Product> => {
  const existingProduct = await getProductById(id);
  if (!existingProduct) {
    throw new createError.NotFound(`Product with ID ${id} not found.`);
  }
  if (data.name && data.name !== existingProduct.name) {
    const isNameTaken = await isProductNameTaken(data.name);
    if (isNameTaken) {
      throw new createError.Conflict(`Product name "${data.name}" is already taken.`);
    }
  }
  return prisma.product.update({
    where: { id },
    data,
  });
};

// Delete product by ID
export const deleteProduct = async (id: number): Promise<Product> => {
  const existingProduct = await getProductById(id);
  if (!existingProduct) {
    throw new createError.NotFound(`Product with ID ${id} not found.`);
  }
  return prisma.product.delete({
    where: { id },
  });
};

// Count total products
export const countProducts = (): Promise<number> => prisma.product.count();

// Check if product name already exists
export const isProductNameTaken = async (name: string): Promise<boolean> => {
  const count = await prisma.product.count({
    where: { name },
  });
  return count > 0;
};

// Get products by category with pagination
export const getProductsByCategory = async (
  categoryId: number,
  page = 1,
  limit = ITEMS_LIMIT,
): Promise<Product[]> => {
  return prisma.product.findMany({
    where: { categoryId },
    skip: calculateSkip(page, limit),
    take: limit,
    orderBy: { name: 'asc' },
    include: defaultIncludes,
  });
};

// Get product transactions (paginated) — only returns transactions, not full product
export const getProductTransactions = async (productId: number, page = 1, limit = ITEMS_LIMIT) => {
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
};

// Get product stock history (paginated) — only returns stock histories and user
export const getProductStockHistory = async (productId: number, page = 1, limit = ITEMS_LIMIT) => {
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
};
