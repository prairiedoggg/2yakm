import { Request, Response, NextFunction } from 'express';

// 커스텀 에러
class CustomError extends Error {
  public status: number;
  public name: string;

  constructor(name: string, message: string, status: number) {
    super(message);
    this.name = name;
    this.status = status;
  }
}

// 에러 핸들러
const errorHandler = (err: CustomError, req: Request, res: Response, next: NextFunction) => {
  console.error(`[${err.name}] ${err.message}`);

  res.status(err.status).json({
    error: {
      name: err.name,
      message: err.status >= 500 ? 'Internal server error' : err.message
    }
  });
};

// 404 핸들러
const notFoundHandler = (err: CustomError, req: Request, res: Response, next: NextFunction) => {
  console.error(`[${err.name}] ${err.message}`);

  res.status(err.status || 404).json({
    error: {
      name: err.name,
      message: err.message
    }
  });
};

export { CustomError, errorHandler, notFoundHandler };