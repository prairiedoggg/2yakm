import { NOTFOUND } from 'dns';
import { Response, Request } from 'express';
const reviewService = require('../services/reviewService');

// 리뷰 생성 컨트롤러
const createReview = async (req: Request, res: Response) => {
  const { drugId, drugName, userId, role, content } = req.body;

  try {
    const review = await reviewService.createReview(
      drugId,
      drugName,
      userId,
      role,
      content
    );
    res.status(201).send(review);
  } catch (err: any) {
    console.log(err);
  }
};

// 리뷰 수정 컨트롤러
const updateReview = async (req: Request, res: Response) => {
  const { reviewId } = req.params;
  const { content, userId } = req.body;

  const review = await reviewService.updateReview(reviewId, userId, content);

  try {
    if (!review) {
      throw new Error('수정할 리뷰를 찾을 수 없습니다.');
    }

    res.status(200).send(review);
  } catch (err: any) {
    console.log(err);
  }
};

// 리뷰 삭제 컨트롤러
const deleteReview = async (req: Request, res: Response) => {
  const { reviewId } = req.params;
  const { userId } = req.body;

  const review = await reviewService.deleteReview(reviewId, userId);

  try {
    if (!review) {
      throw new Error('삭제할 리뷰를 찾을 수 없습니다.');
    }

    res.status(200).send('삭제 완료');
  } catch (err: any) {
    console.log(err);
  }
};

// 해당 약의 모든 리뷰 조회 컨트롤러
const getDrugAllReview = async (req: Request, res: Response) => {
  const { drugId } = req.params;

  try {
    const review = await reviewService.getDrugAllReview(drugId);
    res.status(200).send(review);
  } catch (err: any) {
    console.log(err);
  }
};

// 해당 유저의 모든 리뷰 조회 컨트롤러
const getUserAllReview = async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const review = await reviewService.getUserAllReview(userId);
    res.status(200).send(review);
  } catch (err: any) {
    console.log(err);
  }
};

module.exports = {
  createReview,
  updateReview,
  deleteReview,
  getDrugAllReview,
  getUserAllReview
};
