import { productController } from '@/controllers';
import { CreateProductBody, UpdateProductBody } from '@/schemas';
import { Router } from 'express';
import { validateBody } from '@/middlewares/validate';
import { cacheMiddleware, invalidateCache } from '@/middlewares/cache';
import { ROUTE, TTL } from '@/enums';
import { checkPermissions } from '@/middlewares';

const productRoute: Router = Router();

productRoute.get(
  '/count',
  checkPermissions(['read:product']),
  cacheMiddleware(TTL.ONE_MINUTE),
  productController.getProductCount,
);
productRoute.get(
  '/',
  checkPermissions(['read:product']),
  cacheMiddleware(TTL.ONE_MINUTE),
  productController.getProductList,
);
productRoute.post(
  '/',
  checkPermissions(['create:product']),
  validateBody(CreateProductBody),
  invalidateCache(ROUTE.PRODUCT),
  productController.createProduct,
);

productRoute.get(
  '/:productId',
  checkPermissions(['read:product']),
  cacheMiddleware(TTL.ONE_MINUTE),
  productController.getProductById,
);
productRoute.put(
  '/:productId',
  checkPermissions(['update:product']),
  validateBody(UpdateProductBody),
  invalidateCache(ROUTE.PRODUCT),
  productController.updateProduct,
);
productRoute.delete(
  '/:productId',
  checkPermissions(['delete:product']),
  invalidateCache(ROUTE.PRODUCT),
  productController.deleteProduct,
);

export { productRoute };
