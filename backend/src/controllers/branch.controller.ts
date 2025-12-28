import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { BranchService } from '@/services';
import { ok } from '@/helpers/response'; // assuming you have a helper like in ProductController
import { logger } from '@/config';

export const BranchController = {
  // Get paginated branch list
  getBranchList: async (req: Request, res: Response) => {
    logger.info('Get branch list');
    const page = Number(req.query.page) || 1;
    const search = req.query.search as string | undefined;
    const data = await BranchService.getBranches(page, search);

    res.status(StatusCodes.OK).json(ok(data, 'Branch List Retrieved.'));
  },

  // Get a single branch by ID
  getBranchById: async (req: Request, res: Response) => {
    logger.info('Get branch by id');
    const { branchId } = req.params;

    const data = await BranchService.getBranchById(Number(branchId));

    res.status(StatusCodes.OK).json(ok(data, 'Branch Retrieved.'));
  },

  // Create a new branch
  createBranch: async (req: Request, res: Response) => {
    logger.info('Create Branch');
    const body = req.body;

    const data = await BranchService.createBranch(body);

    res.status(StatusCodes.CREATED).json(ok(data, 'New Branch Created.'));
  },

  // Update an existing branch
  updateBranch: async (req: Request, res: Response) => {
    logger.info('Update Branch');
    const { branchId } = req.params;
    const body = req.body;

    const data = await BranchService.updateBranch(Number(branchId), body);

    res.status(StatusCodes.OK).json(ok(data, 'Successfully updated the branch.'));
  },

  // Delete a branch
  deleteBranch: async (req: Request, res: Response) => {
    logger.info('Delete Branch');
    const { branchId } = req.params;

    const data = await BranchService.deleteBranch(Number(branchId));

    res.status(StatusCodes.OK).json(ok(data, 'Branch Deleted.'));
  },

  getBranchSales: async (req: Request, res: Response) => {
    logger.info('Get Branch Sales');
    const data = await BranchService.getBranchSales();
    res.status(StatusCodes.OK).json(ok(data, 'Branch List Retrieved.'));
  },
};
