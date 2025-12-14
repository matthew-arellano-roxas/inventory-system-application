import { prisma } from '@prisma';
import { Branch } from '@models';
import createError from 'http-errors';

export class BranchService {
  // Get all branches
  getBranches(): Promise<Branch[]> {
    return prisma.branch.findMany({
      orderBy: { name: 'asc' },
    });
  }

  // Get branch by ID
  getBranchById(id: number): Promise<Branch | null> {
    return prisma.branch.findUnique({
      where: { id },
    });
  }

  // Get branch by name (case-insensitive)
  getBranchByName(name: string): Promise<Branch | null> {
    return prisma.branch.findFirst({
      where: { name: { equals: name, mode: 'insensitive' } },
    });
  }

  // Check if branch name already exists
  async isBranchNameTaken(name: string): Promise<boolean> {
    const branch = await prisma.branch.findFirst({
      where: { name: { equals: name, mode: 'insensitive' } },
    });
    return Boolean(branch);
  }

  // Create a new branch
  async createBranch(data: Pick<Branch, 'name' | 'location'>): Promise<Branch> {
    const nameTaken = await this.isBranchNameTaken(data.name);
    if (nameTaken) {
      throw new createError.Conflict(`Branch name "${data.name}" is already taken.`);
    }

    return prisma.branch.create({ data });
  }

  // Update branch by ID
  async updateBranch(
    id: number,
    data: Partial<Pick<Branch, 'name' | 'location'>>,
  ): Promise<Branch> {
    const existingBranch = await this.getBranchById(id);
    if (!existingBranch) {
      throw new createError.NotFound(`Branch with ID ${id} not found.`);
    }

    if (data.name && data.name !== existingBranch.name) {
      const nameTaken = await this.isBranchNameTaken(data.name);
      if (nameTaken) {
        throw new createError.Conflict(`Branch name "${data.name}" is already taken.`);
      }
    }

    return prisma.branch.update({
      where: { id },
      data,
    });
  }

  // Delete branch by ID
  async deleteBranch(id: number): Promise<Branch> {
    const existingBranch = await this.getBranchById(id);
    if (!existingBranch) {
      throw new createError.NotFound(`Branch with ID ${id} not found.`);
    }

    return prisma.branch.delete({
      where: { id },
    });
  }

  // Count total branches
  countBranches(): Promise<number> {
    return prisma.branch.count();
  }
}
