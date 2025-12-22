import { Router } from 'express';
import { TransactionController } from '@/controllers';

const transactionRoute: Router = Router();

// List all transactions (supports cursor & limit query)
transactionRoute.get('/', TransactionController.getTransactionList);

// Get a single transaction by ID
transactionRoute.get('/:transactionId', TransactionController.getTransactionById);

// Create a new transaction
transactionRoute.post('/', TransactionController.createTransaction);

// Update a transaction
transactionRoute.put('/:transactionId', TransactionController.updateTransaction);

// Delete a transaction
transactionRoute.delete('/:transactionId', TransactionController.deleteTransaction);

export { transactionRoute };
