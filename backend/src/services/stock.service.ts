import { prisma } from '@prisma';
import createHttpError from 'http-errors';

// Get latest stock movements
const getStockMovements = async () => {
  return prisma.stockMovement.findMany({
    orderBy: { createdAt: 'desc' },
    take: 30,
  });
};

// Get stock movements by product ID
const getStockMovementsByProductId = async (id: number) => {
  return prisma.stockMovement.findMany({
    where: { productId: id },
    orderBy: { createdAt: 'desc' },
    take: 10,
  });
};

// Get product stock
const getProductStock = async (productId: number) => {
  const productStock = await prisma.productReport.findFirst({
    where: { productId },
    select: { productId: true, stock: true },
  });

  if (!productStock) throw new createHttpError.NotFound('Product Report Not Found.');

  return productStock.stock;
};

export const stockService = {
  getStockMovements,
  getStockMovementsByProductId,
  getProductStock,
};
