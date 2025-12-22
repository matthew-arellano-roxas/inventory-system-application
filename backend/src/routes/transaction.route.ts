import { Router } from 'express';
import { TransactionController } from '@/controllers';
import { CreateTransactionBody, UpdateTransactionBody } from '@/schemas';
import { validateBody } from '@/middlewares/validate';

const transactionRoute: Router = Router();

// List all transactions (supports cursor & limit query)
transactionRoute.get('/', TransactionController.getTransactionList);

// Get a single transaction by ID
transactionRoute.get('/:transactionId', TransactionController.getTransactionById);

// Create a new transaction
transactionRoute.post(
  '/',
  validateBody(CreateTransactionBody),
  TransactionController.createTransaction,
);

// Update a transaction
transactionRoute.put(
  '/:transactionId',
  validateBody(UpdateTransactionBody),
  TransactionController.updateTransaction,
);

// Delete a transaction
transactionRoute.delete('/:transactionId', TransactionController.deleteTransaction);

export { transactionRoute };
