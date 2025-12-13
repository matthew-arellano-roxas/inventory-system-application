import { Router } from 'express';
import {
  getCatalogSummaryController,
  getBranchCatalogController,
  updateBranchController,
  createBranchController,
  deleteBranchController
} from './catalog.controller';
import { asyncHandler } from '@/shared/helpers/asynchandler';
import { validateBody } from '@/shared/middlewares/validateBody';
import { updateBranchSchema, branchSchema } from '@/shared/branch/branch.schema';

const catalogRoute = Router();

catalogRoute.get('/', asyncHandler(getCatalogSummaryController));

catalogRoute.get('/branch', asyncHandler(getBranchCatalogController));
catalogRoute.put('/branch/:id', validateBody(updateBranchSchema), asyncHandler(updateBranchController));
catalogRoute.post("/branch", validateBody(branchSchema), asyncHandler(createBranchController))
catalogRoute.delete('/branch/:id', asyncHandler(deleteBranchController));

export { catalogRoute };
