import { Response, Request } from 'express';
const { MydrugService } = require('../services/mydrugService');
const mydrugService = new MydrugService();


  /**
 * @swagger
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
  
  /**
   * @swagger
   * addMyDrug에서 updateData에 들어가는 req.body는 json형식으로 {"drugname":"nameofdrug", "expiredat":"2024-07-19"} 와 같이 써주세요. 
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
  
  /**
   * @swagger
   * updateMyDrug에서 updateData에 들어가는 req.body는 json형식으로 {"drugname":"nameofdrug", "expiredat":"2024-07-19"} 와 같이 써주세요. 
  */
  
  const getMyDrugs = async (req: Request, res: Response) => {
    try {
      const userId = req.params.userid;
      const updateData = req.body;
      const updatedUser = await mydrugService.getDrugs(userId, updateData);
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
  
