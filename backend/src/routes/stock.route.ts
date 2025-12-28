import { Router } from 'express';
import { StockController } from '@/controllers';
import { CreateStockBody, UpdateBranchBody } from '@/schemas';
import { validateBody } from '@/middlewares/validate';

const stockRoute: Router = Router();

stockRoute.get('/', StockController.getStockList);
stockRoute.get('/:stockId', StockController.getStockById);
stockRoute.post('/', validateBody(CreateStockBody), StockController.createStock);
stockRoute.put('/:stockId', validateBody(UpdateBranchBody), StockController.updateStock);
stockRoute.delete('/:stockId', StockController.deleteStock);
export { stockRoute };
