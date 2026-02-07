import { prisma } from '@prisma';
import { calculateSkip } from '@/helpers';
import createError from 'http-errors';
import { Category } from '@models';
import { CategoryWhereInput } from '@root/generated/prisma/models';

const itemLimit = Number(process.env.PAGINATION_ITEM_LIMIT);

// Get a paginated list of categories
const getCategories = async (page: number = 1, search?: string): Promise<Category[]> => {
  const skip = calculateSkip(page, itemLimit);
  const where: CategoryWhereInput = {
    name: {
      contains: search,
      mode: 'insensitive',
    },
  };

  return await prisma.category.findMany({
    orderBy: { id: 'asc' },
    take: itemLimit,
    skip,
    where,
  });
};

// Get a single category by its ID
const getCategoryById = async (id: number): Promise<Category> => {
  if (typeof id !== 'number' || isNaN(id)) {
    throw new createError.BadRequest('Invalid category ID.');
  }

  const category = await prisma.category.findUnique({ where: { id } });
  if (!category) throw new createError.NotFound('Category Not Found.');
  return category;
};

// Create a new category
const createCategory = async (data: Omit<Category, 'id' | 'createdAt'>): Promise<Category> => {
  const category = await prisma.category.findFirst({ where: { name: data.name } });
  if (category) throw new createError.Conflict('Category Already Exists.');

  return await prisma.category.create({ data: { ...data, createdAt: new Date() } });
};

// Update an existing category
const updateCategory = async (
  id: number,
  data: Partial<Omit<Category, 'createdAt' | 'id'>>,
): Promise<Category> => {
  const category = await getCategoryById(id);
  if (!category) throw new createError.NotFound('Category not found.');
  return await prisma.category.update({ where: { id }, data });
};

// Delete a category
const deleteCategory = async (id: number): Promise<Category> => {
  const category = await getCategoryById(id);
  if (!category) throw new createError.NotFound('Category not found.');
  return await prisma.category.delete({ where: { id } });
};

export const categoryService = {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
