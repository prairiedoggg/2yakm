import { Response, Request, NextFunction } from 'express';
import {
  searchFavoriteDrugService,
  addCancelFavoriteDrugService,
  userFavoriteStatusService,
  getDrugFavoriteCountService
} from '../services/favoriteService';
import { CustomRequest } from '../types/express';

// 즐겨 찾는 약 검색 컨트롤러
export const searchFavoriteDrug = async (
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
  const sortedBy = (req.query.sortedBy as string) ?? 'created_at';
  const order = (req.query.order as string)?.toUpperCase() ?? 'DESC';

  try {
    const favorite = await searchFavoriteDrugService(
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
export const addCancelFavoriteDrug = async (
  req: Request<{ drugid: string }, unknown, unknown, unknown> & CustomRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const drugid = parseInt(req.params.drugid, 10);
  const userid = req.user.id;

  try {
    const favorite = await addCancelFavoriteDrugService(drugid, userid);

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
  req: Request<{ drugid: string }, unknown, unknown, unknown> & CustomRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const drugid = parseInt(req.params.drugid, 10);
  const userid = req.user.id;

  try {
    const status = await userFavoriteStatusService(drugid, userid);

    res.status(200).send({ status });
  } catch (error: any) {
    next(error);
  }
};

// 해당 약의 좋아요 수를 확인하는 서비스
export const getDrugFavoriteCount = async (
  req: Request<{ drugid: string }, unknown, unknown, unknown>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const drugid = parseInt(req.params.drugid, 10);

  try {
    const count = await getDrugFavoriteCountService(drugid);

    res.status(200).send({ count });
  } catch (error: any) {
    next(error);
  }
};
