import { Response, Request, NextFunction } from 'express';
import {
  createReviewService,
  updateReviewService,
  deleteReviewService,
  getPillsAllReviewService,
  getUserAllReviewService
} from '../services/reviewService';
import { CustomRequest } from '../types/express';
import { createError } from '../utils/error';

// 리뷰 생성 컨트롤러
export const createReview = async (
  req: Request<unknown, unknown, { pillid: string; content: string }, unknown> &
    CustomRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const pillid = parseInt(req.body.pillid);
  const { content } = req.body;

  const userid = req.user.id;

  if (!content) {
    res.status(400).send('리뷰 내용을 입력해 주세요.');
    return;
  }

  try {
    const review = await createReviewService(pillid, userid, content);

    if (!review) res.status(400).send('리뷰 생성을 실패했습니다.');

    res.status(201).send(review);
  } catch (error: any) {
    next(error);
  }
};

// 리뷰 수정 컨트롤러
export const updateReview = async (
  req: Request<{ id: string }, unknown, { content: string }, unknown> &
    CustomRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const id = parseInt(req.params.id);
  const { content } = req.body;

  const userid = req.user.id;

  if (!content) {
    res.status(400).send('수정할 리뷰 내용을 입력해 주세요.');
    return;
  }

  try {
    const review = await updateReviewService(id, userid, content);

    res.status(200).send(review);
  } catch (error: any) {
    next(error);
  }
};

// 리뷰 삭제 컨트롤러
export const deleteReview = async (
  req: Request<{ id: string }, unknown, unknown, { userid: string }> &
    CustomRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const id = parseInt(req.params.id);

  const userid = req.user.id;

  try {
    const review = await deleteReviewService(id, userid);

    res.status(200).send('리뷰 삭제 성공');
  } catch (error: any) {
    next(error);
  }
};

// 해당 약의 모든 리뷰 조회 컨트롤러
export const getPillsAllReview = async (
  req: Request<
    { pillid: string },
    unknown,
    unknown,
    {
      initialLimit?: string;
      cursorLimit?: string;
      cursor: string;
    }
  >,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const pillid = parseInt(req.params.pillid);
  const initialLimit = parseInt(req.query.initialLimit ?? '10'); // 처음 불러올 자료 개수
  const cursorLimit = parseInt(req.query.cursorLimit ?? '10'); // cursor 적용 했을 때 가져올 자료 개수
  const cursor = parseInt(req.query.cursor) ?? undefined;

  if (isNaN(initialLimit) || isNaN(cursorLimit)) {
    throw createError(
      'Invalid value',
      'initialLimit, cursorLimit 값을 다시 확인해 주세요.',
      400
    );
  }

  try {
    const { reviews, nextCursor } = await getPillsAllReviewService(
      pillid,
      initialLimit,
      cursorLimit,
      cursor
    );
    res.status(200).send({ reviews, nextCursor });
  } catch (error: any) {
    next(error);
  }
};

// 해당 유저의 모든 리뷰 조회 컨트롤러
export const getUserAllReview = async (
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
    const review = await getUserAllReviewService(
      userid,
      limit,
      offset,
      sortedBy,
      order
    );
    res.status(200).send(review);
  } catch (error: any) {
    next(error);
  }
};
