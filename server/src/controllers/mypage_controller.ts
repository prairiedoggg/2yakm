const { MypageService } = require('../services/mypage_service');
const multer = require('multer');
const mypageService = new MypageService();
const path = require('path');
import { Response, Request } from 'express';
type FileFilterCallback = (error: Error | null, acceptFile: boolean) => void;


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

const storage = multer.diskStorage({
  destination: function (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) {
    cb(null, 'uploads/');
  },
  filename: function (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) {
    cb(null, `${Date.now()}${path.extname(file.originalname)}`);
  },
});

const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only images are allowed'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
});

module.exports =  {
  getUserProfile,
  updateUserProfile,
  updateProfilePicture,
  upload,
};
