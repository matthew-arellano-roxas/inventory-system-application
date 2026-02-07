import { Router } from 'express';
import { transactionController } from '@/controllers';
import { ROUTE } from '@/enums/product.enums';
import { cacheMiddleware, invalidateCache } from '@/middlewares/cache';
import { validateBody } from '@/middlewares/validate';
import { transactionSchema } from '@/schemas/transaction.schema';
import { TTL } from '@/enums';
import { checkPermissions } from '@/middlewares';

const transactionRoute = Router();

transactionRoute.post(
  '/',
  checkPermissions(['create:transaction']),
  validateBody(transactionSchema),
  invalidateCache(ROUTE.TRANSACTION),
  transactionController.createTransaction,
);
transactionRoute.get(
  '/',
  checkPermissions(['read:transaction']),
  cacheMiddleware(TTL.ONE_MINUTE),
  transactionController.getTransactions,
);

export { transactionRoute };
