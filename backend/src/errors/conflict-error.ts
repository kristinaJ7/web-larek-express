import AppError from './app-error';

class ConflictError extends AppError {
  constructor(message: string) {
    super(message, 409);
  }
}

export default ConflictError;
