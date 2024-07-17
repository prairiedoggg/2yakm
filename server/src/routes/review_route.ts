const Router = require('express');
const reviewController = require('../controllers/reviewController');

const router = Router();

/**
 * @swagger
 * /reviews/{drugId}:
 *   post:
 *     summary: 리뷰 생성 API
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: drugId
 *         schema:
 *           type: integer
 *         required: true
 *         description: 리뷰가 생성될 Drug ID 값을 입력해 주세요.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               role:
 *                 type: boolean
 *               content:
 *                 type: string
 *             example:
 *               userId: "fjk49djfh3"
 *               role: false
 *               content: "열은 빨리 내리는데, 요즘 대체약들이 좋은 약들이 많아졌어요."
 *     responses:
 *       201:
 *         description: 리뷰 생성 완료
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 reviewId:
 *                   type: integer
 *                 drugId:
 *                   type: integer
 *                 drugName:
 *                   type: string
 *                 userId:
 *                   type: string
 *                 role:
 *                   type: boolean
 *                 content:
 *                   type: string
 *                 created_at:
 *                   type: string
 *                   format: date-time
 *               example:
 *                 reviewId: 1
 *                 drugId: 197000037
 *                 drugName: "아로나민골드정"
 *                 userId: "fjk3f8dkf"
 *                 role: false
 *                 content: "전 먹어봤는데 별로였어요"
 *                 created_at: "2024-07-16T20:37:08.325Z"
 *       400:
 *         description: 입력되지 않은 항목이 있음
 *       500:
 *         description: 리뷰 생성 실패
 */
router.post('/:drugId', reviewController.createReview);

/**
 * @swagger
 * /reviews/{reviewId}:
 *   put:
 *     summary: 리뷰 수정 API
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: reviewId
 *         schema:
 *           type: integer
 *         required: true
 *         description: 수정할 Review ID 값을 입력해 주세요.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *               userId:
 *                 type: string
 *             example:
 *               content: "생각해보니까 타이레놀이 가장 좋아요!"
 *               userId: "fjk49djfh3"
 *     responses:
 *       200:
 *         description: 리뷰 수정 완료
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 reviewId:
 *                   type: integer
 *                 drugId:
 *                   type: integer
 *                 drugName:
 *                   type: string
 *                 userId:
 *                   type: string
 *                 role:
 *                   type: boolean
 *                 content:
 *                   type: string
 *                 created_at:
 *                   type: string
 *                   format: date-time
 *               example:
 *                 reviewId: 1
 *                 drugId: 197000037
 *                 drugName: "아로나민골드정"
 *                 userId: "fjk3f8dkf"
 *                 role: false
 *                 content: "생각해보니까 타이레놀이 가장 좋아요!"
 *                 created_at: "2024-07-16T20:37:08.325Z"
 *       400:
 *         description: 입력되지 않은 항목이 있음
 *       404:
 *         description: 수정할 리뷰를 찾을 수 없음
 *       500:
 *         description: 리뷰 수정 실패
 */
// 사용자 리뷰 수정
router.put('/:reviewId', reviewController.updateReview);

/**
 * @swagger
 * /reviews/{reviewId}:
 *   delete:
 *     summary: 리뷰 삭제 API
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: reviewId
 *         schema:
 *           type: integer
 *         required: true
 *         description: 삭제할 Review ID 값을 입력해 주세요.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *             example:
 *               userId: "fjk49djfh3"
 *     responses:
 *       200:
 *         description: 리뷰 삭제 성공
 *       404:
 *         description: 삭제할 리뷰를 찾을 수 없음
 *       500:
 *         description: 리뷰 삭제 실패
 */
// 사용자 리뷰 삭제
router.delete('/:reviewId', reviewController.deleteReview);

/**
 * @swagger
 * /reviews/drugs/{drugId}:
 *   get:
 *     summary: 해당 약의 모든 리뷰 조회 API
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: drugId
 *         schema:
 *           type: integer
 *         required: true
 *         description: 리뷰를 조회할 Drug ID 값을 입력해 주세요.
 *     responses:
 *       200:
 *         description: 해당 약의 모든 리뷰가 표시됩니다.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   reviewId:
 *                     type: integer
 *                   drugId:
 *                     type: integer
 *                   userId:
 *                     type: string
 *                   role:
 *                     type: boolean
 *                   content:
 *                     type: string
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *                   updated_at:
 *                     type: string
 *                     format: date-time
 *       500:
 *         description: Some server error
 */
// 해당 약의 모든 리뷰 조회
router.get('/drugs/:drugId', reviewController.getDrugAllReview);

/**
 * @swagger
 * /reviews/users/{userId}:
 *   get:
 *     summary: 해당 유저의 모든 리뷰 조회 API
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: false
 *         description: 조회할 유저의 ID를 입력해 주세요.
 *     responses:
 *       200:
 *         description: 해당 유저의 모든 리뷰가 표시됩니다.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   reviewId:
 *                     type: integer
 *                   drugId:
 *                     type: integer
 *                   userId:
 *                     type: string
 *                   role:
 *                     type: boolean
 *                   content:
 *                     type: string
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *                   updated_at:
 *                     type: string
 *                     format: date-time
 *       500:
 *         description: Some server error
 */
// 해당 유저의 모든 리뷰 조회
router.get('/users/:userId', reviewController.getUserAllReview);

module.exports = router;
