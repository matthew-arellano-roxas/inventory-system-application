import { OperatingExpense } from '@root/generated/prisma/client';
import { prisma } from '@root/lib/prisma';
import { calculateSkip } from '@/helpers';
import createHttpError from 'http-errors';
import { branchService } from './branch.service';

const itemLimit = 30;

const createOPEX = async (data: Omit<OperatingExpense, 'id' | 'createdAt'>) => {
  const branch = await branchService.getBranchById(data.branchId);
  if (!branch) throw new createHttpError.NotFound(`Branch ${data.branchId} not found`);

  const existing = await prisma.operatingExpense.findFirst({
    where: { branchId: branch.id, name: data.name },
  });
  if (existing) throw new createHttpError.Conflict('Expense already exists');

  return prisma.operatingExpense.create({
    data: {
      ...data,
      branchId: branch.id,
      createdAt: new Date(),
    },
  });
};

const getOPEX = async (page: number = 1, branchId?: number): Promise<OperatingExpense[]> => {
  const skip = calculateSkip(page, itemLimit);
  return await prisma.operatingExpense.findMany({
    where: { branchId },
    skip,
    take: itemLimit,
    orderBy: { createdAt: 'desc' },
  });
};

const getTotalOpex = async (branchId?: number) => {
  return await prisma.operatingExpense
    .aggregate({
      _sum: { amount: true },
      where: { branchId },
    })
    .then((opex) => opex._sum.amount ?? 0);
};

const getOPEXCount = async (branchId?: number) => {
  return await prisma.operatingExpense.count({ where: { branchId } });
};

const deleteOPEX = async (id: number) => {
  const opex = await prisma.operatingExpense.findUnique({ where: { id } });
  if (!opex) throw new createHttpError.NotFound('Operational Expense Not Found.');
  return await prisma.operatingExpense.delete({ where: { id } });
};

export const opexService = {
  createOPEX,
  getOPEX,
  getTotalOpex,
  getOPEXCount,
  deleteOPEX,
};
