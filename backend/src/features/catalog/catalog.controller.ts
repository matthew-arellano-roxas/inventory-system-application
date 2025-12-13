import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { countBranches, getBranches, updateBranch, createBranch, deleteBranch } from '@/shared/branch/branch.service';
import { Branch } from '@models';
import { countCategories } from '@/shared/category/category.service';
import { countProducts } from '@/shared/product/product.service';
import { logger } from '@root/config';
import { ok } from '@/shared/types';
import { BranchInput } from '@/shared/branch/branch.schema';

export async function getCatalogSummaryController(req: Request, res: Response) {
  const productCount: number = await countProducts();
  const categoryCount: number = await countCategories();
  const branchCount: number = await countBranches();

  const data = {
    productCount,
    categoryCount,
    branchCount,
  };

  logger.info('Catalog item total successfully retrieved.');
  res.status(StatusCodes.OK).json(ok(data, 'Catalog item total successfully retrieved.'));
}

export async function getBranchCatalogController(req: Request, res: Response) {
  const data: Branch[] = await getBranches();
  logger.info('Successfully retrieved branches.');
  res.status(StatusCodes.OK).json(ok(data, 'Successfully retrieved branches.'));
}

export async function updateBranchController(req: Request, res: Response) {
  const payload = req.body;
  const id = Number(req.params.id);
  const updatedData: Branch = await updateBranch(id, payload);
  logger.info(`Branch ${id} successfully updated.`);
  res.status(StatusCodes.OK).json(ok(updatedData, 'Branch updated successfully'));
}

export async function createBranchController(req: Request, res: Response){
  const payload: BranchInput = req.body;
  const createdData = await createBranch(payload);
  logger.info(`Branch ${createdData.id} successfully created.`);
  res.status(StatusCodes.OK).json(ok(createdData, 'Branch created successfully'));
}

export async function deleteBranchController(req: Request, res: Response){
  const id = Number(req.params.id);
  await deleteBranch(id);
  logger.info(`Branch ${id} successfully deleted.`);
  res.status(StatusCodes.OK).json(ok(null, 'Branch deleted successfully'));
}