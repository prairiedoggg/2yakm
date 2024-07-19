import { Response, Request } from 'express';
const { MydrugService } = require('../services/mydrugService');
const mydrugService = new MydrugService();


  /*
 * addMydrug와 getMyDrugs(C,R)의 경우에는 req.params.userid 사용  
 * updateMyDrug, deleteMyDrug(U,D)의 경우에는 req.params.mydrugid 사용
*/

const addMyDrug = async (req: Request, res: Response) => {
    try {
      const userId = req.params.userid;
      const updateData = req.body;
      const updatedUser = await mydrugService.addDrug(userId, updateData);
      res.status(200).json(updatedUser);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'An unknown error occurred' });
      }
    }
  };
  
  /*
   * addMyDrug에서 updateData에 들어가는 req.body는 json형식으로 {"drugname":"nameofdrug", "expiredat":"2025-07-19", "created_at":"2024-07-19"} 와 같이 써주세요. 
  */
  
  
  const updateMyDrug = async (req: Request, res: Response) => {
    try {
      const mydrugId = req.params.mydrugid;
      const updateData = req.body;
      const updatedUser = await mydrugService.updateDrug(mydrugId, updateData);
      res.status(200).json(updatedUser);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'An unknown error occurred' });
      }
    }
  };
  
  /*
   * updateMyDrug에서 updateData에 들어가는 req.body는 json형식으로 {"drugname":"nameofdrug", "expiredat":"2025-07-19", "created_at":"2024-07-19"} 와 같이 써주세요.
  */
  
  const getMyDrugs = async (req: Request, res: Response) => {
    try {
      const userId = req.params.userid;
      const limit = parseInt(req.query.limit as string, 10) || 10;
      const offset = parseInt(req.query.offset as string, 10) || 0;
      const sortedBy = (req.query.sortedBy as string) || 'created_at';
      const order = (req.query.order as string)?.toUpperCase() || 'DESC';
      const updatedUser = await mydrugService.getDrugs(userId, limit, offset, sortedBy, order);
      res.status(200).json(updatedUser);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'An unknown error occurred' });
      }
    }
  };

  const deleteMyDrug= async (req: Request, res: Response) => {
    try {
        const drugId = req.params.mydrugid;
        const updateData = req.body;
        const updatedUser = await mydrugService.deleteDrug(drugId, updateData);
        res.status(200).json(updatedUser);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'An unknown error occurred' });
      }
    }}
  
  
  module.exports = {
    addMyDrug,
    updateMyDrug,
    getMyDrugs,
    deleteMyDrug
  };
  
