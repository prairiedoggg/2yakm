import { Response, Request, NextFunction } from 'express';
import Joi from 'joi';
import {
  addPill,
  updatePill,
  getPills,
  deletePill,
  getPillsExpiringTodayService
} from '../services/mypillService';

import { createError } from '../utils/error'; // Assuming a custom error handler is defined here
import { ParsedQs } from 'qs';

export const createPillSchema = Joi.object({
  name: Joi.string().required(),
  expiredat: Joi.string().required(),
  alarmstatus: Joi.boolean().required()
});

export const updatePillSchema = Joi.object({
  mypillid: Joi.string().required(),
  name: Joi.string().required(),
  expiredat: Joi.string().required(),
  alarmstatus: Joi.boolean().required()
});

// Define the request user interface
interface RequestUser {
  id: string;
}

// Extend the Request interface to include the user and query types
interface AuthenticatedRequest<QueryType extends ParsedQs = ParsedQs>
  extends Request {
  user?: RequestUser;
  query: QueryType;
}

interface GetMyPillsQuery extends ParsedQs {
  limit?: string;
  offset?: string;
  sortedBy?: string;
  order?: string;
}

export const addMyPill = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;
    if (!user) {
      return next(createError('UnauthorizedError', 'Unauthorized', 401));
    }
    const userId = user.id;
    const { error, value } = createPillSchema.validate(req.body);

    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const newPill = await addPill(userId, value);
    res.status(200).json(newPill);
  } catch (error) {
    next(error);
  }
};

export const updateMyPill = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;
    if (!user) {
      return next(createError('UnauthorizedError', 'Unauthorized', 401));
    }
    const mypillId = req.params.mypillid;
    const { error, value } = updatePillSchema.validate({
      mypillid: mypillId,
      ...req.body
    });

    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const updatedPill = await updatePill(mypillId, value);
    res.status(200).json(updatedPill);
  } catch (error) {
    next(error);
  }
};

export const getMyPills = async (
  req: AuthenticatedRequest<GetMyPillsQuery>,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;
    if (!user) {
      return next(createError('UnauthorizedError', 'Unauthorized', 401));
    }
    const userId = user.id;
    const limit = parseInt(req.query.limit ?? '10', 10);
    const offset = parseInt(req.query.offset ?? '0', 10);
    const sortedBy = req.query.sortedBy ?? 'createdat';
    const order = (req.query.order?.toUpperCase() as 'ASC' | 'DESC') ?? 'DESC';

    const pills = await getPills(userId, limit, offset, sortedBy, order);
    res.status(200).json(pills);
  } catch (error) {
    next(error);
  }
};

export const deleteMyPill = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;
    if (!user) {
      return next(createError('UnauthorizedError', 'Unauthorized', 401));
    }
    const mypillId = req.params.mypillid;
    if (!mypillId) {
      return res.status(400).json({ message: 'mypillid is required' });
    }
    const result = await deletePill(mypillId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getPillsExpiringToday = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const userId = req.user?.id; // Assuming you have user ID available in the request

  if (!userId) {
    return next(createError('UnauthorizedError', 'Unauthorized', 401));
  }

  try {
    const pills = await getPillsExpiringTodayService(userId);
    return res.status(200).json(pills);
  } catch (error) {
    return next(error);
  }
};
