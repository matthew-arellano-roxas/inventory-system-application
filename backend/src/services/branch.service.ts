import { prisma } from '@prisma';
import { calculateSkip, nowPH } from '@/helpers';
import createError from 'http-errors';
import { Branch } from '@models';

const itemLimit = 30;

export const BranchService = {
  // Get all branches with optional pagination
  async getBranches(page: number = 1) {
    const skip = calculateSkip(page, itemLimit);

    return await prisma.branch.findMany({
      orderBy: {
        id: 'asc',
      },
      take: itemLimit,
      skip,
      include: {
        product: true,
      },
    });
  },

  // Get a single branch by ID
  async getBranchById(id: number) {
    console.log('');
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
};
