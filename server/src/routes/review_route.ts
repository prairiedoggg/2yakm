import { Router, Request, Response } from 'express';
const reviewController = require('../controllers/reviewController');

const router = Router();

router.post('/', reviewController.createReview);

module.exports = router;
