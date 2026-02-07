import { branchController } from '@/controllers';
import { Router } from 'express';
import { CreateBranchBody, UpdateBranchBody } from '@/schemas';
import { validateBody } from '@/middlewares/validate';
import { cacheMiddleware, invalidateCache } from '@/middlewares/cache';
import { ROUTE, TTL } from '@/enums';
import { checkPermissions } from '@/middlewares';

const branchRoute: Router = Router();

branchRoute.get(
  '/',
  checkPermissions(['read:branch']),
  cacheMiddleware(TTL.ONE_MINUTE),
  branchController.getBranchList,
);
branchRoute.get(
  '/:branchId',
  checkPermissions(['read:branch']),
  cacheMiddleware(TTL.ONE_MINUTE),
  branchController.getBranchById,
);
branchRoute.post(
  '/',
  checkPermissions(['create:branch']),
  validateBody(CreateBranchBody),
  invalidateCache(ROUTE.BRANCH),
  branchController.createBranch,
);
branchRoute.put(
  '/:branchId',
  checkPermissions(['update:branch']),
  validateBody(UpdateBranchBody),
  invalidateCache(ROUTE.BRANCH),
  branchController.updateBranch,
);
branchRoute.delete(
  '/:branchId',
  checkPermissions(['delete:branch']),
  invalidateCache('/api/branch'),
  branchController.deleteBranch,
);

export { branchRoute };
