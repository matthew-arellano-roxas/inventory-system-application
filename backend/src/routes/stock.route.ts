import { StockController } from '@/controllers/stock.controller';
import { StockService } from '@/services';
import { Router } from 'express';
import { cacheMiddleware } from '@/middlewares/cacheMiddleware';
import { TTL } from './route.constants';

const stockRoute: Router = Router();

const stockService = new StockService();
const stockController = new StockController(stockService);

stockRoute.get('/', cacheMiddleware(TTL), stockController.getStockMovements.bind(stockController));
stockRoute.get(
  '/search',
  cacheMiddleware(TTL),
  stockController.getStockMovementsByProductId.bind(stockController),
);
stockRoute.get(
  '/product/:productId',
  cacheMiddleware(TTL),
  stockController.getProductStock.bind(stockController),
);

export { stockRoute };
