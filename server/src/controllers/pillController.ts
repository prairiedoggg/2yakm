import { Response, Request, NextFunction } from 'express';
import { ParsedQs } from 'qs';
import {
  getPills,
  getPillById,
  searchPillsbyName,
  searchPillsbyEfficacy,
  searchPillsByImage,
  getPillFavoriteCountService,
  getPillReviewCountService
} from '../services/pillService';

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
  } catch (error) {
    next(error);
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
  } catch (error) {
    next(error);
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

export const searchPillsbyNameHandler = async (
  req: Request<unknown, unknown, unknown, QueryParams>,
  res: Response,
  next: NextFunction
) => {
  const name = req.query.name;
  const offset = parseInt(req.query.offset ?? '0', 10);
  const limit = parseInt(req.query.limit ?? '10', 10);

  if (!name) {
    return res
      .status(400)
      .json({ message: 'name query parameter is required' });
  }

  try {
    const pills = await searchPillsbyName(name, limit, offset);
    res.status(200).json(pills);
  } catch (error) {
    next(error);
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
  } catch (error) {
    next(error);
  }
};

interface ImageQueryParams extends ParsedQs {
  limit?: string;
  offset?: string;
}

interface ImageRequest extends Request<{}, {}, {}, ImageQueryParams> {
  files?:
    | Express.Multer.File[]
    | { [fieldname: string]: Express.Multer.File[] };
}

export const searchPillsByImageHandler = async (
  req: ImageRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.files || (Array.isArray(req.files) && req.files.length === 0)) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const imageBuffers: Buffer[] = Array.isArray(req.files)
      ? req.files.map((file) => file.buffer)
      : Object.values(req.files)
          .flat()
          .map((file) => file.buffer);

    const limit = parseInt(req.query.limit ?? '10', 10);
    const offset = parseInt(req.query.offset ?? '0', 10);
    const result = await searchPillsByImage(imageBuffers, limit, offset);
    res.status(200).json(result);
  } catch (error) {
    next(error);
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
  } catch (error) {
    next(error);
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
  } catch (error) {
    next(error);
  }
};
