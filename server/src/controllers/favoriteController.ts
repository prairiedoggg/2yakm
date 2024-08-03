import { Response, Request, NextFunction } from 'express';
import {
  searchFavoritePillService,
  addCancelFavoritePillService,
  userFavoriteStatusService
} from '../services/favoriteService';
import { CustomRequest } from '../types/express';
import { createError } from '../utils/error';

// 즐겨 찾는 약 검색 컨트롤러
export const searchFavoritePill = async (
  req: Request<
    unknown,
    unknown,
    unknown,
    {
      limit?: string;
      offset?: string;
      sortedBy?: string;
      order?: 'ASC' | 'DESC';
    }
  > &
    CustomRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const userid = req.user.id;
  const limit = parseInt(req.query.limit ?? '10');
  const offset = parseInt(req.query.offset ?? '0');
  const sortedBy = req.query.sortedBy ?? 'createdAt';
  const order = req.query.order?.toUpperCase() ?? 'DESC';

  if (isNaN(limit) || isNaN(offset)) {
    throw createError(
      'Invalid value',
      'limit, offset 값을 다시 확인해 주세요.',
      400
    );
  }

  try {
    const favorite = await searchFavoritePillService(
      userid,
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
export const addCancelFavoritePill = async (
  req: Request<{ pillid: string }, unknown, unknown, unknown> & CustomRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const pillid = parseInt(req.params.pillid, 10);
  const userid = req.user.id;

  try {
    const favorite = await addCancelFavoritePillService(pillid, userid);

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
export const userFavoriteStatus = async (
  req: Request<{ pillid: string }, unknown, unknown, unknown> & CustomRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const pillid = parseInt(req.params.pillid, 10);
  const userid = req.user.id;

  try {
    const status = await userFavoriteStatusService(pillid, userid);

    res.status(200).send({ status });
  } catch (error: any) {
    next(error);
  }
};

// // 해당 약의 좋아요 수를 확인하는 컨트롤러
// export const getPillFavoriteCount = async (
//   req: Request<{ pillid: string }, unknown, unknown, unknown>,
//   res: Response,
//   next: NextFunction
// ): Promise<void> => {
//   const pillid = parseInt(req.params.pillid, 10);

//   try {
//     const count = await getPillFavoriteCountService(pillid);

//     res.status(200).send({ count });
//   } catch (error: any) {
//     next(error);
//   }
// };
