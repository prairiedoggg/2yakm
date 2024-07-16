const Router = require('express');
const reviewController = require('../controllers/reviewController');

const router = Router();

// 사용자 리뷰 생성
router.post('/', reviewController.createReview);

// 사용자 리뷰 수정
router.put('/:reviewId', reviewController.updateReview);

// 사용자 리뷰 삭제
router.delete('/:reviewId', reviewController.deleteReview);

// 해당 약의 모든 리뷰 조회
router.get('/drugs/:drugId', reviewController.getDrugAllReview);

// 해당 유저의 모든 리뷰 조회
router.get('/users/:userId', reviewController.getUserAllReview);

module.exports = router;
