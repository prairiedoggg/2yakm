import { Response, Request, NextFunction } from 'express';
const reviewService = require('../services/reviewService');

interface CustomRequest extends Request {
  user: {
    id: string;
  };
}

// 리뷰 생성 컨트롤러
exports.createReview = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { drugid } = req.params;
  const { content } = req.body;

  const userid = req.user.id;

  if (!content) {
    res.status(400).send('리뷰 내용을 입력해 주세요.');
    return;
  }

  try {
    const review = await reviewService.createReview(drugid, userid, content);

    if (!review) res.status(400).send('리뷰 생성을 실패했습니다.');

    res.status(201).send(review);
  } catch (error: any) {
    next(error);
  }
};

// 리뷰 수정 컨트롤러
exports.updateReview = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { reviewid } = req.params;
  const { content } = req.body;

  const userid = req.user.id;

  if (!content) {
    res.status(400).send('수정할 리뷰 내용을 입력해 주세요.');
    return;
  }

  try {
    const review = await reviewService.updateReview(reviewid, userid, content);

    res.status(200).send(review);
  } catch (error: any) {
    next(error);
  }
};

// 리뷰 삭제 컨트롤러
exports.deleteReview = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { reviewid } = req.params;

  const userid = req.user.id;

  try {
    const review = await reviewService.deleteReview(reviewid, userid);

    res.status(200).send('리뷰 삭제 성공');
  } catch (error: any) {
    next(error);
  }
};

// 해당 약의 모든 리뷰 조회 컨트롤러
exports.getDrugAllReview = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { drugid } = req.params;

  try {
    const review = await reviewService.getDrugAllReview(drugid);
    res.status(200).send(review);
  } catch (error: any) {
    next(error);
  }
};

// 해당 유저의 모든 리뷰 조회 컨트롤러
exports.getUserAllReview = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const userid = req.user.id;
  const limit = parseInt(req.query.limit as string, 10) || 10;
  const offset = parseInt(req.query.offset as string, 10) || 0;
  const sortedBy = (req.query.sortedBy as string) || 'created_at';
  const order = (req.query.order as string)?.toUpperCase() || 'DESC';

  try {
    const review = await reviewService.getUserAllReview(
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
