import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { TransactionService } from '@/services';
import { ok } from '@/helpers/response';
import { logger } from '@/config';

export const TransactionController = {
  // List all transactions with optional cursor (infinite scroll)
  getTransactionList: async (req: Request, res: Response) => {
    logger.info('Get transaction list');
    const limit = req.query.limit ? Number(req.query.limit) : 20;
    const cursorDate = req.query.cursor ? new Date(req.query.cursor as string) : undefined;
    const data = await TransactionService.getTransactions(cursorDate, limit);

    res.status(StatusCodes.OK).json(ok(data, 'Transaction List Retrieved.'));
  },

  // Get a single transaction by ID
  getTransactionById: async (req: Request, res: Response) => {
    logger.info('Get transaction by ID');
    const { transactionId } = req.params;
    const data = await TransactionService.getTransactionById(Number(transactionId));
    res.status(StatusCodes.OK).json(ok(data, 'Transaction Retrieved.'));
  },

  // Create a new transaction
  createTransaction: async (req: Request, res: Response) => {
    logger.info('Create transaction');
    const payload = req.body;
    const data = await TransactionService.createTransaction(payload);
    res.status(StatusCodes.CREATED).json(ok(data, 'Transaction Created.'));
  },

  // Update an existing transaction
  updateTransaction: async (req: Request, res: Response) => {
    logger.info('Update transaction');
    const { transactionId } = req.params;
    const payload = req.body;
    const data = await TransactionService.updateTransaction(Number(transactionId), payload);
    res.status(StatusCodes.OK).json(ok(data, 'Transaction Updated.'));
  },

  // Delete a transaction
  deleteTransaction: async (req: Request, res: Response) => {
    logger.info('Delete transaction');
    const { transactionId } = req.params;
    const data = await TransactionService.deleteTransaction(Number(transactionId));
    res.status(StatusCodes.OK).json(ok(data, 'Transaction Deleted.'));
  },
};
