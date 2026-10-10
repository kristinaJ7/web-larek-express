import dotenv from 'dotenv';

import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import path from 'path';
import winston from 'winston';
import expressWinston from 'express-winston';

import productRouter from './routes/product';
import orderRouter from './routes/order';
import errorHandler from './middleware/error-handler';
import NotFoundError from './errors/not-found-error';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));

// Логирование запросов
const requestLogger = expressWinston.logger({
  transports: [new winston.transports.File({ filename: 'request.log' })],
  format: winston.format.json(),
});

// Логирование ошибок
const errorLogger = expressWinston.errorLogger({
  transports: [new winston.transports.File({ filename: 'error.log' })],
  format: winston.format.json(),
});

app.use(requestLogger);
app.use('/product', productRouter);
app.use('/order', orderRouter);

// 404
app.use((_req, _res, next) => next(new NotFoundError('Route not found')));

// Обработка ошибок
app.use(errorLogger);
app.use(errorHandler);

// Подключение к БД из env
const dbAddress = process.env.DB_ADDRESS;
if (!dbAddress) {
  console.error('Ошибка: переменная DB_ADDRESS не задана в .env');
  process.exit(1);
}

mongoose
  .connect(dbAddress)
  .then(() => {

  })
  .catch((err) => {
    console.error('MongoDB connection failed:', err);
    process.exit(1);
  });

// Порт из env, с fallback на 3000
const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

app.listen(PORT, () => {
  // Пустой колбэк: чтобы не было console.log и конфликтов с линтером
});
