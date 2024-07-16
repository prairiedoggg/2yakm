import { Response, Request } from 'express';
const reviewService = require('../services/reviewService');

const createReview = async (req: Request, res: Response) => {
  const { drugId, userId, role, content } = req.body;

  try {
    const review = await reviewService.createReview(
      drugId,
      userId,
      role,
      content
    );
    res.status(201).send(review);
  } catch (err) {
    console.log(err);
  }
};

module.exports = { createReview };
