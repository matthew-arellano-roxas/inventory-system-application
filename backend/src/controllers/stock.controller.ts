import { Response, Request, NextFunction } from 'express';
import { StockService } from '@/services';
import { StatusCodes } from 'http-status-codes';
import createHttpError from 'http-errors';
import { logger } from '@/config';
import { ok } from '@/helpers/response';

export class StockController {
  private stockService: StockService;

  constructor(stockService: StockService) {
    this.stockService = stockService;
  }

  async getStockMovements(req: Request, res: Response, _next: NextFunction) {
    logger.info('Get stock movements');
    const stocks = await this.stockService.getStockMovements();
    res.status(StatusCodes.OK).json(ok(stocks, 'Stock movements retrieved'));
  }

  async getStockMovementsByProductId(req: Request, res: Response, _next: NextFunction) {
    logger.info('Get stock movements by product id');
    const productId = Number(req.query.productId);
    if (Object.is(productId, NaN))
      throw new createHttpError.BadRequest('Please provide a valid product id');
    const stocks = await this.stockService.getStockMovementsByProductId(productId);
    res
      .status(StatusCodes.OK)
      .json(ok(stocks, `Stock movements for product ${productId} retrieved`));
  }

  async getProductStock(req: Request, res: Response, _next: NextFunction) {
    logger.info('Get product stock');
    const productId = Number(req.params.productId);
    if (Object.is(productId, NaN))
      throw new createHttpError.BadRequest('Please provide a valid product id');
    const productStock = await this.stockService.getProductStock(productId);
    res.status(StatusCodes.OK).json(ok(productStock, 'Product stock retrieved'));
  }
}
