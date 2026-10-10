import { Router } from 'express';
import createOrder from '../controllers/order';
import { validateCreateOrder } from '../middleware/validator';

const orderRouter = Router();

orderRouter.post('/', validateCreateOrder, createOrder);

export default orderRouter;
