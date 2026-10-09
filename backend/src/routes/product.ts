import { Router } from 'express';
import { getProducts, createProduct } from '../controllers/product';
import { validateCreateProduct } from '../middleware/validator';

const productRouter = Router();

productRouter.get('/', getProducts);

productRouter.post('/', validateCreateProduct, createProduct);

export default productRouter;
