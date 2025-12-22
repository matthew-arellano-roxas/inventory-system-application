import { Router } from 'express';
import { CategoryController } from '@/controllers';
import { validateBody } from '@/middlewares/validate';
import { CreateCategoryBody, UpdateCategoryBody } from '@/schemas';

const categoryRoute: Router = Router();

categoryRoute.get('/', CategoryController.getCategoryList);
categoryRoute.get('/:categoryId', CategoryController.getCategoryById);
categoryRoute.post('/', validateBody(CreateCategoryBody), CategoryController.createCategory);
categoryRoute.put(
  '/:categoryId',
  validateBody(UpdateCategoryBody),
  CategoryController.updateCategory,
);
categoryRoute.delete('/:categoryId', CategoryController.deleteCategory);

export { categoryRoute };
