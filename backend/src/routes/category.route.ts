import { Router } from 'express';
import { CategoryController } from '@/controllers';
import { validateBody } from '@/middlewares/validate';
import { CreateCategoryBody, UpdateCategoryBody } from '@/schemas';
import { CategoryService } from '@/services';

const categoryRoute: Router = Router();
const categoryService = new CategoryService();

// Inject the service into the controller
const categoryController = new CategoryController(categoryService);

categoryRoute.get('/', categoryController.getCategoryList.bind(categoryController));
categoryRoute.get('/:categoryId', categoryController.getCategoryById.bind(categoryController));
categoryRoute.post(
  '/',
  validateBody(CreateCategoryBody),
  categoryController.createCategory.bind(categoryController),
);
categoryRoute.put(
  '/:categoryId',
  validateBody(UpdateCategoryBody),
  categoryController.updateCategory.bind(categoryController),
);
categoryRoute.delete('/:categoryId', categoryController.deleteCategory.bind(categoryController));

export { categoryRoute };
