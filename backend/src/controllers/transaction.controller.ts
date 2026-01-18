import { Response, Request, NextFunction } from 'express';
import { TransactionService } from '@/services/transaction';
import { StatusCodes } from 'http-status-codes';
import { serializeBigInt } from '@/helpers/serialiazeBigInt';
import { ok } from '@/helpers';
import { ROUTE } from '@/routes/route.constants';
import { refreshResourceCache } from '@/helpers/refreshResource';

export class TransactionController {
  private transactionService: TransactionService;

  constructor(transactionService: TransactionService) {
    this.transactionService = transactionService;
  }

  async createTransaction(req: Request, res: Response, _next: NextFunction) {
    const payload = req.body;
    const transaction = await this.transactionService
      .createTransaction(payload)
      .then((t) => serializeBigInt(t));
    refreshResourceCache([ROUTE.STOCK, ROUTE.REPORT, ROUTE.TRANSACTION]);
    res.status(StatusCodes.OK).json(ok(transaction, 'Successfully created transaction'));
  }

  async getTransactions(req: Request, res: Response, _next: NextFunction) {
    const transactions = await this.transactionService.getTransactions();
    res.status(StatusCodes.OK).json(ok(transactions, 'Transactions retrieved'));
  }
}
