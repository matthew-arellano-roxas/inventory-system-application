import { Router } from 'express';
import { TransactionDetailController } from '@/controllers';

const transactionDetailRoute: Router = Router();

transactionDetailRoute.get('/', TransactionDetailController.getTransactionDetailList);
transactionDetailRoute.get(
  '/:transactionDetailId',
  TransactionDetailController.getTransactionDetailById,
);
transactionDetailRoute.post('/', TransactionDetailController.createTransactionDetail);
transactionDetailRoute.put(
  '/:transactionDetailId',
  TransactionDetailController.updateTransactionDetail,
);
transactionDetailRoute.delete(
  '/:transactionDetailId',
  TransactionDetailController.deleteTransactionDetail,
);

export { transactionDetailRoute };
