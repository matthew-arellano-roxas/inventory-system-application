import { Response, Request, NextFunction } from 'express';
import { TransactionService } from '@/services/transaction';
import { StatusCodes } from 'http-status-codes';
import { logger } from '@/config';
import { serializeBigInt } from '@/helpers/serialiazeBigInt';

export class TransactionController {
  private transactionService: TransactionService;

  constructor(transactionService: TransactionService) {
    this.transactionService = transactionService;
  }

  async createTransaction(req: Request, res: Response, _next: NextFunction) {
    const payload = req.body;
    logger.info('Create transaction');
    const transaction = await this.transactionService
      .createTransaction(payload)
      .then((t) => serializeBigInt(t));
    res.status(StatusCodes.OK).json(transaction);
  }

  async getTransactions(req: Request, res: Response, _next: NextFunction) {
    logger.info('Get transactions');
    const transactions = await this.transactionService.getTransactions();
    res.status(StatusCodes.OK).json(transactions);
  }
}
