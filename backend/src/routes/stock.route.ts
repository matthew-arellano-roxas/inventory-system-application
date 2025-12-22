import { Router } from 'express';
import { StockController } from '@/controllers';

const stockRoute: Router = Router();

stockRoute.get('/', StockController.getStockList);
stockRoute.get('/:stockId', StockController.getStockById);
stockRoute.post('/', StockController.createStock);
stockRoute.put('/:stockId', StockController.updateStock);
stockRoute.delete('/:stockId', StockController.deleteStock);

export { stockRoute };
