import { Response, Request, NextFunction } from 'express';
import {
  getPills,
  getPillById,
  searchPillsbyName,
  searchPillsbyEfficacy,
  searchPillsByImage,
  getPillFavoriteCountService,
  getPillReviewCountService
} from '../services/pillService';
import { createError } from '../utils/error'; // Assuming a custom error handler is defined here

interface PillsQueryParams {
  limit?: string;
  offset?: string;
  sortedBy?: string;
  order?: 'ASC' | 'DESC';
}

export const getPillsHandler = async <T extends PillsQueryParams>(
  req: Request<unknown, unknown, unknown, T>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const limit = parseInt(req.query.limit ?? '10', 10);
    const offset = parseInt(req.query.offset ?? '0', 10);
    const sortedBy = req.query.sortedBy ?? 'favorite_count';
    const order = req.query.order?.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    const pills = await getPills(limit, offset, sortedBy, order);
    res.status(200).json(pills);
  } catch (error: unknown) {
    next(createError('DatabaseError', (error as Error).message, 500));
  }
};

export const getPillByIdHandler = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    const pill = await getPillById(id);
    if (pill) {
      res.status(200).json(pill);
    } else {
      res.status(404).json({ message: 'Pill not found' });
    }
  } catch (error: unknown) {
    next(createError('DatabaseError', (error as Error).message, 500));
  }
};

interface QueryParams {
  name: string;
  limit?: string;
  offset?: string;
  sortedBy?: string;
  searchBy?: 'name' | 'engname';
  order?: 'ASC' | 'DESC';
}

interface RequestParams {
  id: string;
}

export const searchPillsbyNameHandler = async (
  req: Request<unknown, unknown, unknown, QueryParams>,
  res: Response,
  next: NextFunction
)=> {
  const name = req.query.name;
  const offset = parseInt(req.query.offset ?? '0', 10);
  const limit = parseInt(req.query.limit ?? '10', 10);
 
  if (!name) {
    return res.status(400).json({ message: 'name query parameter is required' });
  }

  try {
    const pills = await searchPillsbyName(name, limit, offset);
    res.status(200).json(pills);
  } catch (error: unknown) {
    next(createError('DatabaseError', (error as Error).message, 500));
  }
};


interface EfficacyQueryParams {
  efficacy: string;
  limit?: string;
  offset?: string;
}

export const searchPillsbyEfficacyHandler = async (
  req: Request<unknown, unknown, unknown, EfficacyQueryParams>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const efficacy = req.query.efficacy;
    const offset = parseInt(req.query.offset ?? '0', 10);
    const limit = parseInt(req.query.limit ?? '10', 10);
    const pills = await searchPillsbyEfficacy(efficacy, limit, offset);
    res.status(200).json(pills);
  } catch (error: unknown) {
    next(createError('DatabaseError', (error as Error).message, 500));
  }
};

interface ImageQueryParams {
  limit?: string;
  offset?: string;
}

export const searchPillsByImageHandler = async (
  req: Request<unknown, unknown, unknown, ImageQueryParams>,
  res: Response,
  next: NextFunction
)=> {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    const imageBuffer = req.file.buffer;
    const limit = parseInt(req.query.limit ?? '10', 10);
    const offset = parseInt(req.query.offset ?? '0', 10);
    const result = await searchPillsByImage(imageBuffer, limit, offset);
    res.status(200).json(result);
  } catch (error: unknown) {
    next(createError('DatabaseError', (error as Error).message, 500));
  }
};

export const getPillFavoriteCount = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const id = parseInt(req.params.id, 10);

  try {
    const count = await getPillFavoriteCountService(id);
    res.status(200).send({ count });
  } catch (error: unknown) {
    next(createError('DatabaseError', (error as Error).message, 500));
  }
};

export const getPillReviewCount = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const id = parseInt(req.params.id, 10);

  try {
    const count = await getPillReviewCountService(id);
    res.status(200).send({ count });
  } catch (error: unknown) {
    next(createError('DatabaseError', (error as Error).message, 500));
  }
};

