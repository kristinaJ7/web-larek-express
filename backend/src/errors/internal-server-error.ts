import AppError from './app-error';

class InternalServerError extends AppError {
  constructor(message: string) {
    super(message, 500);
  }
}

export default InternalServerError;
