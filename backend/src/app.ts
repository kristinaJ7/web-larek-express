import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import path from 'path';
import winston from 'winston';
import expressWinston from 'express-winston';

import productRouter from './routes/product';
import orderRouter from './routes/order';
import { errorHandler } from './middleware/error-handler';
import { NotFoundError } from './errors/not-found-error';

const app = express();

// CORS и парсинг тела запроса — самые первые
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Статика — до роутов
app.use(express.static(path.join(__dirname, '../public')));

// --- ЛОГИРОВАНИЕ (Шаг 5) ---

// requestLogger: ДО роутов — логирует все входящие запросы
const requestLogger = expressWinston.logger({
  transports: [new winston.transports.File({ filename: 'request.log' })],
  format: winston.format.json(),
});

// errorLogger: ПОСЛЕ роутов, но ДО errorHandler — ловит ошибки перед отправкой ответа
const errorLogger = expressWinston.errorLogger({
  transports: [new winston.transports.File({ filename: 'error.log' })],
  format: winston.format.json(),
});

app.use(requestLogger);

// --- РОУТЫ ---
app.use('/product', productRouter);
app.use('/order', orderRouter);

// --- 404 ---
app.use((req, res, next) => {
  next(new NotFoundError(`Route ${req.originalUrl} not found`));
});

// --- ОШИБКИ ---
app.use(errorLogger); // пишет ошибки в error.log
app.use(errorHandler); // формирует HTTP-ответ клиенту

// Подключение к MongoDB
mongoose
  .connect('mongodb://127.0.0.1:27017/weblarek')
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Запуск сервера
app.listen(3000, () => {
  console.log('listening on port 3000');
});
