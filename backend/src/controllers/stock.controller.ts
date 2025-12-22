import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { StockService } from '@/services';
import { ok } from '@/helpers/response';
import { logger } from '@/config';

export const StockController = {
  // Get all stocks (optionally filtered by productId)
  getStockList: async (req: Request, res: Response) => {
    logger.info('Get stock list');

    const productId = req.query.productId ? Number(req.query.productId) : undefined;
    const limit = req.query.limit ? Number(req.query.limit) : 20; // default 20 items
    const cursor = req.query.cursor ? Number(req.query.cursor) : undefined;

    const data = await StockService.getStocks({ productId, limit, cursor });

    res.status(StatusCodes.OK).json(ok(data, 'Stock List Retrieved.'));
  },

  // Get single stock by ID
  getStockById: async (req: Request, res: Response) => {
    logger.info('Get stock by id');

    const { stockId } = req.params;

    const data = await StockService.getStockById(Number(stockId));

    res.status(StatusCodes.OK).json(ok(data, 'Stock Retrieved.'));
  },

  // Add new stock for a product
  createStock: async (req: Request, res: Response) => {
    logger.info('Create stock');

    const body = req.body;

    const data = await StockService.createStock(body);

    res.status(StatusCodes.CREATED).json(ok(data, 'Stock Created.'));
  },

  // Update stock quantity
  updateStock: async (req: Request, res: Response) => {
    logger.info('Update stock');

    const { stockId } = req.params;
    const body = req.body;

    const data = await StockService.updateStock(Number(stockId), body);

    res.status(StatusCodes.OK).json(ok(data, 'Stock Updated.'));
  },

  // Delete stock record
  deleteStock: async (req: Request, res: Response) => {
    logger.info('Delete stock');

    const { stockId } = req.params;

    const data = await StockService.deleteStock(Number(stockId));

    res.status(StatusCodes.OK).json(ok(data, 'Stock Deleted.'));
  },
};
