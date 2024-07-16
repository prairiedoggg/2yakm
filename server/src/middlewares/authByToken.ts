import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { commonError, createError } from '../utils/error';

interface CustomRequest extends Request {
  user?: string | object;
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
    const user = await jwt.verify(token, process.env.SECRET_KEY as string);
    req.user = user;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return next(
        createError(
          commonError.INVALID_TOKEN.name,
          commonError.INVALID_TOKEN.message,
          401
        )
      );
    }

    if (error instanceof jwt.TokenExpiredError) {
      // 토큰 만료 시 처리
      res.clearCookie('jwt');
      return next(
        createError(
          commonError.EXPIRED_TOKEN.name,
          commonError.EXPIRED_TOKEN.message,
          401
        )
      );
    }

    next(error);
  }
};

export { authByToken };
