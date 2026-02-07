import { StatusCodes } from 'http-status-codes';
import { ok } from '@/helpers/response';
import { GetProductQuery } from '@/schemas';
import { Controller } from '@/types/controller.type';
import { productService } from '@/services';

// Get paginated product list with optional filters
const getProductList: Controller = async (req, res, _next) => {
  const query = GetProductQuery.parse(req.query);
  const data = await productService.getProducts(query);
  res.status(StatusCodes.OK).json(ok(data, 'Product List Retrieved.'));
};

// Get a single product by ID
const getProductById: Controller = async (req, res, _next) => {
  const { productId } = req.params;
  const data = await productService.getProductById(Number(productId));
  res.status(StatusCodes.OK).json(ok(data, 'Product Retrieved.'));
};

// Create a new product
const createProduct: Controller = async (req, res, _next) => {
  const body = req.body;
  const data = await productService.createProduct(body);
  res.status(StatusCodes.CREATED).json(ok(data, 'New Product Created.'));
};

// Update a product
const updateProduct: Controller = async (req, res, _next) => {
  const { productId } = req.params;
  const body = req.body;
  const data = await productService.updateProduct(Number(productId), body);
  res.status(StatusCodes.OK).json(ok(data, 'Product Updated Successfully.'));
};

// Delete a product
const deleteProduct: Controller = async (req, res, _next) => {
  const { productId } = req.params;
  const data = await productService.deleteProduct(Number(productId));
  res.status(StatusCodes.OK).json(ok(data, 'Product Deleted.'));
};

export const productController = {
  getProductList,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
