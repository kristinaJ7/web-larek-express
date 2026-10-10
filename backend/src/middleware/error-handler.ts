import { Request, Response, NextFunction } from 'express';
import { CelebrateError } from 'celebrate';
import AppError from '../errors/app-error';

const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  // 1. Сначала обрабатываем ошибки валидации от celebrate → 400
  if (err instanceof CelebrateError) {
    // Можно отдать детали валидации, чтобы фронтенд понял, какое поле не прошло
    return res.status(400).json({
      message: 'Validation error',
      details: err.details,
    });
  }

  // 2. Потом твои кастомные ошибки (AppError и наследники) → их статус
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ message: err.message });
  }

  // 3. Всё остальное → 500
  // console.error(err); // если ESLint снова ругается — оставь закомментированным
  return res.status(500).json({ message: 'Internal Server Error' });
};

export default errorHandler;
