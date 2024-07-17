import { Response, Request } from 'express';
const reviewService = require('../services/reviewService');

// 리뷰 생성 컨트롤러
exports.createReview = async (req: Request, res: Response): Promise<void> => {
  const { drugId } = req.params;
  const { drugName, userId, role, content } = req.body;

  if (!drugName || !userId || role === undefined || !content) {
    res.status(400).send('입력되지 않은 항목이 있습니다.');
    return;
  }

  try {
    const review = await reviewService.createReview(
      drugId,
      drugName,
      userId,
      role,
      content
    );

    if (!review) res.status(400).send('리뷰 생성을 실패했습니다.');

    res.status(201).send(review);
  } catch (err: any) {
    console.log(err);
    res.status(500).send(err);
  }
};

// 리뷰 수정 컨트롤러
exports.updateReview = async (req: Request, res: Response): Promise<void> => {
  const { reviewId } = req.params;
  const { content, userId } = req.body;

  if (!userId || !content) {
    res.status(400).send('입력되지 않은 항목이 있습니다.');
    return;
  }

  try {
    const review = await reviewService.updateReview(reviewId, userId, content);

    if (!review) res.status(404).send('수정할 리뷰를 찾을 수 없습니다.');

    res.status(200).send(review);
  } catch (err: any) {
    console.log(err);
    res.status(500).send(err);
  }
};

// 리뷰 삭제 컨트롤러
exports.deleteReview = async (req: Request, res: Response): Promise<void> => {
  const { reviewId } = req.params;
  const { userId } = req.body;

  try {
    const review = await reviewService.deleteReview(reviewId, userId);

    if (!review) res.status(404).send('삭제할 리뷰를 찾을 수 없습니다.');

    res.status(200).send('리뷰 삭제 성공');
  } catch (err: any) {
    console.log(err);
    res.status(500).send(err);
  }
};

// 해당 약의 모든 리뷰 조회 컨트롤러
exports.getDrugAllReview = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { drugId } = req.params;

  try {
    const review = await reviewService.getDrugAllReview(drugId);
    res.status(200).send(review);
  } catch (err: any) {
    console.log(err);
    res.status(500).send(err);
  }
};

// 해당 유저의 모든 리뷰 조회 컨트롤러
exports.getUserAllReview = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { userId } = req.params;

  try {
    const review = await reviewService.getUserAllReview(userId);
    res.status(200).send(review);
  } catch (err: any) {
    console.log(err);
    res.status(500).send(err);
  }
};
