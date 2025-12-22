import { Request, Response } from 'express';
import { ProductService } from '@/services';
import { StatusCodes } from 'http-status-codes';
import { ok } from '@/helpers';
import { logger } from '@/config';

export const ProductController = {
  getProductList: async (req: Request, res: Response) => {
    logger.info('Get product list');

    // Get page from query params, default to 1
    const page = Number(req.query.page) || 1;

    // Get category from query params if provided
    const category = req.query.category ? Number(req.query.category) : undefined;

    // Fetch products, optionally filtered by category
    const data = await ProductService.getProducts(page, category);

    res.status(StatusCodes.OK).json(ok(data, 'Product List Retrieved.'));
  },

  getProductById: async (req: Request, res: Response) => {
    logger.info('Get product by id');
    const { productId } = req.params;
    const data = await ProductService.getProductById(Number(productId));
    res.status(StatusCodes.OK).json(ok(data, 'Product Retrieved.'));
  },

  createProduct: async (req: Request, res: Response) => {
    logger.info('Create Product');
    const body = req.body;
    const data = await ProductService.createProduct(body);
    res.status(StatusCodes.CREATED).json(ok(data, 'New Product Created.'));
  },

  updateProduct: async (req: Request, res: Response) => {
    logger.info('Update Product');
    const body = req.body;
    const productId = req.params.productId;
    const data = await ProductService.updateProduct(Number(productId), body);
    res.status(StatusCodes.OK).json(ok(data, 'Successfully updated the product.'));
  },

  deleteProduct: async (req: Request, res: Response) => {
    logger.info('Delete Product');
    const productId = req.params.productId;
    const data = await ProductService.deleteProduct(Number(productId));
    res.status(StatusCodes.OK).json(ok(data, 'Product Deleted.'));
  },
};
