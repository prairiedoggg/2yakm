import { Router } from 'express';
import {
  createReview,
  updateReview,
  deleteReview,
  getPillsAllReview,
  getUserAllReview
} from '../controllers/reviewController';
import authByToken from '../middlewares/authByToken';

const router = Router();

/**
 * @swagger
 * /api/reviews:
 *   post:
 *     summary: 리뷰 생성 API
 *     tags: [Reviews]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               pillid:
 *                 type: integer
 *                 description: 리뷰가 생성될 pill id 값을 입력해 주세요.
 *               content:
 *                 type: string
 *                 description: 리뷰 내용을 입력해 주세요.
 *             example:
 *               pillid: 197000037
 *               content: "전 이거 먹고 힘을 내요! 완전 추천합니다!"
 *     responses:
 *       201:
 *         description: 리뷰 생성 완료
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 pillid:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 userid:
 *                   type: string
 *                 username:
 *                   type: string
  *                 profileimg:
 *                   type: string
 *                 content:
 *                   type: string
 *                 createdat:
 *                   type: string
 *                   format: date-time
 *               example:
 *                 id: 1
 *                 pillid: 197000037
 *                 name: 아로나민골드정
 *                 userid: "0190caa1-0c81-7fa2-9e4d-ed3c8ec93d7a"
 *                 username: "test"
 *                 profileimg: "https://eyakmoyak.s3.ap-northeast-2.amazonaws.com/1722569018981-dog2.jpeg"
 *                 content: "전 이거 먹고 힘을 내요! 완전 추천합니다!"
 *                 createdat: "2024-07-16T20:37:08.325Z"
 *       400:
 *         description: 리뷰 내용을 입력해 주세요. / 리뷰 생성을 실패했습니다.
 *       401:
 *         description: 토큰이 없습니다
 *       500:
 *         description: Internal Server Error
 */
router.post('/', authByToken, createReview);

/**
 * @swagger
 * /api/reviews/{id}:
 *   put:
 *     summary: 리뷰 수정 API
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: id
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
 *                 id:
 *                   type: integer
 *                 pillid:
 *                   type: integer
 *                 userid:
 *                   type: string
 *                 content:
 *                   type: string
 *                 createdat:
 *                   type: string
 *                   format: date-time
 *               example:
 *                 id: 1
 *                 pillid: 197000037
 *                 userid: "0190caa1-0c81-7fa2-9e4d-ed3c8ec93d7a"
 *                 content: "생각해보니까 타이레놀이 가장 좋아요!"
 *                 createdat: "2024-07-16T20:37:08.325Z"
 *       400:
 *         description: 수정할 리뷰가 없거나 본인의 리뷰가 아닙니다.
 *       401:
 *         description: 토큰이 없습니다.
 *       500:
 *         description: Internal Server Error
 */
// 사용자 리뷰 수정
router.put('/:id', authByToken, updateReview);

/**
 * @swagger
 * /api/reviews/{id}:
 *   delete:
 *     summary: 리뷰 삭제 API
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: 삭제할 review id 값을 입력해 주세요.
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: 리뷰 삭제 성공
 *       400:
 *         description: 삭제할 리뷰가 없거나 본인의 리뷰가 아닙니다.
 *       401:
 *         description: 토큰이 없습니다.
 *       500:
 *         description: Internal Server Error
 */
// 사용자 리뷰 삭제
router.delete('/:id', authByToken, deleteReview);

/**
 * @swagger
 * /api/reviews/users/:
 *   get:
 *     summary: 해당 유저의 모든 리뷰 조회 API (offset-based pagination)
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
 *         description: 정렬할 필드명을 입력해 주세요. (createdat, name,... 기본값은 createdat)
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
 *                       id:
 *                         type: integer
 *                       pillid:
 *                         type: integer
 *                       name:
 *                         type: string
 *                       content:
 *                         type: string
 *                       createdat:
 *                         type: string
 *                         format: date-time
 *       400:
 *         description: limit, offset 값을 다시 확인해 주세요.
 *       401:
 *         description: 토큰이 없습니다
 *       500:
 *         description: Internal Server Error
 */
// 해당 유저의 모든 리뷰 조회
router.get('/users/', authByToken, getUserAllReview);

/**
 * @swagger
 * /api/reviews/pills/{pillid}:
 *   get:
 *     summary: 해당 약의 모든 리뷰 조회 API (cursor-based pagination)
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: pillid
 *         schema:
 *           type: integer
 *         required: true
 *         description: 리뷰를 조회할 pill id 값을 입력해 주세요.
 *       - in: query
 *         name: initialLimit
 *         schema:
 *           type: integer
 *         required: false
 *         description: 첫 번째 요청 시 가져올 리뷰의 개수를 지정합니다. (입력 안하면 기본값 10)</br>(예, /api/reviews/pills/199800355?initialLimit=10)
 *       - in: query
 *         name: cursorLimit
 *         schema:
 *           type: integer
 *         required: false
 *         description: 이후 스크롤할 때 가져올 리뷰의 개수를 지정합니다. (입력 안하면 기본값 10)</br>(예, /api/reviews/pills/199800355?cursorLimit=5&cursor=93)</br>(처음에 10개, 그 이후 스크롤 될 때마다 5개씩 가져옴)
 *       - in: query
 *         name: cursor
 *         schema:
 *           type: string
 *           format: json
 *         required: false
 *         description: 다음 페이지를 가져오기 위한 커서 값</br>(이전 페이지의 마지막 리뷰의 id 값, nextCursor의 값 입력하면 됨)</br>(예, nextCursor=93이면 다음 스크롤은 92부터 cursorLimit만큼 가져옴)</br>(마지막 페이지의 nextCursor은 null 값입니다.)
 *     responses:
 *       200:
 *         description: 해당 약의 모든 리뷰가 표시됩니다.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 reviews:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       pillid:
 *                         type: integer
 *                       name:
 *                         type: string
 *                       userid:
 *                         type: string
 *                       username:
 *                         type: string
 *                       role:
 *                         type: boolean
 *                       profileimg:
 *                         type: string
 *                       content:
 *                         type: string
 *                       createdat:
 *                         type: string
 *                         format: date-time
 *                 nextCursor:
 *                   type: integer
 *                   description: 다음 페이지를 가져오기 위한 커서 값 (마지막으로 반환된 리뷰의 id)
 *       400:
 *         description: initialLimit, cursorLimit 값을 다시 확인해 주세요.
 *       500:
 *         description: Internal Server Error
 */
// 해당 약의 모든 리뷰 조회
router.get('/pills/:pillid', getPillsAllReview);

/**
 * @swagger
 * components:
 *   schemas:
 *     Review:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           format: int64
 *           description: review id입니다.
 *         pillid:
 *           type: integer
 *           format: int64
 *           description: pill id입니다.
 *         userId:
 *           type: string
 *           description: user id입니다.
 *         content:
 *           type: string
 *           description: 리뷰 내용입니다.
 *         createdat:
 *           type: string
 *           format: date-time
 *           description: 리뷰가 생성된 시간이 저장됩니다.
 */

export default router;
