import { Response, Request, NextFunction } from 'express';
import { 
  getDrugs,
  getDrugById,
  updateDrug,
  deleteDrug,
  searchDrugsbyName,
  searchDrugsbyEfficacy,
  searchDrugsByImage,
  searchDrugsbyEngName
} from '../services/drugService';


const getDrugsHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const limit = parseInt(req.query.limit as string, 10) || 10;
    const offset = parseInt(req.query.offset as string, 10) || 0;
    const sortedBy = (req.query.sortedBy as string) || 'created_at';
    const order = (req.query.order as string)?.toUpperCase() || 'DESC';
    const drugs = await getDrugs(limit, offset, sortedBy, order);
    res.status(200).json(drugs);
  } catch (error) {
    next(error);
  }
};

const getDrugByIdHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const drugid = parseInt(req.params.drugid as string, 10);
    const drug = await getDrugById(drugid);
    if (drug) {
      res.status(200).json(drug);
    } else {
      res.status(404).json({ message: 'Drug not found' });
    }
  } catch (error) {
    next(error);
  }
};
const updateDrugHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const updatedDrug = await updateDrug(parseInt(req.params.drugid, 10), req.body);
    if (updatedDrug) {
      res.status(200).json(updatedDrug);
    } else {
      res.status(404).json({ message: 'Drug not found' });
    }
  } catch (error) {
    next(error);
  }
};

const deleteDrugHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const deleted = await deleteDrug(parseInt(req.params.drugid, 10));
    if (deleted) {
      res.status(204).end();
    } else {
      res.status(404).json({ message: 'Drug not found' });
    }
  } catch (error) {
    next(error);
  }
};

const searchDrugsbyNameHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const drugname = req.query.name as string;
    const offset = parseInt(req.query.offset as string, 10) || 0;
    const limit = parseInt(req.query.limit as string, 10) || 10;
    const drugs = await searchDrugsbyName(drugname, limit, offset);
    res.status(200).json(drugs);
  } catch (error) {
    next(error);
  }
};

const searchDrugsbyEngNameHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const drugname = req.query.name as string;
    const offset = parseInt(req.query.offset as string, 10) || 0;
    const limit = parseInt(req.query.limit as string, 10) || 10;
    const drugs = await searchDrugsbyEngName(drugname, limit, offset);
    res.status(200).json(drugs);
  } catch (error) {
    next(error);
  }
};


const searchDrugsbyEfficacyHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const efficacy = req.query.efficacy as string;
    const offset = parseInt(req.query.offset as string, 10) || 0;
    const limit = parseInt(req.query.limit as string, 10) || 10;
    const drugs = await searchDrugsbyEfficacy(efficacy, limit, offset);
    res.status(200).json(drugs);
  } catch (error) {
    next(error);
  }
};

const searchDrugsByImageHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    const imageBuffer = req.file.buffer;
    const limit = parseInt(req.query.limit as string, 10) || 10;
    const offset = parseInt(req.query.offset as string, 10) || 0;
    const result = await searchDrugsByImage(imageBuffer, limit, offset);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};


export {
  getDrugsHandler,
  getDrugByIdHandler,
  updateDrugHandler,
  deleteDrugHandler,
  searchDrugsbyNameHandler,
  searchDrugsbyEfficacyHandler,
  searchDrugsByImageHandler,
  searchDrugsbyEngNameHandler
};

