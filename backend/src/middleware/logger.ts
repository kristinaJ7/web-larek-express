import winston from 'winston';
import expressWinston from 'express-winston';

// Логгер запросов — сохраняет каждый запрос в request.log
export const requestLogger = expressWinston.logger({
  transports: [
    new winston.transports.File({ filename: 'request.log' }),
  ],
  format: winston.format.json(),
});

// Логгер ошибок — сохраняет ошибки в error.log
export const errorLogger = expressWinston.errorLogger({
  transports: [
    new winston.transports.File({ filename: 'error.log' }),
  ],
  format: winston.format.json(),
});
