import { celebrate, Joi } from 'celebrate';

// 1. Валидация создания товара (POST)
export const validateCreateProduct = celebrate({
  body: Joi.object().keys({
    title: Joi.string().required().min(2).max(30),
    price: Joi.number().required().min(1),
    image: Joi.string().uri().required(),
    category: Joi.string().required(),
    description: Joi.string().required().min(10).max(200),
  }),
});

// 2. Валидация создания заказа (POST)
export const validateCreateOrder = celebrate({
  body: Joi.object().keys({
    payment: Joi.string().valid('card', 'online').required(),
    email: Joi.string().email().required(),
    phone: Joi.string().required(),
    address: Joi.string().required(),
    total: Joi.number().positive().required(),
    items: Joi.array()
      .items(Joi.string().hex().length(24))
      .min(1)
      .required(),
  }),
});

// 3. Валидация ObjectId в параметрах URL (для DELETE/PATCH)
export const validateObjId = celebrate({
  params: Joi.object().keys({
    productId: Joi.string().hex().length(24).required(),
  }),
});

// 4. Валидация тела для частичного обновления (PATCH) — все поля optional()
export const validateProductUpdateBody = celebrate({
  body: Joi.object().keys({
    title: Joi.string().min(2).max(30).optional(),
    price: Joi.number().min(1).optional(),
    image: Joi.string().uri().optional(),
    category: Joi.string().optional(),
    description: Joi.string().min(10).max(200).optional(),
  }),
});
