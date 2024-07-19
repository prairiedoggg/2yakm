const Router = require('express');
const reviewController = require('../controllers/reviewController');
const authByToken = require('../middlewares/authByToken');

const router = Router();

/**
 * @swagger
 * /api/reviews/{drugid}:
 *   post:
 *     summary: 리뷰 생성 API
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: drugid
 *         schema:
 *           type: integer
 *         required: true
 *         description: 리뷰가 생성될 drug id 값을 입력해 주세요.
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *             example:
 *               content: "전 이거 먹고 힘을 내요! 완전 추천합니다!"
 *     responses:
 *       201:
 *         description: 리뷰 생성 완료
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 reviewid:
 *                   type: integer
 *                 drugid:
 *                   type: integer
 *                 userid:
 *                   type: string
 *                 content:
 *                   type: string
 *                 created_at:
 *                   type: string
 *                   format: date-time
 *               example:
 *                 reviewid: 1
 *                 drugid: 197000037
 *                 userid: "0190caa1-0c81-7fa2-9e4d-ed3c8ec93d7a"
 *                 content: "전 이거 먹고 힘을 내요! 완전 추천합니다!"
 *                 created_at: "2024-07-16T20:37:08.325Z"
 *       400:
 *         description: 리뷰 내용을 입력해 주세요. / 리뷰 생성을 실패했습니다.
 *       401:
 *         description: 토큰이 없습니다
 *       500:
 *         description: Internal Server Error
 */
router.post('/:drugid', authByToken, reviewController.createReview);

/**
 * @swagger
 * /api/reviews/{reviewid}:
 *   put:
 *     summary: 리뷰 수정 API
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: reviewid
 *         schema:
 *           type: integer
 *         required: true
 *         description: 수정할 review id 값을 입력해 주세요.
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *             example:
 *               content: "생각해보니까 타이레놀이 가장 좋아요!"
 *     responses:
 *       200:
 *         description: 리뷰 수정 완료
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 reviewid:
 *                   type: integer
 *                 drugid:
 *                   type: integer
 *                 userid:
 *                   type: string
 *                 content:
 *                   type: string
 *                 created_at:
 *                   type: string
 *                   format: date-time
 *               example:
 *                 reviewid: 1
 *                 drugid: 197000037
 *                 userid: "0190caa1-0c81-7fa2-9e4d-ed3c8ec93d7a"
 *                 content: "생각해보니까 타이레놀이 가장 좋아요!"
 *                 created_at: "2024-07-16T20:37:08.325Z"
 *       400:
 *         description: 수정할 리뷰 내용을 입력해 주세요.
 *       401:
 *         description: 토큰이 없습니다 / 수정 권한이 없습니다.
 *       404:
 *         description: 수정할 리뷰를 찾을 수 없습니다.
 *       500:
 *         description: Internal Server Error
 */
// 사용자 리뷰 수정
router.put('/:reviewid', authByToken, reviewController.updateReview);

/**
 * @swagger
 * /api/reviews/{reviewid}:
 *   delete:
 *     summary: 리뷰 삭제 API
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: reviewid
 *         schema:
 *           type: integer
 *         required: true
 *         description: 삭제할 review id 값을 입력해 주세요.
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: 리뷰 삭제 성공
 *       401:
 *         description: 토큰이 없습니다 / 수정 권한이 없습니다.
 *       404:
 *         description: 삭제할 리뷰를 찾을 수 없습니다.
 *       500:
 *         description: Internal Server Error
 */
// 사용자 리뷰 삭제
router.delete('/:reviewid', authByToken, reviewController.deleteReview);

/**
 * @swagger
 * /api/reviews/drugs/{drugid}:
 *   get:
 *     summary: 해당 약의 모든 리뷰 조회 API
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: drugid
 *         schema:
 *           type: integer
 *         required: true
 *         description: 리뷰를 조회할 drug id 값을 입력해 주세요.
 *     responses:
 *       200:
 *         description: 해당 약의 모든 리뷰가 표시됩니다.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalCount:
 *                   type: integer
 *                   description: Total number of reviews
 *                   example: 2
 *                 reviews:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       reviewid:
 *                         type: integer
 *                       drugid:
 *                         type: integer
 *                       drugname:
 *                         type: string
 *                       userid:
 *                         type: string
 *                       username:
 *                         type: string
 *                       role:
 *                         type: boolean
 *                       content:
 *                         type: string
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *       500:
 *         description: Internal Server Error
 */
// 해당 약의 모든 리뷰 조회
router.get('/drugs/:drugid', reviewController.getDrugAllReview);

/**
 * @swagger
 * /api/reviews/users/:
 *   get:
 *     summary: 해당 유저의 모든 리뷰 조회 API
 *     tags: [Reviews]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: 글을 몇 개씩 보여줄지 정합니다. (기본값 10)
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *         description: 몇 번째 글 부터 보여줄지 정합니다. (0이면 1~10, 10이면 11~20)
 *       - in: query
 *         name: sortedBy
 *         schema:
 *           type: string
 *         description: 정렬할 필드명을 입력해 주세요. (created_at, drugname,... 기본값은 created_at)
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *         description: 정렬 순서입니다. (ASC, DESC, 대소문자 구분 안함, 기본값은 DESC)
 *     responses:
 *       200:
 *         description: 해당 유저의 모든 리뷰가 표시됩니다.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalCount:
 *                   type: integer
 *                   description: 해당 유저의 전체 리뷰 수
 *                   example: 2
 *                 totalPages:
 *                   type: integer
 *                   description: 전체 페이지 수
 *                   example: 1
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       reviewid:
 *                         type: integer
 *                       drugid:
 *                         type: integer
 *                       drugname:
 *                         type: string
 *                       content:
 *                         type: string
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *       401:
 *         description: 토큰이 없습니다
 *       500:
 *         description: Internal Server Error
 */
// 해당 유저의 모든 리뷰 조회
router.get('/users/', authByToken, reviewController.getUserAllReview);

module.exports = router;
