import { ProductController } from '@/controllers';
import { Router } from 'express';

const productRoute: Router = Router();

productRoute.get('/', ProductController.getProductList);
productRoute.get('/:page', ProductController.getProductList);
productRoute.get('/:productId', ProductController.getProductById);
productRoute.post('/', ProductController.createProduct);
productRoute.put('/:productId', ProductController.updateProduct);
productRoute.delete('/:productId', ProductController.deleteProduct);

export { productRoute };
