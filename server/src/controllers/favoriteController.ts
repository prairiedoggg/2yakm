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
  const limit = parseInt(req.query.limit as string, 10) || 10;
  const offset = parseInt(req.query.offset as string, 10) || 0;
  const sortedBy = (req.query.sortedBy as string) || 'created_at';
  const order = (req.query.order as string)?.toUpperCase() || 'DESC';

  try {
    const favorite = await favoriteService.searchFavoriteDrug(
      email,
      limit,
      offset,
      sortedBy,
      order
    );
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

// 좋아요를 눌렀는지 확인하는 컨트롤러
exports.userFavoriteStatus = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { drugid } = req.params;
  const { email } = req.user;

  try {
    const favorite = await favoriteService.userFavoriteStatus(drugid, email);

    res.status(200).send(favorite);
  } catch (error: any) {
    next(error);
  }
};
