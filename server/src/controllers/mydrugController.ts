import { Response, Request, NextFunction } from 'express';
import Joi from 'joi';
const { addDrug, updateDrug, getDrugs, deleteDrug } = require('../services/mydrugService');

const createDrugSchema = Joi.object({
  drugname: Joi.string().required(),
  expiredat: Joi.date().required(),
  created_at: Joi.date().required()
});

const updateDrugSchema = Joi.object({
  mydrugid: Joi.string().required(),
  drugname: Joi.string().required(),
  expiredat: Joi.date().required(),
  created_at: Joi.date().required()
});

const addMyDrug = async (req: any, res: Response, next: NextFunction)=> {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const userId = user.id;
    const { error, value } = createDrugSchema.validate(req.body);

    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const newDrug = await addDrug(userId, value);
    res.status(200).json(newDrug);
  } catch (error) {
    next(error);
  }
};

const updateMyDrug = async (req: any, res: Response, next: NextFunction) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const mydrugId = req.params.mydrugid;
    const { error, value } = updateDrugSchema.validate({ mydrugid: mydrugId, ...req.body });

    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const updatedDrug = await updateDrug(mydrugId, value);
    res.status(200).json(updatedDrug);
  } catch (error) {
    next(error);
  }
};

const getMyDrugs = async (req: any, res: Response, next: NextFunction) => {
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
    const drugs = await getDrugs(userId, limit, offset, sortedBy, order);
    res.status(200).json(drugs);
  } catch (error) {
    next(error);
  }
};

const deleteMyDrug = async (req: any, res: Response, next: NextFunction) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const mydrugId = req.params.mydrugid;
    if (!mydrugId) {
      return res.status(400).json({ message: 'mydrugid is required' });
    }
    const result = await deleteDrug(mydrugId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addMyDrug,
  updateMyDrug,
  getMyDrugs,
  deleteMyDrug
};
