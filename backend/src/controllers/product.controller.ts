import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ProductService } from '@/services';
import { ok } from '@/helpers/response';
import { logger } from '@/config';
import { Unit } from '@root/generated/prisma/enums';

export const ProductController = {
  // Get paginated product list with optional filters
  getProductList: async (req: Request, res: Response) => {
    const page = Number(req.query.page) || 1;
    const category = req.query.category ? Number(req.query.category) : undefined;
    const branchId = req.query.branchId ? Number(req.query.branchId) : undefined;

    // Ensure the value matches the ENUM KEYS (PC, KG), not the @map values
    let soldBy: Unit | undefined;
    if (req.query.soldBy) {
      const input = String(req.query.soldBy).toUpperCase();
      if (input === 'PC' || input === 'KG') {
        soldBy = input as Unit;
      }
    }

    const data = await ProductService.getProducts(page, category, branchId, soldBy);
    res.status(StatusCodes.OK).json(ok(data, 'Product List Retrieved.'));
  },

  // Get a single product by ID
  getProductById: async (req: Request, res: Response) => {
    logger.info('Get product by id');
    const { productId } = req.params;
    const data = await ProductService.getProductById(Number(productId));
    res.status(StatusCodes.OK).json(ok(data, 'Product Retrieved.'));
  },

  // Create a new product
  createProduct: async (req: Request, res: Response) => {
    logger.info('Create Product');
    const body = req.body;
    const data = await ProductService.createProduct(body);
    res.status(StatusCodes.CREATED).json(ok(data, 'New Product Created.'));
  },

  // Update a product
  updateProduct: async (req: Request, res: Response) => {
    logger.info('Update Product');
    const { productId } = req.params;
    const body = req.body;
    const data = await ProductService.updateProduct(Number(productId), body);
    res.status(StatusCodes.OK).json(ok(data, 'Product Updated Successfully.'));
  },

  // Delete a product
  deleteProduct: async (req: Request, res: Response) => {
    logger.info('Delete Product');
    const { productId } = req.params;
    const data = await ProductService.deleteProduct(Number(productId));
    res.status(StatusCodes.OK).json(ok(data, 'Product Deleted.'));
  },
};
