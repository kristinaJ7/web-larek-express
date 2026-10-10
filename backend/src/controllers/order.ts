import { Request, Response, NextFunction } from 'express';
import { faker } from '@faker-js/faker';
import mongoose from 'mongoose';
import validator from 'validator';
import Product from '../models/product';
import BadRequestError from '../errors/bad-request-errors';

const createOrder = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const {
      payment, email, phone, address, total, items,
    } = req.body;

    // 1. Валидация обязательных полей
    if (
      !payment
      || !email
      || !phone
      || !address
      || total === undefined
      || !items
      || !Array.isArray(items)
      || items.length === 0
    ) {
      throw new BadRequestError('Missing required fields');
    }

    // 2. Валидация payment
    if (!['card', 'online'].includes(payment)) {
      throw new BadRequestError('Invalid payment type. Allowed: card, online');
    }

    // 3. Валидация email
    if (!validator.isEmail(email)) {
      throw new BadRequestError('Invalid email structure');
    }

    // 4. Валидация phone и address
    if (typeof phone !== 'string' || phone.trim() === '') {
      throw new BadRequestError('Invalid phone number');
    }
    if (typeof address !== 'string' || address.trim() === '') {
      throw new BadRequestError('Invalid address');
    }

    // 5. Валидация total
    if (typeof total !== 'number' || total <= 0) {
      throw new BadRequestError('Total must be a positive number');
    }

    // 6. Конвертация ID в ObjectId
    const objectIds = items.map((id: string) => {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return null;
      }
      return new mongoose.Types.ObjectId(id);
    });

    if (objectIds.some((id) => id === null)) {
      throw new BadRequestError('One or more items have invalid ID format');
    }

    // 7. Поиск товаров
    const products = await Product.find({ _id: { $in: objectIds } });

    // 8. Проверка: все ли товары найдены
    if (products.length !== items.length) {
      const foundIds = new Set(products.map((p) => p._id.toString()));
      const missingIds = items.filter((id) => !foundIds.has(id));
      throw new BadRequestError(
        `One or more items not found or invalid. Missing IDs: ${missingIds.join(', ')}`,
      );
    }

    // 9. Расчёт суммы и проверка цен
    let calculatedTotal = 0;
    products.forEach((product) => {
      if (product.price === null || product.price === undefined) {
        throw new BadRequestError(
          'One or more items have invalid price (null or undefined)',
        );
      }
      calculatedTotal += product.price;
    });

    // 10. Сравнение переданной суммы с реальной
    if (calculatedTotal !== total) {
      throw new BadRequestError('Total mismatch');
    }

    // 11. Генерация ID заказа
    const orderId = faker.string.uuid();

    // 12. Успешный ответ
    res.status(201).json({
      id: orderId,
      total: calculatedTotal,
    });
  } catch (error) {
    next(error);
  }
};

export default createOrder;
