import { ProductController } from '@/controllers';
import { UpdateProductBody } from '@/schemas';
import { Router } from 'express';
import { validateBody } from '@/middlewares/validate';

const productRoute: Router = Router();

productRoute.get('/', ProductController.getProductList);
productRoute.get('/:page', ProductController.getProductList);
productRoute.get('/:productId', ProductController.getProductById);
productRoute.post('/', ProductController.createProduct);
productRoute.put('/:productId', validateBody(UpdateProductBody), ProductController.updateProduct);
productRoute.delete('/:productId', ProductController.deleteProduct);

export { productRoute };
