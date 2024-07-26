import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { commonError, createError } from '../utils/error';
import { CustomRequest } from '../types/express';
import dotenv from 'dotenv';

dotenv.config();

const authByToken = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.jwt;

  if (!token) {
    return next(
      createError(
        commonError.NO_ACCESS_TOKEN.name,
        commonError.NO_ACCESS_TOKEN.message,
        401
      )
    );
  }

  try {
    const user = jwt.verify(token, process.env.SECRET_KEY as string);
    req.user = user;
    next();
  } catch (err) {
    next(
      createError(
        commonError.INVALID_TOKEN.name,
        commonError.INVALID_TOKEN.message,
        401
      )
    );
  }
};

export default authByToken;
