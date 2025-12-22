import { Category } from '@models';
import { prisma } from '@prisma';
import createError from 'http-errors';

export class CategoryRepository {
  // Create a new category
  async createCategory(data: Omit<Category, 'id' | 'createdAt' | 'product'>): Promise<Category> {
    return prisma.category.create({ data });
  }

  // Get a category by its ID
  async getCategoryById(id: number): Promise<Category> {
    const category = await prisma.category.findUnique({ where: { id } });
    if (!category) throw createError.NotFound(`Category with ID ${id} not found`);
    return category;
  }

  async getCategoryByName(name: string): Promise<Category> {
    const category = await prisma.category.findUnique({ where: { name } });
    if (!category) throw createError.NotFound(`Category with name "${name}" not found`);
    return category;
  }

  // Get all categories
  async getAllCategories(): Promise<Category[]> {
    return prisma.category.findMany({
      orderBy: { name: 'asc' }, // optional, order by name
    });
  }

  // Update a category by its ID
  async updateCategory(
    id: number,
    data: Partial<Omit<Category, 'id' | 'createdAt' | 'product'>>,
  ): Promise<Category> {
    const existingCategory = await prisma.category.findUnique({ where: { id } });
    if (!existingCategory) throw createError.NotFound(`Category with ID ${id} not found`);

    return prisma.category.update({ where: { id }, data });
  }

  // Delete a category by its ID
  async deleteCategory(id: number): Promise<Category> {
    const existingCategory = await prisma.category.findUnique({ where: { id } });
    if (!existingCategory) throw createError.NotFound(`Category with ID ${id} not found`);

    return prisma.category.delete({ where: { id } });
  }
}
