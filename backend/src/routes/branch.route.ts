import { BranchController } from '@/controllers';
import { Router } from 'express';
import { CreateBranchBody, UpdateBranchBody } from '@/schemas';
import { validateBody } from '@/middlewares/validate';
import { BranchService } from '@/services';
import { cacheMiddleware, invalidateCache } from '@/middlewares/cacheMiddleware';
import { ROUTE, TTL } from '@/routes/route.constants';

const branchRoute: Router = Router();
const branchService = new BranchService();
const branchController = new BranchController(branchService);

branchRoute.get('/', cacheMiddleware(TTL), branchController.getBranchList.bind(branchController));
branchRoute.get(
  '/:branchId',
  cacheMiddleware(TTL),
  branchController.getBranchById.bind(branchController),
);
branchRoute.post(
  '/',
  [validateBody(CreateBranchBody), invalidateCache(ROUTE.BRANCH)],
  branchController.createBranch.bind(branchController),
);
branchRoute.put(
  '/:branchId',
  [validateBody(UpdateBranchBody), invalidateCache(ROUTE.BRANCH)],
  branchController.updateBranch.bind(branchController),
);
branchRoute.delete(
  '/:branchId',
  invalidateCache('/api/branch'),
  branchController.deleteBranch.bind(branchController),
);

export { branchRoute };
