import { Router } from 'express';
import { reportController } from '@/controllers/report.controller';
import { cacheMiddleware } from '@/middlewares/cache';
import { TTL } from '@/enums';
import { checkPermissions } from '@/middlewares';

const reportRoute: Router = Router();

reportRoute.use(checkPermissions(['read:report']));
reportRoute.use(cacheMiddleware(TTL.ONE_MINUTE));

reportRoute.get('/monthly', reportController.getMonthlyReport);
reportRoute.get('/current-month', reportController.getCurrentMonthReport);
reportRoute.get('/product', reportController.getProductReport);
reportRoute.get('/product/:productId', reportController.getProductReportByProductId);
reportRoute.get('/branch', reportController.getBranchReport);
reportRoute.get('/branch/:branchId', reportController.getBranchReportByBranchId);

export { reportRoute };
