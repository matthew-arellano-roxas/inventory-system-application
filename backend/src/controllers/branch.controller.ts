import { StatusCodes } from 'http-status-codes';
import { ok } from '@/helpers/response';
import { branchService } from '@/services';
import { Controller } from '@/types/controller.type';

// Get paginated branch list
const getBranchList: Controller = async (req, res, _next) => {
  const page = Number(req.query.page) || 1;
  const search = req.query.search as string | undefined;
  const data = await branchService.getBranches(page, search);
  res.status(StatusCodes.OK).json(ok(data, 'Branch List Retrieved.'));
};

// Get a single branch by ID
const getBranchById: Controller = async (req, res, _next) => {
  const { branchId } = req.params;
  const data = await branchService.getBranchById(Number(branchId));
  res.status(StatusCodes.OK).json(ok(data, 'Branch Retrieved.'));
};

// Create a new branch
const createBranch: Controller = async (req, res, _next) => {
  const body = req.body;
  const data = await branchService.createBranch(body);
  res.status(StatusCodes.CREATED).json(ok(data, 'New Branch Created.'));
};

// Update an existing branch
const updateBranch: Controller = async (req, res, _next) => {
  const { branchId } = req.params;
  const body = req.body;
  const data = await branchService.updateBranch(Number(branchId), body);
  res.status(StatusCodes.OK).json(ok(data, 'Successfully updated the branch.'));
};

// Delete a branch
const deleteBranch: Controller = async (req, res, _next) => {
  const { branchId } = req.params;
  const data = await branchService.deleteBranch(Number(branchId));
  res.status(StatusCodes.OK).json(ok(data, 'Branch Deleted.'));
};

export const branchController = {
  getBranchList,
  getBranchById,
  createBranch,
  updateBranch,
  deleteBranch,
};
