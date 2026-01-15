import { ProductController } from '@/controllers';
import { CreateProductBody, UpdateProductBody } from '@/schemas';
import { Router } from 'express';
import { validateBody } from '@/middlewares/validate';
import { BranchService, CategoryService, ProductService } from '@/services';

const productRoute: Router = Router();
// Create an instance of the service
const branchService = new BranchService();
const categoryService = new CategoryService();
const productService = new ProductService(categoryService, branchService);

// Inject the service into the controller
const productController = new ProductController(productService);

productRoute.get('/report', productController.getProductStock.bind(productController));
productRoute.get('/', productController.getProductList.bind(productController));
productRoute.post(
  '/',
  validateBody(CreateProductBody),
  productController.createProduct.bind(productController),
);

productRoute.get('/:productId', productController.getProductById.bind(productController));
productRoute.put(
  '/:productId',
  validateBody(UpdateProductBody),
  productController.updateProduct.bind(productController),
);
productRoute.delete('/:productId', productController.deleteProduct.bind(productController));

export { productRoute };
