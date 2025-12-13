import { prisma } from '@prisma';
import { Category } from '@models';
import createError from 'http-errors';

// Get all categories
export const getCategories = (): Promise<Category[]> =>
  prisma.category.findMany({
    orderBy: { name: 'asc' },
  });

// Get category by ID
export const getCategoryById = (id: number): Promise<Category | null> =>
  prisma.category.findUnique({
    where: { id },
  });

// Get category by name (case-insensitive)
export const getCategoryByName = (name: string): Promise<Category | null> =>
  prisma.category.findFirst({
    where: { name: { equals: name, mode: 'insensitive' } },
  });

// Check if category name already exists
export const isCategoryNameTaken = async (name: string): Promise<boolean> => {
  const category = await prisma.category.findFirst({
    where: { name: { equals: name, mode: 'insensitive' } },
  });
  return Boolean(category);
};

// Create a new category
export const createCategory = async (data: Pick<Category, 'name'>): Promise<Category> => {
  const nameTaken = await isCategoryNameTaken(data.name);
  if (nameTaken) {
    throw new createError.Conflict(`Category name "${data.name}" is already taken.`);
  }

  return prisma.category.create({ data });
};

// Update category by ID
export const updateCategory = async (
  id: number,
  data: Pick<Category, 'name'>,
): Promise<Category> => {
  const existingCategory = await getCategoryById(id);
  if (!existingCategory) {
    throw new createError.NotFound(`Category with ID ${id} not found.`);
  }

  if (data.name && data.name !== existingCategory.name) {
    const nameTaken = await isCategoryNameTaken(data.name);
    if (nameTaken) {
      throw new createError.Conflict(`Category name "${data.name}" is already taken.`);
    }
  }

  return prisma.category.update({
    where: { id },
    data,
  });
};

// Delete category by ID
export const deleteCategory = async (id: number): Promise<Category> => {
  const existingCategory = await getCategoryById(id);
  if (!existingCategory) {
    throw new createError.NotFound(`Category with ID ${id} not found.`);
  }

  return prisma.category.delete({
    where: { id },
  });
};

// Count total categories
export const countCategories = (): Promise<number> => prisma.category.count();
