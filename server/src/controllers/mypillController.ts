import { Response, Request, NextFunction } from 'express';
import Joi from 'joi';
import  { addPill, updatePill, getPills, deletePill } from '../services/mypillService';

const createPillSchema = Joi.object({
  drugname: Joi.string().required(),
  expiredat: Joi.date().required(),
  created_at: Joi.date().required()
});

const updatePillSchema = Joi.object({
  mydrugid: Joi.string().required(),
  drugname: Joi.string().required(),
  expiredat: Joi.date().required(),
  created_at: Joi.date().required()
});

const addMyPill = async (req: any, res: Response, next: NextFunction)=> {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
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

const updateMyPill = async (req: any, res: Response, next: NextFunction) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const mypillId = req.params.mypillid;
    const { error, value } = updatePillSchema.validate({ mypillid: mypillId, ...req.body });

    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const updatedPill = await updatePill(mypillId, value);
    res.status(200).json(updatedPill);
  } catch (error) {
    next(error);
  }
};

const getMyPills = async (req: any, res: Response, next: NextFunction) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const userId = user.id;
    const limit = parseInt(req.query.limit as string, 10) ?? 10;
    const offset = parseInt(req.query.offset as string, 10) ?? 0;
    const sortedBy = (req.query.sortedBy as string) ?? 'created_at';
    const order = (req.query.order as string)?.toUpperCase() ?? 'DESC';
    const pills = await getPills(userId, limit, offset, sortedBy, order);
    res.status(200).json(pills);
  } catch (error) {
    next(error);
  }
};

const deleteMyPill = async (req: any, res: Response, next: NextFunction) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const mypillId = req.params.mydrugid;
    if (!mypillId) {
      return res.status(400).json({ message: 'mypillid is required' });
    }
    const result = await deletePill(mypillId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addMyPill,
  updateMyPill,
  getMyPills,
  deleteMyPill
};
