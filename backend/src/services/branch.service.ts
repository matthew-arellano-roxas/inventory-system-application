import { prisma } from '@prisma';
import { calculateSkip, nowPH } from '@/helpers';
import createError from 'http-errors';
import { Branch } from '@models';
import { BranchWhereInput } from '@root/generated/prisma/models';
import { subMonths } from 'date-fns';

const itemLimit = Number(process.env.PAGINATION_ITEM_LIMIT);

export const BranchService = {
  // Get all branches with optional pagination
  async getBranches(page: number = 1, search?: string) {
    const skip = calculateSkip(page, itemLimit);

    // Search for the matched name
    const where: BranchWhereInput = {
      name: {
        contains: search,
        mode: 'insensitive',
      },
    };

    return await prisma.branch.findMany({
      orderBy: {
        id: 'asc',
      },
      take: itemLimit,
      skip,
      where,
    });
  },

  // Get a single branch by ID
  async getBranchById(id: number) {
    const branch = await prisma.branch.findFirst({
      where: { id },
    });
    if (!branch) throw new createError.NotFound('Branch Not Found.');
    return branch;
  },

  // Create a new branch
  async createBranch(data: Omit<Branch, 'id' | 'createdAt'>) {
    const existingBranch = await prisma.branch.findFirst({
      where: { name: data.name },
    });
    if (existingBranch) throw new createError.Conflict('Branch Already Exists.');
    return await prisma.branch.create({
      data: {
        ...data,
        createdAt: nowPH(),
      },
    });
  },

  // Update an existing branch
  async updateBranch(id: number, data: Partial<Omit<Branch, 'createdAt'>>) {
    const branch = await this.getBranchById(id);
    if (!branch) throw new createError.NotFound('Branch Not Found.');
    return await prisma.branch.update({
      where: { id },
      data,
    });
  },

  // Delete a branch
  async deleteBranch(id: number) {
    const branch = await this.getBranchById(id);
    if (!branch) throw new createError.NotFound('Branch Not Found.');
    return await prisma.branch.delete({
      where: { id },
    });
  },

  // Get Branch Sales
  async getBranchSales() {
    const dateNow = nowPH();
    const oneMonthAgo = subMonths(new Date(dateNow), 1);

    // 1. Get ALL branches first
    const allBranches = await prisma.branch.findMany({
      select: { id: true, name: true },
    });

    // 2. Get the sales sums for branches that actually had transactions
    const branchSumOfPayments = await prisma.transactionDetail.groupBy({
      by: ['branchId'],
      where: {
        transactionDate: { lt: dateNow, gt: oneMonthAgo },
      },
      _sum: { payment: true },
    });

    // 3. Map through ALL branches and "attach" the sales
    const branchSales = allBranches.map((branch) => {
      // Find if this specific branch exists in our sales aggregation
      const salesData = branchSumOfPayments.find((s) => s.branchId === branch.id);

      return {
        branchId: branch.id,
        branchName: branch.name,
        // If found, use the sum; otherwise, default to 0
        sales: salesData?._sum.payment ?? 0,
      };
    });

    return branchSales;
  },
};
