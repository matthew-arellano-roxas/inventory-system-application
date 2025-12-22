import { prisma } from '@prisma';
import { Branch, Category, Product, Unit } from '@models';
import createError from 'http-errors';
import { calculateSkip } from '@/helpers';

export class ProductRepository {
  // Create a new product
  async createProduct(
    data: Omit<Product, 'id' | 'createdAt' | 'stock' | 'transactions'>,
  ): Promise<Product> {
    return prisma.product.create({
      data: {
        name: data.name,
        costPerUnit: data.costPerUnit,
        soldBy: data.soldBy,
        addedBy: data.addedBy,
        user: data.user,
        categoryId: data.categoryId,
        branchId: data.branchId,
      },
    });
  }

  // Get a product by its ID, including branch and category
  async getProductById(id: number): Promise<Product & { branch: Branch; category: Category }> {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        branch: true, // include related branch
        category: true, // include related category
      },
    });

    if (!product) throw createError.NotFound(`Product with ID ${id} not found`);
    return product;
  }

  async getProductsByName(name: string) {
    const products = await prisma.product.findMany({
      where: { name },
      include: { branch: true, category: true },
      orderBy: { createdAt: 'desc' },
    });

    if (!products || products.length === 0) {
      throw createError.NotFound(`No products found with name "${name}"`);
    }

    return products;
  }

  // Get all products
  async getAllProducts(page: number = 1, limit: number = 30): Promise<Product[]> {
    const skip = calculateSkip(page, limit);
    return prisma.product.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' }, // optional, order by newest first
    });
  }

  // Update a product by its ID
  async updateProduct(
    id: number,
    data: Partial<{
      name: string;
      costPerUnit: number;
      soldBy: Unit;
      categoryId: number;
      branchId: number;
    }>,
  ): Promise<Product> {
    // Check if the product exists first
    const existingProduct = await prisma.product.findUnique({ where: { id } });
    if (!existingProduct) {
      throw createError.NotFound(`Product with ID ${id} not found`);
    }

    return prisma.product.update({
      where: { id },
      data,
    });
  }

  // Delete a product by its ID
  async deleteProduct(id: number): Promise<Product> {
    // Check if the product exists first
    const existingProduct = await prisma.product.findUnique({ where: { id } });
    if (!existingProduct) {
      throw createError.NotFound(`Product with ID ${id} not found`);
    }

    return prisma.product.delete({
      where: { id },
    });
  }
}
