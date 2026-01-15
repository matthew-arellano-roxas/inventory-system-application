import { StockController } from '@/controllers/stock.controller';
import { StockService } from '@/services';
import { Router } from 'express';

const stockRoute: Router = Router();

const stockService = new StockService();
const stockController = new StockController(stockService);

stockRoute.get('/', stockController.getStockMovements.bind(stockController));
stockRoute.get('/search', stockController.getStockMovementsByProductId.bind(stockController));
stockRoute.get('/product/:productId', stockController.getProductStock.bind(stockController));

export { stockRoute };
