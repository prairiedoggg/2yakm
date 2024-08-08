import { Response, Request, NextFunction } from 'express';
import {
  getUserProfile,
  updateUsername,
  updateProfilePicture,
  addCertification,
  getCertification,
  deleteCertification
} from '../services/mypageService';

import Joi from 'joi';
import { createError } from '../utils/error';
import { uploadToS3 } from '../config/imgUploads';

interface RequestUser {
  id: string;
}

interface AuthenticatedRequest extends Request {
  user?: RequestUser;
  file?: Express.Multer.File & { location?: string }; // Adding optional location property
}

export const updateUsernameSchema = Joi.object({
  username: Joi.string().min(3).max(30).required()
});

export const getUserprofile = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
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

export const updateName = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
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
      if (!req.file || !req.file.location) {
        return next(createError('UploadError', 'No file uploaded', 400));
      }
      const s3Url = req.file.location;
      const updatedProfilePicture = await updateProfilePicture(
        req.user.id,
        s3Url
      );
      res.status(200).json({ profilePicture: updatedProfilePicture });
    } catch (error) {
      next(error);
    }
  }
];

export const getCert = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;
    if (!user) {
      return next(createError('UnauthorizedError', 'Unauthorized', 401));
    }
    const userId = user.id;
    const getCertifiedUser = await getCertification(userId);
    res.status(200).json(getCertifiedUser);
  } catch (error) {
    next(error);
  }
};

export const addCert = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;
    if (!user) {
      return next(createError('UnauthorizedError', 'Unauthorized', 401));
    }

    const { name, date, btype, number } = req.body;
    if (!name || !date || !number || !btype) {
      return next(
        createError('ValidationError', 'Missing required fields', 400)
      );
    }

    const userId = user.id;
    const certifiedUser = await addCertification(
      userId,
      name,
      date,
      btype,
      number
    );
    res.status(201).json(certifiedUser);
  } catch (error) {
    next(error);
  }
};

export const deleteCert = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;
    if (!user) {
      return next(createError('UnauthorizedError', 'Unauthorized', 401));
    }
    const { name } = req.body;
    if (!name) {
      return next(
        createError('ValidationError', 'Missing required field: name', 400)
      );
    }

    const userId = user.id;
    const deletedCertification = await deleteCertification(userId, name);
    res.status(200).json(deletedCertification);
  } catch (error) {
    next(error);
  }
};
