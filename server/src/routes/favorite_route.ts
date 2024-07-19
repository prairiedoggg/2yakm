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
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
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

module.exports = router;
