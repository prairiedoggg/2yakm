import { Response, Request, NextFunction } from 'express';
import { 
  getUserProfile, 
  updateUsername, 
  updateProfilePicture, 
  addCertification, 
  getCertification, 
  deleteCertification
}from '../services/mypageService';

import Joi from 'joi';
import { createError } from '../utils/error';
import { uploadToS3 } from '../config/imgUploads';

interface RequestUser {
  id: string;
}

// Extend the Request interface to include the user
interface AuthenticatedRequest extends Request {
  user?: RequestUser;
  file?: Express.Multer.File;
}

export const updateUsernameSchema = Joi.object({
  username: Joi.string().min(3).max(30).required(),
});

export const getUserprofile = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const user = req.user;
    if (!user) {
      return next(createError('UnauthorizedError', 'Unauthorized', 401));
    }
    const userId = user.id;
    const userProfile = await getUserProfile(userId);
    res.status(200).json(userProfile);
  } catch (error) {
    next(error);
  }
};

export const updateName = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const user = req.user;
    if (!user) {
      return next(createError('UnauthorizedError', 'Unauthorized', 401));
    }
    const userId = user.id;
    const { error, value } = updateUsernameSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    const updatedUser = await updateUsername(userId, value);
    res.status(200).json(updatedUser);
  } catch (error) {
    next(error);
  }
};

export const updateProfilePictureS3 = [
  uploadToS3.single('profileImg'),
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return next(createError('UnauthorizedError', 'Unauthorized', 401));
      }
      if (!req.file || !(req.file as any).location) {
        return next(createError('UploadError', 'No file uploaded', 400));
      }
      const s3Url = req.file ? (req.file as any).location : null;
      const updatedProfilePicture = await updateProfilePicture(req.user.id, s3Url);
      res.status(200).json({ profilePicture: updatedProfilePicture });
    } catch (error) {
      next(error);
    }
  }
];

export const getCert = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const user = req.user;
    if (!user) {
      return next(createError('UnauthorizedError', 'Unauthorized', 401));
    }
  const userId = user.id
  const getCertifiedUser = await getCertification(userId)
  res.status(200).json(getCertifiedUser);
  }
catch(error) {
  next(error)
}
}

export const addCert = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {

  try {
    const user = req.user;
    if (!user) {
      return next(createError('UnauthorizedError', 'Unauthorized', 401));
    }

  const userId = user.id
  const CertData = req.body;
  const name = CertData.name
  const date = CertData.date
  const number = CertData.number

  const certifiedUser = await addCertification(userId, name, date, number)
  res.status(200).json(certifiedUser);
  }
catch(error) {
  next(error)
}
}

export const deleteCert = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const user = req.user;
    if (!user) {
      return next(createError('UnauthorizedError', 'Unauthorized', 401));
    }
  const userId = user.id
  const name = req.body.name
  const deleteCertifiedUser = await deleteCertification(userId, name)
  res.status(200).json(deleteCertifiedUser);
  }
catch(error) {
  next(error)
}
}