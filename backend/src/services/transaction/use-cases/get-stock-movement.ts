import { prisma } from '@prisma';

export async function getStockMovements() {
  return await prisma.stockMovement.findMany({
    orderBy: { createdAt: 'desc' },
    take: 50,
  });
}

export async function getStockMovementsByProductId(id: number) {
  return await prisma.stockMovement.findMany({
    orderBy: { createdAt: 'desc' },
    where: { productId: id },
    take: 10,
  });
}
