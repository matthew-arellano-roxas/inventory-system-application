import { StatusCodes } from 'http-status-codes';
import { stockService } from '@/services';
import createHttpError from 'http-errors';
import { ok } from '@/helpers/response';
import { Controller } from '@/types/controller.type';

// Get stock movements
export const getStockMovements: Controller = async (req, res, _next) => {
  const stocks = await stockService.getStockMovements();
  res.status(StatusCodes.OK).json(ok(stocks, 'Stock movements retrieved'));
};

// Get stock movements by product ID
export const getStockMovementsByProductId: Controller = async (req, res, _next) => {
  const productId = Number(req.query.productId);

  if (Object.is(productId, NaN)) {
    throw new createHttpError.BadRequest('Please provide a valid product id');
  }

  const stocks = await stockService.getStockMovementsByProductId(productId);

  res.status(StatusCodes.OK).json(ok(stocks, `Stock movements for product ${productId} retrieved`));
};

// Get product stock
export const getProductStock: Controller = async (req, res, _next) => {
  const productId = Number(req.params.productId);

  if (Object.is(productId, NaN)) {
    throw new createHttpError.BadRequest('Please provide a valid product id');
  }

  const productStock = await stockService.getProductStock(productId);
  res.status(StatusCodes.OK).json(ok(productStock, 'Product stock retrieved'));
};

export const stockController = {
  getStockMovements,
  getStockMovementsByProductId,
  getProductStock,
};
