import { prisma } from '@prisma';
import { calculateSkip } from '@/helpers';
import createError from 'http-errors';
import { Product } from '@models';
import { Prisma } from '@models';
import { BranchService, CategoryService } from '@/services';
import { GetProductQuery } from '@/schemas';
import type { ProductDetail } from '@/types/product';
import createHttpError from 'http-errors';

const itemLimit = Number(process.env.PAGINATION_ITEM_LIMIT);

export class ProductService {
  private branchService: BranchService;
  private categoryService: CategoryService;

  constructor(categoryService: CategoryService, branchService: BranchService) {
    this.branchService = branchService;
    this.categoryService = categoryService;
  }

  // Get products with optional filters
  async getProducts(query: GetProductQuery): Promise<ProductDetail[]> {
    const where: Prisma.ProductWhereInput = {};
    // details in query not true means will not show product details
    const select: Prisma.ProductSelect | undefined = query.details
      ? undefined
      : {
          id: true,
          name: true,
        };

    where.categoryId = query.categoryId;
    where.branchId = query.branchId;
    where.soldBy = query.soldBy;

    where.name = {
      contains: query.search,
      mode: 'insensitive',
    };
    // Calculation for pagination
    const skip = calculateSkip(query.page, itemLimit);
    const productData = await prisma.product.findMany({
      select,
      where,
      orderBy: { id: 'asc' },
      take: itemLimit,
      skip,
    });
    return productData as ProductDetail[];
  }

  async getProductById(id: number): Promise<Product> {
    const product = await prisma.product.findFirst({ where: { id } });
    if (!product) throw new createError.NotFound('Product Not Found.');
    // Get Overall Stock & Transaction
    return product;
  }

  async createProduct(data: Omit<Product, 'id' | 'createdAt'>) {
    const branch = await this.branchService.getBranchById(data.branchId);
    const category = await this.categoryService.getCategoryById(data.categoryId);
    if (!branch) throw new createHttpError.NotFound('Branch does not exist.');
    if (!category) throw new createHttpError.NotFound('Category does not exist.');
    if (data.costPerUnit > data.sellingPrice)
      throw new createHttpError.BadRequest('Cost per unit cannot be greater than selling price.');

    return prisma.$transaction(async (tx) => {
      const product = await tx.product.create({
        data: { ...data, createdAt: new Date() },
      });

      await tx.productReport.create({
        data: { productId: product.id },
      });

      return product;
    });
  }

  async updateProduct(id: number, data: Partial<Omit<Product, 'createdAt' | 'id'>>) {
    await this.getProductById(id);
    return await prisma.product.update({
      where: { id },
      data,
    });
  }

  async deleteProduct(id: number): Promise<Product> {
    await this.getProductById(id);
    return await prisma.product.delete({ where: { id } });
  }

  async getReportByProductId(id: number) {
    return await prisma.productReport.findFirst({
      where: { productId: id },
    });
  }
}
