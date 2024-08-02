import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { commonError, createError } from '../utils/error';
import { CustomRequest } from '../types/express';
import dotenv from 'dotenv';

dotenv.config();

function getSecretKey(): string {
  const secretKey = process.env.SECRET_KEY;
  if (!secretKey) {
    throw new Error("SECRET_KEY is not defined in the environment variables.");
  }
  return secretKey;
}

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
    const secretKey = getSecretKey();
    const user = jwt.verify(token, secretKey);
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
