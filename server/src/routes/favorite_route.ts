const Router = require('express');
const favoriteController = require('../controllers/favoriteController');
const authByToken = require('../middlewares/authByToken');

const router = Router();

/**
 * @swagger
 * /api/favorites:
 *   get:
 *     summary: 유저의 즐겨 찾는 약 조회 API
 *     tags: [Favorites]
 *     security:
 *       - bearerAuth: []
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
 *         description: 즐겨 찾는 약의 리스트가 표시됩니다.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalCount:
 *                   type: integer
 *                   description: Total number of favorite drugs
 *                   example: 2
 *                 totalPages:
 *                   type: integer
 *                   description: Total number of pages
 *                   example: 1
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       favoriteid:
 *                         type: integer
 *                         description: favorite id
 *                         example: 5
 *                       email:
 *                         type: string
 *                         description: User's email
 *                         example: test@test.com
 *                       drugid:
 *                         type: integer
 *                         description: Drug ID
 *                         example: 199800355
 *                       drugname:
 *                         type: string
 *                         description: Drug name
 *                         example: "데카미솔연고"
 *                       efficacy:
 *                         type: string
 *                         description: Drug efficacy
 *                         example: "이 약은 네오마이신 감수성 세균에 의해 2차 감염된 코르티코이드 반응성 피부질환의 초기 치료(피부염, 감염된 상처)에 사용합니다."
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *       401:
 *         description: 토큰이 없습니다
 *       500:
 *         description: Internal Server Error
 */
// 즐겨 찾는 약 검색
router.get('/', authByToken, favoriteController.searchFavoriteDrug);

/**
 * @swagger
 * /api/favorites/{drugid}:
 *   post:
 *     summary: 좋아요 추가, 취소 API
 *     description: API를 요청 할 때 좋아요가 없으면 좋아요가 추가되고, 좋아요가 있으면 좋아요가 취소됩니다.
 *     tags: [Favorites]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: drugid
 *         schema:
 *           type: integer
 *         required: true
 *         description: 좋아요가 추가, 취소될 drug id 값을 입력해 주세요.
 *     responses:
 *       200:
 *         description: 좋아요를 취소했습니다.
 *       201:
 *         description: 좋아요를 추가했습니다.
 *       401:
 *         description: 토큰이 없습니다
 *       500:
 *         description: Internal Server Error
 */
// 좋아요 추가, 취소
router.post('/:drugid', authByToken, favoriteController.addCancelFavoriteDrug);

/**
 * @swagger
 * /api/favorites/status/user/{drugid}:
 *   get:
 *     summary: 접속한 유저가 좋아요를 눌렀는지 확인하는 API
 *     tags: [Favorites]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: drugid
 *         schema:
 *           type: integer
 *         required: true
 *         description: 약 ID
 *     responses:
 *       200:
 *         description: 좋아요를 눌렀으면 true, 누르지 않은 상태라면 false가 반환됩니다.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   description: 좋아요 상태
 *                   example: true
 *       401:
 *         description: 토큰이 없습니다
 *       500:
 *         description: Internal Server Error
 */
// 좋아요를 눌렀는지 확인
router.get(
  '/status/user/:drugid',
  authByToken,
  favoriteController.userFavoriteStatus
);

module.exports = router;
