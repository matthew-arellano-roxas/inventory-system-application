import { prisma } from '@prisma';
import { calculateSkip } from '@/helpers';
import createError from 'http-errors';
import { Branch } from '@models';
import { BranchWhereInput } from '@root/generated/prisma/models';

const itemLimit = Number(process.env.PAGINATION_ITEM_LIMIT);

export class BranchService {
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
  }

  // Get a single branch by ID
  async getBranchById(id: number) {
    const branch = await prisma.branch.findFirst({
      where: { id },
    });
    if (!branch) throw new createError.NotFound('Branch Not Found.');
    return branch;
  }

  // Create a new branch
  async createBranch(data: Omit<Branch, 'id' | 'createdAt'>) {
    const existingBranch = await prisma.branch.findFirst({
      where: { name: data.name },
    });
    if (existingBranch) throw new createError.Conflict('Branch Already Exists.');

    return prisma.$transaction(async (tx) => {
      const branch = await tx.branch.create({ data: { ...data, createdAt: new Date() } });
      await tx.branchReport.create({ data: { branchId: branch.id } });
      return branch;
    });
  }

  // Update an existing branch
  async updateBranch(id: number, data: Partial<Omit<Branch, 'createdAt' | 'id'>>) {
    const branch = await this.getBranchById(id);
    if (!branch) throw new createError.NotFound('Branch Not Found.');
    return await prisma.branch.update({
      where: { id },
      data,
    });
  }

  // Delete a branch
  async deleteBranch(id: number) {
    const branch = await this.getBranchById(id);
    if (!branch) throw new createError.NotFound('Branch Not Found.');
    return await prisma.branch.delete({
      where: { id },
    });
  }

  async getBranchReportByBranchId(branchId: number) {
    const report = await prisma.branchReport.findFirst({
      where: { branchId },
    });
    if (!report) throw new createError.NotFound('Branch Report Not Found.');
    return report;
  }

  async getBranchReports() {
    return await prisma.branchReport.findMany();
  }
}
