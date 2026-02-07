import { stockController } from '@/controllers';

import { Router } from 'express';
import { cacheMiddleware } from '@/middlewares/cache';
import { TTL } from '@/enums';
import { checkPermissions } from '@/middlewares';

const stockRoute: Router = Router();
stockRoute.use(checkPermissions(['read:stock']));
stockRoute.use(cacheMiddleware(TTL.ONE_MINUTE));

stockRoute.get('/', stockController.getStockMovements);
stockRoute.get('/search', stockController.getStockMovementsByProductId);
stockRoute.get('/product/:productId', stockController.getProductStock);

export { stockRoute };
