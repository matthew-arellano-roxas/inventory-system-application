import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ProductService } from '@/services';
import { ok } from '@/helpers/response';
import { logger } from '@/config';
import { GetProductQuery } from '@/schemas';

export const ProductController = {
  // Get paginated product list with optional filters
  getProductList: async (req: Request, res: Response) => {
    const query = GetProductQuery.parse(req.query);
    const data = await ProductService.getProducts(query);
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
