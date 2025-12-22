import { prisma } from '@prisma';
import { calculateSkip } from '@/helpers';
import createError from 'http-errors';
import { Category } from '@models';
import { nowPH } from '@/helpers';
const itemLimit = 30;

export const CategoryService = {
  // Get a paginated list of categories
  async getCategories(page: number = 1) {
    const skip = calculateSkip(page, itemLimit);

    return await prisma.category.findMany({
      orderBy: { id: 'asc' },
      take: itemLimit,
      skip,
      include: {
        product: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  },

  // Get a single category by its ID
  async getCategoryById(id: number) {
    if (typeof id !== 'number' || isNaN(id)) {
      throw new createError.BadRequest('Invalid category ID.');
    }

    const category = await prisma.category.findUnique({
      where: { id }, // findUnique is safer for primary keys
    });

    if (!category) throw new createError.NotFound('Category Not Found.');

    return category;
  },

  // Create a new category
  async createCategory(data: Omit<Category, 'id' | 'createdAt'>) {
    // Check if a category with the same name already exists
    const existing = await prisma.category.findUnique({
      where: { name: data.name },
    });

    if (existing) throw new createError.Conflict('Category Already Exists.');

    return await prisma.category.create({ data: { ...data, createdAt: nowPH() } });
  },

  // Update an existing category
  async updateCategory(id: number, data: Partial<Omit<Category, 'createdAt' | 'id'>>) {
    const category = await this.getCategoryById(id);
    if (!category) throw new createError.NotFound('Category not found.');
    return await prisma.category.update({
      where: { id },
      data,
    });
  },

  // Delete a category
  async deleteCategory(id: number) {
    const category = await this.getCategoryById(id);
    if (!category) throw new createError.NotFound('Category not found.');
    return await prisma.category.delete({ where: { id } });
  },
};
