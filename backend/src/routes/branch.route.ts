import { BranchController } from '@/controllers';
import { Router } from 'express';

const branchRoute: Router = Router();

branchRoute.get('/', BranchController.getBranchList); // page will come as ?page=1
branchRoute.get('/:branchId', BranchController.getBranchById);
branchRoute.post('/', BranchController.createBranch);
branchRoute.put('/:branchId', BranchController.updateBranch);
branchRoute.delete('/:branchId', BranchController.deleteBranch);

export { branchRoute };
