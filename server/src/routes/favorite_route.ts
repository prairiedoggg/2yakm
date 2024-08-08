import { Router } from 'express';
import {
  searchFavoritePill,
  addCancelFavoritePill,
  userFavoriteStatus
} from '../controllers/favoriteController';
import authByToken from '../middlewares/authByToken';

const router = Router();

/**
 * @swagger
 * /api/favorites/:
 *   get:
 *     summary: 유저의 즐겨 찾는 약 조회 API (offset-based pagination)
 *     tags: [Favorites]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: 글을 몇 개씩 보여줄지 정합니다. (기본값 10)<br/>(예, /api/favorites/?ㅣlimit=5)
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *         description: 몇 번째 글 부터 보여줄지 정합니다. (0이면 1~10, 10이면 11~20)
 *       - in: query
 *         name: sortedBy
 *         schema:
 *           type: string
 *         description: 정렬할 필드명을 입력해 주세요. (createdat, name,... 기본값은 createdat)
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
 *                   description: 즐겨 찾는 약의 총 개수입니다.
 *                   example: 2
 *                 totalPages:
 *                   type: integer
 *                   description: 총 페이지 수입니다.
 *                   example: 1
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         description: favorite id
 *                         example: 5
 *                       userid:
 *                         type: string
 *                         description: user id
 *                         example: 0190caa1-0c81-7fa2-9e4d-ed3c8ec93d7a
 *                       pillid:
 *                         type: integer
 *                         description: pill id
 *                         example: 202106092
 *                       name:
 *                         type: string
 *                         description: pill name
 *                         example: "타이레놀정500밀리그람(아세트아미노펜)"
 *                       efficacy:
 *                         type: string
 *                         description: pill efficacy(효능)
 *                         example: "1. 주효능·효과\n감기로 인한 발열 및 동통(통증), 두통, 신경통, 근육통, 월경통, 염좌통(삔 통증)\n2. 다음 질환에도 사용할 수 있다.\n치통, 관절통, 류마티양 동통(통증)"
 *                       boxurl:
 *                         type: string
 *                         description: 약 상자 사진 url
 *                         example: "https://res.cloudinary.com/dnxyampqy/image/upload/v1722529384/boximg/eyakmoyak/198500207.jpg"
 *                       createdat:
 *                         type: string
 *                         format: date-time
 *                       importantWords:
 *                         type: string
 *                         description: 증상 태그
 *                         example: "두통, 신경통, 근육통"
 *       400:
 *         description: limit, offset 값을 다시 확인해 주세요.
 *       401:
 *         description: 토큰이 없습니다
 *       500:
 *         description: Internal Server Error
 */
// 즐겨 찾는 약 검색
router.get('/', authByToken, searchFavoritePill);

/**
 * @swagger
 * /api/favorites/{pillid}:
 *   post:
 *     summary: 좋아요 추가, 취소 API
 *     description: API를 요청 할 때 좋아요가 없으면 좋아요가 추가되고, 좋아요가 있으면 좋아요가 취소됩니다.
 *     tags: [Favorites]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: pillid
 *         schema:
 *           type: integer
 *         required: true
 *         description: 좋아요가 추가, 취소될 pill id 값을 입력해 주세요.
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
router.post('/:pillid', authByToken, addCancelFavoritePill);

/**
 * @swagger
 * /api/favorites/{pillid}/status:
 *   get:
 *     summary: 접속한 유저가 좋아요를 눌렀는지 확인하는 API
 *     tags: [Favorites]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: pillid
 *         schema:
 *           type: integer
 *         required: true
 *         description: pill id
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
router.get('/:pillid/status', authByToken, userFavoriteStatus);

// /**
//  * @swagger
//  * /api/favorites/{pillid}/count:
//  *   get:
//  *     summary: 해당 약의 좋아요 수 조회 API
//  *     tags: [Favorites]
//  *     parameters:
//  *       - in: path
//  *         name: pillid
//  *         schema:
//  *           type: integer
//  *         required: true
//  *         description: 좋아요 수를 조회할 pill id 값을 입력해 주세요.
//  *     responses:
//  *       200:
//  *         description: 해당 약의 좋아요 수가 표시됩니다.
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 count:
//  *                   type: integer
//  *                   description: 좋아요 수
//  *                   example: 123
//  *       500:
//  *         description: Internal Server Error
//  */
// // 해당 약의 좋아요 수를 확인
// router.get('/:pillid/count', getPillFavoriteCount);

/**
 * @swagger
 * components:
 *   schemas:
 *     Favorite:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           format: int64
 *           description: favorite id입니다.
 *         pillid:
 *           type: integer
 *           format: int64
 *           description: pill id입니다.
 *         userid:
 *           type: string
 *           description: user id입니다.
 *         createdat:
 *           type: string
 *           format: date-time
 *           description: 리뷰가 생성된 시간이 저장됩니다.
 */

export default router;
