import { BranchController } from '@/controllers';
import { Router } from 'express';
import { CreateBranchBody, UpdateBranchBody } from '@/schemas';
import { validateBody } from '@/middlewares/validate';
import { BranchService } from '@/services';

const branchRoute: Router = Router();
const branchService = new BranchService();
const branchController = new BranchController(branchService);

branchRoute.get('/', branchController.getBranchList.bind(branchController));
branchRoute.get('/report', branchController.getBranchReports.bind(branchController));
branchRoute.get(
  '/report/:branchId',
  branchController.getBranchReportByBranchId.bind(branchController),
);
branchRoute.get('/:branchId', branchController.getBranchById.bind(branchController));
branchRoute.post(
  '/',
  validateBody(CreateBranchBody),
  branchController.createBranch.bind(branchController),
);
branchRoute.put(
  '/:branchId',
  validateBody(UpdateBranchBody),
  branchController.updateBranch.bind(branchController),
);
branchRoute.delete('/:branchId', branchController.deleteBranch.bind(branchController));

export { branchRoute };
