import { Response, Request, NextFunction } from 'express';
import { getUserProfile, updateUsername, updateProfilePicture, uploadFileToS3 } from '../services/mypageService';
import Joi from 'joi';

export const updateUsernameSchema = Joi.object({
  username: Joi.string().min(3).max(30).required(),
});

export const getUserprofile = async (req: any, res: Response, next: NextFunction) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const userId = user.id;
    const userProfile = await getUserProfile(userId);
    res.status(200).json(userProfile);
  } catch (error) {
    if (error instanceof Error) {
      next(error);
    } else {
      next(new Error('An unknown error occurred'));
    }
  }
};

export const updateName = async (req: any, res: Response, next: NextFunction) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const userId = user.id;
    const { error, value } = updateUsernameSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    const updatedUser = await updateUsername(userId, value);
    res.status(200).json(updatedUser);
  } catch (error) {
    if (error instanceof Error) {
      next(error);
    } else {
      next(new Error('An unknown error occurred'));
    }
  }
};

export const updateProfilePictureMemory = async (req: any, res: Response, next: NextFunction) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    const updatedProfilePicture = await updateProfilePicture(req.params.id, req.file.buffer.toString('base64'));
    res.status(200).json({ profilePicture: updatedProfilePicture });
  } catch (error) {
    if (error instanceof Error) {
      next(error);
    } else {
      next(new Error('An unknown error occurred'));
    }
  }
};

export const updateProfilePictureS3 = async (req: any, res: Response, next: NextFunction)=> {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const fileName = req.file.originalname;
    const s3Url = await uploadFileToS3(req.file, fileName);
    const updatedProfilePicture = await updateProfilePicture(req.params.id, s3Url);

    res.status(200).json({ profilePicture: updatedProfilePicture });
  } catch (error) {
    if (error instanceof Error) {
      next(error);
    } else {
      next(new Error('An unknown error occurred'));
    }
  }
};
