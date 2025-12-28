import { BranchController } from '@/controllers';
import { Router } from 'express';
import { CreateBranchBody, UpdateBranchBody } from '@/schemas';
import { validateBody } from '@/middlewares/validate';

const branchRoute: Router = Router();

branchRoute.get('/', BranchController.getBranchList);
branchRoute.get('/sales', BranchController.getBranchSales); // Sales for each branch
branchRoute.get('/:branchId', BranchController.getBranchById);
branchRoute.post('/', validateBody(CreateBranchBody), BranchController.createBranch);
branchRoute.put('/:branchId', validateBody(UpdateBranchBody), BranchController.updateBranch);
branchRoute.delete('/:branchId', BranchController.deleteBranch);

export { branchRoute };
