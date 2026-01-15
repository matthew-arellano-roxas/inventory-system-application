import { TransactionItemPayload } from '@/types/transaction';
import {
  Prisma,
  PrismaClient,
  StockMovement,
  TransactionItem,
} from '@root/generated/prisma/client';
import { checkStock } from './transaction.validation';

export async function findProduct(
  tx: Prisma.TransactionClient | PrismaClient,
  item: TransactionItemPayload,
) {
  const product = await tx.product.findFirst({
    where: { id: item.productId },
    select: { name: true, sellingPrice: true, costPerUnit: true },
  });

  return product;
}

export async function getProductStock(
  tx: Prisma.TransactionClient | PrismaClient,
  item: TransactionItemPayload,
): Promise<number> {
  const productStock = await tx.productReport
    .findFirst({
      where: { productId: item.productId },
      select: { stock: true },
    })
    .then((product) => checkStock(item.productName, product));

  return productStock;
}

export async function createStockMovement(
  tx: Prisma.TransactionClient | PrismaClient,
  data: Omit<StockMovement, 'id'>,
) {
  await tx.stockMovement.create({
    data,
  });
}

export async function createTransactionItem(
  tx: Prisma.TransactionClient | PrismaClient,
  data: Omit<TransactionItem, 'id'>,
) {
  return await tx.transactionItem.create({
    data,
  });
}

export async function decreaseProductStock(
  tx: Prisma.TransactionClient | PrismaClient,
  productId: number,
  quantity: number,
) {
  return await tx.productReport.update({
    where: { productId },
    data: { stock: { decrement: quantity } },
  });
}

export async function increaseProductStock(
  tx: Prisma.TransactionClient | PrismaClient,
  productId: number,
  quantity: number,
) {
  return await tx.productReport.update({
    where: { productId },
    data: { stock: { increment: quantity } },
  });
}
