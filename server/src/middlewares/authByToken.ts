import { Request, Response, NextFunction } from 'express';
const jwt = require('jsonwebtoken');
const { commonError, createError } = require('../utils/error');
require('dotenv').config();

interface CustomRequest extends Request {
  user?: any;
}

const authByToken = async (req: CustomRequest, res: Response, next: NextFunction) => {
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
    const user = jwt.verify(token, process.env.JWT_SECRET);
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

module.exports = authByToken;
