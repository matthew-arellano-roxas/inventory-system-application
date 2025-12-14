import { prisma } from '@prisma';
import { Category } from '@models';
import createError from 'http-errors';

// Get all categories
export class CategoryService {
  // Get all categories
  getCategories(): Promise<Category[]> {
    return prisma.category.findMany({
      orderBy: { name: 'asc' },
    });
  }

  // Get category by ID
  getCategoryById(id: number): Promise<Category | null> {
    return prisma.category.findUnique({
      where: { id },
    });
  }

  // Get category by name (case-insensitive)
  getCategoryByName(name: string): Promise<Category | null> {
    return prisma.category.findFirst({
      where: { name: { equals: name, mode: 'insensitive' } },
    });
  }

  // Check if category name already exists
  async isCategoryNameTaken(name: string): Promise<boolean> {
    const category = await prisma.category.findFirst({
      where: { name: { equals: name, mode: 'insensitive' } },
    });
    return Boolean(category);
  }

  // Create a new category
  async createCategory(data: Pick<Category, 'name'>): Promise<Category> {
    const nameTaken = await this.isCategoryNameTaken(data.name);
    if (nameTaken) {
      throw new createError.Conflict(`Category name "${data.name}" is already taken.`);
    }

    return prisma.category.create({ data });
  }

  // Update category by ID
  async updateCategory(id: number, data: Pick<Category, 'name'>): Promise<Category> {
    const existingCategory = await this.getCategoryById(id);
    if (!existingCategory) {
      throw new createError.NotFound(`Category with ID ${id} not found.`);
    }

    if (data.name && data.name !== existingCategory.name) {
      const nameTaken = await this.isCategoryNameTaken(data.name);
      if (nameTaken) {
        throw new createError.Conflict(`Category name "${data.name}" is already taken.`);
      }
    }

    return prisma.category.update({
      where: { id },
      data,
    });
  }

  // Delete category by ID
  async deleteCategory(id: number): Promise<Category> {
    const existingCategory = await this.getCategoryById(id);
    if (!existingCategory) {
      throw new createError.NotFound(`Category with ID ${id} not found.`);
    }

    return prisma.category.delete({
      where: { id },
    });
  }

  // Count total categories
  countCategories(): Promise<number> {
    return prisma.category.count();
  }
}
