import { StatusCodes } from 'http-status-codes';
import createHttpError from 'http-errors';
import { serializeBigInt } from '@/helpers/serialiazeBigInt';
import { ok } from '@/helpers';
import { ROUTE } from '@/enums/product.enums';
import { refreshResourceCache } from '@/helpers/refreshResource';
import { Controller } from '@/types/controller.type';
import { transactionService } from '@/services';

export const createTransaction: Controller = async (req, res, _next) => {
  const payload = req.body;
  const transaction = await transactionService
    .createTransaction(payload)
    .then((t) => serializeBigInt(t));

  refreshResourceCache([ROUTE.STOCK, ROUTE.REPORT, ROUTE.TRANSACTION]);

  res.status(StatusCodes.OK).json(ok(transaction, 'Successfully created transaction'));
};

// Get transactions
export const getTransactions: Controller = async (req, res, _next) => {
  const transactions = await transactionService.getTransactions();
  res.status(StatusCodes.OK).json(ok(transactions, 'Transactions retrieved'));
};

export const rollbackTransaction: Controller = async (req, res, _next) => {
  const transactionId = Number(req.params.transactionId);

  if (Number.isNaN(transactionId)) {
    throw new createHttpError.BadRequest('Invalid transaction id.');
  }

  const transaction = await transactionService
    .rollbackTransaction(transactionId)
    .then((t) => serializeBigInt(t));

  refreshResourceCache([ROUTE.STOCK, ROUTE.REPORT, ROUTE.TRANSACTION]);

  res.status(StatusCodes.OK).json(ok(transaction, 'Successfully rolled back transaction'));
};

export const transactionController = {
  createTransaction,
  getTransactions,
  rollbackTransaction,
};
