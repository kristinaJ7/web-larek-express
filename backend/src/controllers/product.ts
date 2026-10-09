import { Request, Response, NextFunction } from 'express';
import { Error as MongooseError } from 'mongoose';
import Product from '../models/product';
import { BadRequestError } from '../errors/bad-request-errors';
import { ConflictError } from '../errors/conflict-error';

// GET /product — возвращает все товары
export const getProducts = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const items = await Product.find();
    res.send({ items, total: items.length });
  } catch (error) {
    next(error); // непредвиденная ошибка → 500
  }
};

// POST /product — создаёт новый товар
export const createProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).send(product);
  } catch (error) {
    // 409 — дубликат уникального поля (title)
    if (error instanceof Error && error.message.includes('E11000')) {
      return next(new ConflictError('Товар с таким заголовком уже существует'));
    }
    // 400 — ошибка валидации данных
    if (error instanceof MongooseError.ValidationError) {
      return next(new BadRequestError(error.message));
    }
    // 500 — всё остальное
    next(error);
  }
};
