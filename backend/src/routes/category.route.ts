import { Router } from 'express';
import { CategoryController } from '@/controllers';
import { validateBody } from '@/middlewares/validate';
import { CreateCategoryBody, UpdateCategoryBody } from '@/schemas';
import { CategoryService } from '@/services';
import { cacheMiddleware, invalidateCache } from '@/middlewares/cacheMiddleware';
import { ROUTE, TTL } from '@/routes/route.constants';

const categoryRoute: Router = Router();
const categoryService = new CategoryService();

// Inject the service into the controller
const categoryController = new CategoryController(categoryService);

categoryRoute.get(
  '/',
  cacheMiddleware(TTL),
  categoryController.getCategoryList.bind(categoryController),
);
categoryRoute.get(
  '/:categoryId',
  cacheMiddleware(TTL),
  categoryController.getCategoryById.bind(categoryController),
);
categoryRoute.post(
  '/',
  [(validateBody(CreateCategoryBody), invalidateCache(ROUTE.CATEGORY))],
  categoryController.createCategory.bind(categoryController),
);
categoryRoute.put(
  '/:categoryId',
  [(validateBody(UpdateCategoryBody), invalidateCache(ROUTE.CATEGORY))],
  categoryController.updateCategory.bind(categoryController),
);
categoryRoute.delete(
  '/:categoryId',
  invalidateCache(ROUTE.CATEGORY),
  categoryController.deleteCategory.bind(categoryController),
);

export { categoryRoute };
