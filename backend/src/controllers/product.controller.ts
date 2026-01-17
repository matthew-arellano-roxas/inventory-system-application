import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ProductService } from '@/services';
import { ok } from '@/helpers/response';
import { GetProductQuery } from '@/schemas';
import createHttpError from 'http-errors';

export class ProductController {
  private productService: ProductService;

  constructor(productService: ProductService) {
    this.productService = productService;
  }

  // Get paginated product list with optional filters
  getProductList = async (req: Request, res: Response) => {
    const query = GetProductQuery.parse(req.query);
    const data = await this.productService.getProducts(query);
    res.status(StatusCodes.OK).json(ok(data, 'Product List Retrieved.'));
  };

  // Get a single product by ID
  getProductById = async (req: Request, res: Response) => {
    const { productId } = req.params;
    const data = await this.productService.getProductById(Number(productId));
    res.status(StatusCodes.OK).json(ok(data, 'Product Retrieved.'));
  };

  // Create a new product
  createProduct = async (req: Request, res: Response) => {
    const body = req.body;
    const data = await this.productService.createProduct(body);
    res.status(StatusCodes.CREATED).json(ok(data, 'New Product Created.'));
  };

  // Update a product
  updateProduct = async (req: Request, res: Response) => {
    const { productId } = req.params;
    const body = req.body;
    const data = await this.productService.updateProduct(Number(productId), body);
    res.status(StatusCodes.OK).json(ok(data, 'Product Updated Successfully.'));
  };

  // Delete a product
  deleteProduct = async (req: Request, res: Response) => {
    const { productId } = req.params;
    const data = await this.productService.deleteProduct(Number(productId));
    res.status(StatusCodes.OK).json(ok(data, 'Product Deleted.'));
  };

  // Get product stock/report
  getProductStock = async (req: Request, res: Response) => {
    const productId = req.query.productId ? Number(req.query.productId) : undefined;
    if (productId === undefined) {
      throw new createHttpError.BadRequest('productId is required.');
    }
    const data = await this.productService.getReportByProductId(productId);
    res.status(StatusCodes.OK).json(ok(data, 'Product Stock Retrieved.'));
  };
}
