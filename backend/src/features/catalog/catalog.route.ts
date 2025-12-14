import { Router } from 'express';
import {
  getCatalogSummaryController,
  getBranchCatalogController,
  updateBranchController,
  createBranchController,
  deleteBranchController,
} from './catalog.controller';
import { validateBody } from '@/shared/middlewares/validateBody';
import { updateBranchSchema, branchSchema } from '@/shared/branch/branch.schema';

const catalogRoute = Router();

catalogRoute.get('/', getCatalogSummaryController);

catalogRoute.get('/branch', getBranchCatalogController);
catalogRoute.put('/branch/:id', validateBody(updateBranchSchema), updateBranchController);
catalogRoute.post('/branch', validateBody(branchSchema), createBranchController);
catalogRoute.delete('/branch/:id', deleteBranchController);

export { catalogRoute };
