import { prisma } from '@prisma';
import { Branch } from '@models';
import createError from 'http-errors';

// Get all branches
export const getBranches = (): Promise<Branch[]> =>
  prisma.branch.findMany({
    orderBy: { name: 'asc' },
  });

// Get branch by ID
export const getBranchById = (id: number): Promise<Branch | null> =>
  prisma.branch.findUnique({
    where: { id },
  });

// Get branch by name (case-insensitive)
export const getBranchByName = (name: string): Promise<Branch | null> =>
  prisma.branch.findFirst({
    where: { name: { equals: name, mode: 'insensitive' } },
  });

// Check if branch name already exists
export const isBranchNameTaken = async (name: string): Promise<boolean> => {
  const branch = await prisma.branch.findFirst({
    where: { name: { equals: name, mode: 'insensitive' } },
  });
  return Boolean(branch);
};

// Create a new branch
export const createBranch = async (data: Pick<Branch, 'name' | 'location'>): Promise<Branch> => {
  const nameTaken = await isBranchNameTaken(data.name);
  if (nameTaken) {
    throw new createError.Conflict(`Branch name "${data.name}" is already taken.`);
  }

  return prisma.branch.create({ data });
};

// Update branch by ID
export const updateBranch = async (
  id: number,
  data: Pick<Branch, 'name' | 'location'>,
): Promise<Branch> => {
  const existingBranch = await getBranchById(id);
  if (!existingBranch) {
    throw new createError.NotFound(`Branch with ID ${id} not found.`);
  }

  if (data.name && data.name !== existingBranch.name) {
    const nameTaken = await isBranchNameTaken(data.name);
    if (nameTaken) {
      throw new createError.Conflict(`Branch name "${data.name}" is already taken.`);
    }
  }

  return prisma.branch.update({
    where: { id },
    data,
  });
};

// Delete branch by ID
export const deleteBranch = async (id: number): Promise<Branch> => {
  const existingBranch = await getBranchById(id);
  if (!existingBranch) {
    throw new createError.NotFound(`Branch with ID ${id} not found.`);
  }

  return prisma.branch.delete({
    where: { id },
  });
};

// Count total branches
export const countBranches = (): Promise<number> => prisma.branch.count();
