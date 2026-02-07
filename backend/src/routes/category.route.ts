import { Router } from 'express';
import { categoryController } from '@/controllers';
import { validateBody } from '@/middlewares/validate';
import { CreateCategoryBody, UpdateCategoryBody } from '@/schemas';
import { cacheMiddleware, invalidateCache } from '@/middlewares/cache';
import { ROUTE, TTL } from '@/enums';
import { checkPermissions } from '@/middlewares';

const categoryRoute: Router = Router();

categoryRoute.get(
  '/',
  checkPermissions(['read:category']),
  cacheMiddleware(TTL.ONE_MINUTE),
  categoryController.getCategoryList,
);
categoryRoute.get(
  '/:categoryId',
  checkPermissions(['read:category']),
  cacheMiddleware(TTL.ONE_MINUTE),
  categoryController.getCategoryById,
);
categoryRoute.post(
  '/',
  checkPermissions(['create:category']),
  validateBody(CreateCategoryBody),
  invalidateCache(ROUTE.CATEGORY),
  categoryController.createCategory,
);
categoryRoute.put(
  '/:categoryId',
  checkPermissions(['update:category']),
  validateBody(UpdateCategoryBody),
  invalidateCache(ROUTE.CATEGORY),
  categoryController.updateCategory,
);
categoryRoute.delete(
  '/:categoryId',
  checkPermissions(['delete:category']),
  invalidateCache(ROUTE.CATEGORY),
  categoryController.deleteCategory,
);

export { categoryRoute };
