import { Router } from 'express';
import { CategoryController } from '@/controllers';

const categoryRoute: Router = Router();

categoryRoute.get('/', CategoryController.getCategoryList);
categoryRoute.get('/:categoryId', CategoryController.getCategoryById);
categoryRoute.post('/', CategoryController.createCategory);
categoryRoute.put('/:categoryId', CategoryController.updateCategory);
categoryRoute.delete('/:categoryId', CategoryController.deleteCategory);

export { categoryRoute };
