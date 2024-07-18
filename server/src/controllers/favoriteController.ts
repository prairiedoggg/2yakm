import { Response, Request, NextFunction } from 'express';
const favoriteService = require('../services/favoriteService');

interface CustomRequest extends Request {
  user: {
    email: string;
    role: string;
  };
}

// 즐겨 찾는 약 검색 컨트롤러
exports.searchFavoriteDrug = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { email } = req.user;

  try {
    const favorite = await favoriteService.searchFavoriteDrug(email);
    res.status(200).send(favorite);
  } catch (error: any) {
    next(error);
  }
};

// 약 좋아요 추가, 취소 컨트롤러
exports.addCancelFavoriteDrug = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { drugid } = req.params;
  const { email } = req.user;

  try {
    const favorite = await favoriteService.addCancelFavoriteDrug(drugid, email);

    if (favorite.message === 'deleted') {
      res.status(200).send('좋아요를 취소했습니다.');
      return;
    }

    res.status(201).send('좋아요를 추가했습니다.');
  } catch (error: any) {
    next(error);
  }
};
