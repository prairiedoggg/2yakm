const { MypageService } = require('../services/mypageService');
const mypageService = new MypageService();
import { Response, Request } from 'express';

const getUserProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const userProfile = await mypageService.getUserProfile(userId);
    res.status(200).json(userProfile);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unknown error occurred' });
    }
  }
};

const updateUserProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const updateData = req.body;
    const updatedUser = await mypageService.updateUserProfile(userId, updateData);
    res.status(200).json(updatedUser);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unknown error occurred' });
    }
  }
};

const updateProfilePicture = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const profilePicture = req.file?.filename;
    if (!profilePicture) {
      res.status(400).json({ error: 'Profile picture is required' });
      return;
    }
    const updatedUser = await mypageService.updateProfilePicture(userId, profilePicture);
    res.status(200).json(updatedUser);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unknown error occurred' });
    }
  }
};

module.exports =  {
  getUserProfile,
  updateUserProfile,
  updateProfilePicture
};
