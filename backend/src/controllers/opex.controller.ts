// src/controllers/opex.controller.ts
import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ok } from '@/helpers/response';
import { opexService } from '@/services';
import { GetOpexQueryType, CreateOpexBodyType, DeleteOpexParamsType } from '@/schemas';

// Get paginated OPEX list
const getOpexList = async (req: Request, res: Response) => {
  const { page, branchId } = req.query as unknown as GetOpexQueryType;

  const data = await opexService.getOPEX(page, branchId);
  res.status(StatusCodes.OK).json(ok(data, 'Operational Expenses List Retrieved.'));
};

// Create new OPEX
const createOpex = async (req: Request, res: Response) => {
  const body = req.body as CreateOpexBodyType;

  const data = await opexService.createOPEX(body);
  res.status(StatusCodes.CREATED).json(ok(data, 'New Operational Expense Created.'));
};

// Delete OPEX
const deleteOpex = async (req: Request, res: Response) => {
  const { id } = req.params as unknown as DeleteOpexParamsType;
  const data = await opexService.deleteOPEX(id);
  res.status(StatusCodes.OK).json(ok(data, 'Operational Expense Deleted.'));
};

export const opexController = {
  getOpexList,
  createOpex,
  deleteOpex,
};
