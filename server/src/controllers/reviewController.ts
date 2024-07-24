import { Response, Request, NextFunction } from 'express';
import {
  createReviewService,
  updateReviewService,
  deleteReviewService,
  getPillsAllReviewService,
  getUserAllReviewService
} from '../services/reviewService';
import { CustomRequest } from '../types/express';

// 리뷰 생성 컨트롤러
export const createReview = async (
  req: Request<unknown, unknown, { id: string; content: string }, unknown> &
    CustomRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const id = parseInt(req.body.id);
  const { content } = req.body;

  const userid = req.user.id;

  if (!content) {
    res.status(400).send('리뷰 내용을 입력해 주세요.');
    return;
  }

  try {
    const review = await createReviewService(id, userid, content);

    if (!review) res.status(400).send('리뷰 생성을 실패했습니다.');

    res.status(201).send(review);
  } catch (error: any) {
    next(error);
  }
};

// 리뷰 수정 컨트롤러
export const updateReview = async (
  req: Request<{ reviewid: string }, unknown, { content: string }, unknown> &
    CustomRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const reviewid = parseInt(req.params.reviewid);
  const { content } = req.body;

  const userid = req.user.id;

  if (!content) {
    res.status(400).send('수정할 리뷰 내용을 입력해 주세요.');
    return;
  }

  try {
    const review = await updateReviewService(reviewid, userid, content);

    res.status(200).send(review);
  } catch (error: any) {
    next(error);
  }
};

// 리뷰 삭제 컨트롤러
export const deleteReview = async (
  req: Request<{ reviewid: string }, unknown, unknown, { userid: string }> &
    CustomRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const reviewid = parseInt(req.params.reviewid);

  const userid = req.user.id;

  try {
    const review = await deleteReviewService(reviewid, userid);

    res.status(200).send('리뷰 삭제 성공');
  } catch (error: any) {
    next(error);
  }
};

// 해당 약의 모든 리뷰 조회 컨트롤러
export const getPillsAllReview = async (
  req: Request<
    { id: string },
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
  const id = parseInt(req.params.id);
  const initialLimit = parseInt(req.query.initialLimit ?? '10'); // 처음 불러올 자료 개수
  const cursorLimit = parseInt(req.query.cursorLimit ?? '10'); // cursor 적용 했을 때 가져올 자료 개수
  const cursor = parseInt(req.query.cursor) ?? undefined;

  try {
    const { reviews, nextCursor } = await getPillsAllReviewService(
      id,
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
      order?: string;
    }
  > &
    CustomRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const userid = req.user.id;
  const limit = parseInt(req.query.limit ?? '10');
  const offset = parseInt(req.query.offset ?? '0');
  const sortedBy = req.query.sortedBy ?? 'created_at';
  const order = req.query.order?.toUpperCase() ?? 'DESC';

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
