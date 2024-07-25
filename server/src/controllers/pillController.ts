import { Response, Request, NextFunction } from 'express';
import { 
  getPills,
  getPillById,
  updatePill,
  deletePill,
  searchPillsbyName,
  searchPillsbyEfficacy,
  searchPillsByImage,
  searchPillsbyEngName, 
  getPillFavoriteCountService
} from '../services/pillService';


export const getPillsHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const limit = parseInt(req.query.limit as string, 10) || 10;
    const offset = parseInt(req.query.offset as string, 10) || 0;
    const sortedBy = (req.query.sortedBy as string) || 'created_at';
    const order = (req.query.order as string)?.toUpperCase() || 'DESC';
    const pills = await getPills(limit, offset, sortedBy, order);
    res.status(200).json(pills);
  } catch (error) {
    next(error);
  }
};

export const getPillByIdHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = parseInt(req.params.id as string, 10);
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

export const updatePillHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const updatedPill = await updatePill(parseInt(req.params.id, 10), req.body);
    if (updatedPill) {
      res.status(200).json(updatedPill);
    } else {
      res.status(404).json({ message: 'Pill not found' });
    }
  } catch (error) {
    next(error);
  }
};

export const deletePillHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const deleted = await deletePill(parseInt(req.params.id, 10));
    if (deleted) {
      res.status(204).end();
    } else {
      res.status(404).json({ message: 'Pill not found' });
    }
  } catch (error) {
    next(error);
  }
};

export const searchPillsbyNameHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const name = req.query.name as string;
    const offset = parseInt(req.query.offset as string, 10) || 0;
    const limit = parseInt(req.query.limit as string, 10) || 10;
    const pills = await searchPillsbyName(name, limit, offset);
    res.status(200).json(pills);
  } catch (error) {
    next(error);
  }
};

export const searchPillsbyEngNameHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const name = req.query.name as string;
    const offset = parseInt(req.query.offset as string, 10) || 0;
    const limit = parseInt(req.query.limit as string, 10) || 10;
    const pills = await searchPillsbyEngName(name, limit, offset);
    res.status(200).json(pills);
  } catch (error) {
    next(error);
  }
};


export const searchPillsbyEfficacyHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const efficacy = req.query.efficacy as string;
    const offset = parseInt(req.query.offset as string, 10) || 0;
    const limit = parseInt(req.query.limit as string, 10) || 10;
    const pills = await searchPillsbyEfficacy(efficacy, limit, offset);
    res.status(200).json(pills);
  } catch (error) {
    next(error);
  }
};

export const searchPillsByImageHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    const imageBuffer = req.file.buffer;
    const limit = parseInt(req.query.limit as string, 10) || 10;
    const offset = parseInt(req.query.offset as string, 10) || 0;
    const result = await searchPillsByImage(imageBuffer, limit, offset);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};


export const getPillFavoriteCount = async (
   req: Request<{ id: string }, unknown, unknown, unknown>,
   res: Response,
   next: NextFunction
 ): Promise<void> => {
   const id = parseInt(req.params.id, 10);

   try {
     const count = await getPillFavoriteCountService(id);

     res.status(200).send({ count });
   } catch (error: any) {
     next(error);
   }
 };



