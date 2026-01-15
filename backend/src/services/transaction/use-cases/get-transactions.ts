import { prisma } from '@prisma';
import { TransactionType } from '@root/generated/prisma/enums';
import { startOfMonth, addMonths } from 'date-fns';
import { Prisma, PrismaClient } from '@root/generated/prisma/client';

export async function getTransactions() {
  return await prisma.transaction.findMany({
    orderBy: { createdAt: 'desc' },
    take: 50,
  });
}

export async function getTotalDamageAmount(
  client: Prisma.TransactionClient | PrismaClient = prisma,
) {
  const now = new Date();

  const monthStart = startOfMonth(now);
  const nextMonthStart = startOfMonth(addMonths(now, 1));

  const result = await client.transaction.aggregate({
    where: {
      type: TransactionType.DAMAGE,
      createdAt: {
        gte: monthStart,
        lt: nextMonthStart,
      },
    },
    _sum: {
      totalAmount: true,
    },
  });

  return result._sum.totalAmount ?? 0;
}
