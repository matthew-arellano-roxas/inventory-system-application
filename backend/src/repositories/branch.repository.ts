import { prisma } from '@prisma';
import createError from 'http-errors';
import { Branch } from '@models';

export class BranchRepository {
  // Create a new branch
  async createBranch(
    data: Omit<Branch, 'id' | 'createdAt' | 'product' | 'transactions'>,
  ): Promise<Branch> {
    return prisma.branch.create({ data });
  }

  // Get a branch by its ID
  async getBranchById(id: number): Promise<Branch> {
    const branch = await prisma.branch.findUnique({ where: { id } });
    if (!branch) throw createError(404, `Branch with ID ${id} not found`);
    return branch;
  }

  async getBranchByName(name: string): Promise<Branch> {
    const branch = await prisma.branch.findFirst({ where: { name } });
    if (!branch) throw createError.NotFound(`Branch with name "${name}" not found`);
    return branch;
  }

  // Get all branches
  async getAllBranches(): Promise<Branch[]> {
    return prisma.branch.findMany();
  }

  // Update a branch by its ID
  async updateBranch(
    id: number,
    data: Partial<Omit<Branch, 'id' | 'createdAt' | 'product' | 'transactions'>>,
  ): Promise<Branch> {
    const existingBranch = await prisma.branch.findUnique({ where: { id } });
    if (!existingBranch) throw createError(404, `Branch with ID ${id} not found`);

    return prisma.branch.update({
      where: { id },
      data,
    });
  }

  // Delete a branch by its ID
  async deleteBranch(id: number): Promise<Branch> {
    const existingBranch = await prisma.branch.findUnique({ where: { id } });
    if (!existingBranch) throw createError(404, `Branch with ID ${id} not found`);

    return prisma.branch.delete({ where: { id } });
  }
}
