import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { TransactionDetailService } from '@/services';
import { ok } from '@/helpers/response';
import { logger } from '@/config';

export const TransactionDetailController = {
  // Get transaction details with optional filters
  getTransactionDetailList: async (req: Request, res: Response) => {
    logger.info('Get transaction detail list');

    const branchId = req.query.branchId ? Number(req.query.branchId) : undefined;

    const productId = req.query.productId ? Number(req.query.productId) : undefined;

    const transactionId = req.query.transactionId ? Number(req.query.transactionId) : undefined;

    const data = await TransactionDetailService.getTransactionDetails(
      branchId,
      productId,
      transactionId,
    );

    res.status(StatusCodes.OK).json(ok(data, 'Transaction Detail List Retrieved.'));
  },

  // Get transaction detail by ID
  getTransactionDetailById: async (req: Request, res: Response) => {
    logger.info('Get transaction detail by id');

    const { transactionDetailId } = req.params;

    const data = await TransactionDetailService.getTransactionDetailById(
      Number(transactionDetailId),
    );

    res.status(StatusCodes.OK).json(ok(data, 'Transaction Detail Retrieved.'));
  },

  // Create transaction detail
  createTransactionDetail: async (req: Request, res: Response) => {
    logger.info('Create transaction detail');

    const body = req.body;

    const data = await TransactionDetailService.createTransactionDetail(body);

    res.status(StatusCodes.CREATED).json(ok(data, 'Transaction Detail Created.'));
  },

  // Update transaction detail
  updateTransactionDetail: async (req: Request, res: Response) => {
    logger.info('Update transaction detail');

    const { transactionDetailId } = req.params;
    const body = req.body;

    const data = await TransactionDetailService.updateTransactionDetail(
      Number(transactionDetailId),
      body,
    );

    res.status(StatusCodes.OK).json(ok(data, 'Transaction Detail Updated.'));
  },

  // Delete transaction detail
  deleteTransactionDetail: async (req: Request, res: Response) => {
    logger.info('Delete transaction detail');

    const { transactionDetailId } = req.params;

    const data = await TransactionDetailService.deleteTransactionDetail(
      Number(transactionDetailId),
    );

    res.status(StatusCodes.OK).json(ok(data, 'Transaction Detail Deleted.'));
  },
};
