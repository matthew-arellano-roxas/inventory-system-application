import { Router } from 'express';
import { TransactionService } from '@/services/transaction';
import { TransactionController } from '@/controllers/transaction.controller';
import { BranchService, CategoryService, ProductService } from '@/services';
import { ROUTE } from '@/routes/route.constants';
import { cacheMiddleware, invalidateCache } from '@/middlewares/cacheMiddleware';
import { validateBody } from '@/middlewares/validate';
import { transactionSchema } from '@/schemas/transaction.schema';
import { TTL } from '@/routes/route.constants';

const transactionRoute = Router();

const categoryService = new CategoryService();
const branchService = new BranchService();
const productService = new ProductService(categoryService, branchService);
const transactionService = new TransactionService(productService);
const transactionController = new TransactionController(transactionService);

transactionRoute.post(
  '/',
  [validateBody(transactionSchema), invalidateCache(ROUTE.TRANSACTION)],
  transactionController.createTransaction.bind(transactionController),
);
transactionRoute.get(
  '/',
  cacheMiddleware(TTL),
  transactionController.getTransactions.bind(transactionController),
);

export { transactionRoute };
