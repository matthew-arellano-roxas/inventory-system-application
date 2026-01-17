import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { BranchService } from '@/services';
import { ok } from '@/helpers/response';
import createHttpError from 'http-errors';

export class BranchController {
  private branchService: BranchService;

  constructor(branchService: BranchService) {
    this.branchService = branchService;
  }

  // Get paginated branch list
  getBranchList = async (req: Request, res: Response) => {
    const page = Number(req.query.page) || 1;
    const search = req.query.search as string | undefined;
    const data = await this.branchService.getBranches(page, search);
    res.status(StatusCodes.OK).json(ok(data, 'Branch List Retrieved.'));
  };

  // Get a single branch by ID
  getBranchById = async (req: Request, res: Response) => {
    const { branchId } = req.params;
    const data = await this.branchService.getBranchById(Number(branchId));
    res.status(StatusCodes.OK).json(ok(data, 'Branch Retrieved.'));
  };

  // Create a new branch
  createBranch = async (req: Request, res: Response) => {
    const body = req.body;
    const data = await this.branchService.createBranch(body);
    res.status(StatusCodes.CREATED).json(ok(data, 'New Branch Created.'));
  };

  // Update an existing branch
  updateBranch = async (req: Request, res: Response) => {
    const { branchId } = req.params;
    const body = req.body;
    const data = await this.branchService.updateBranch(Number(branchId), body);
    res.status(StatusCodes.OK).json(ok(data, 'Successfully updated the branch.'));
  };

  // Delete a branch
  deleteBranch = async (req: Request, res: Response) => {
    const { branchId } = req.params;
    const data = await this.branchService.deleteBranch(Number(branchId));
    res.status(StatusCodes.OK).json(ok(data, 'Branch Deleted.'));
  };

  // Get all branch stock/reports
  getBranchReports = async (req: Request, res: Response) => {
    const data = await this.branchService.getBranchReports();
    res.status(StatusCodes.OK).json(ok(data, 'Branch Stock Retrieved.'));
  };

  // Get branch sales/report by branch ID
  getBranchReportByBranchId = async (req: Request, res: Response) => {
    const branchId = req.params.branchId ? Number(req.params.branchId) : undefined;
    if (branchId === undefined) {
      throw new createHttpError.BadRequest('branchId is required.');
    }
    const data = await this.branchService.getBranchReportByBranchId(branchId);
    res.status(StatusCodes.OK).json(ok(data, 'Branch Sales Retrieved.'));
  };
}
