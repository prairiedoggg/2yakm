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

const updateUsername = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const updateData = req.body;
    const updatedUser = await mypageService.updateUsername(userId, updateData);
    res.status(200).json(updatedUser);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unknown error occurred' });
    }
  }
};
 

const updateProfilePictureMemory = async (req: Request , res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    const updatedProfilePicture = await mypageService.updateProfilePicture(req.params.id, req.file.buffer.toString('base64'));
    res.status(200).json({ profilePicture: updatedProfilePicture });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    res.status(400).json({ message: errorMessage });
  }
};

const updateProfilePictureS3 = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    
    // Assuming you have a method in MypageService to handle S3 upload and return URL
    const s3Url = await mypageService.uploadFileToS3(req.file);
    const updatedProfilePicture = await mypageService.updateProfilePicture(req.params.id, s3Url);
    
    res.status(200).json({ profilePicture: updatedProfilePicture });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    res.status(400).json({ message: errorMessage });
  }
};

module.exports = {
  getUserProfile,
  updateUsername,
  updateProfilePictureMemory,
  updateProfilePictureS3,
};
