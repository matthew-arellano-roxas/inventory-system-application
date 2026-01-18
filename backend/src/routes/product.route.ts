import { ProductController } from '@/controllers';
import { CreateProductBody, UpdateProductBody } from '@/schemas';
import { Router } from 'express';
import { validateBody } from '@/middlewares/validate';
import { BranchService, CategoryService, ProductService } from '@/services';
import { cacheMiddleware, invalidateCache } from '@/middlewares/cacheMiddleware';
import { ROUTE, TTL } from '@/routes/route.constants';

const productRoute: Router = Router();
// Create an instance of the service
const branchService = new BranchService();
const categoryService = new CategoryService();
const productService = new ProductService(categoryService, branchService);

// Inject the service into the controller
const productController = new ProductController(productService);

productRoute.get(
  '/',
  cacheMiddleware(TTL),
  productController.getProductList.bind(productController),
);
productRoute.post(
  '/',
  [validateBody(CreateProductBody), invalidateCache(ROUTE.PRODUCT)],
  productController.createProduct.bind(productController),
);

productRoute.get(
  '/:productId',
  cacheMiddleware(TTL),
  productController.getProductById.bind(productController),
);
productRoute.put(
  '/:productId',
  [validateBody(UpdateProductBody), invalidateCache(ROUTE.PRODUCT)],
  productController.updateProduct.bind(productController),
);
productRoute.delete(
  '/:productId',
  invalidateCache(ROUTE.PRODUCT),
  productController.deleteProduct.bind(productController),
);

export { productRoute };
