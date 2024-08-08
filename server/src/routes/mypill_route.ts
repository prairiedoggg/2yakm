import { Router } from 'express';
const router = Router();
import {
  addMyPill,
  updateMyPill,
  getMyPills,
  deleteMyPill
} from '../controllers/mypillController';

/**
 * @swagger
 * /api/mypills:
 *   post:
 *     summary: 새로운 약 추가
 *     tags: [mypills]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: 감기약
 *               expiredat:
 *                 type: string
 *                 format: date
 *                 example: 2023-12-31
 *               alarmstatus:
 *                 type: boolean
 *               
 *     responses:
 *       200:
 *         description: 성공
 */
router.post('/', addMyPill);

/**
 * @swagger
 * /api/mypills/{mypillid}:
 *   put:
 *     summary: 약 정보 업데이트
 *     tags: [mypills]
 *     parameters:
 *       - in: path
 *         name: mypillid
 *         required: true
 *         schema:
 *           type: string
 *         description: 업데이트할 약 ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: 감기약
 *               expiredat:
 *                 type: string
 *                 format: date
 *                 example: 2023-12-31
 *               alarmstatus:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: 성공
 */
router.put('/:mypillid', updateMyPill);

/**
 * @swagger
 * /api/mypills:
 *   get:
 *     summary: 모든 약 정보 가져오기
 *     tags: [mypills]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: 가져올 약의 수
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *         description: 가져올 약의 시작 위치
 *       - in: query
 *         name: sortedBy
 *         schema:
 *           type: string
 *         description: 정렬 기준 필드
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [ASC, DESC]
 *         description: 정렬 순서
 *     responses:
 *       200:
 *         description: 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   expiredat:
 *                     type: string
 *                     format: date
 *                   createdat:
 *                     type: string
 *                     format: date
 *                   alarmstatus:
 *                     type: boolean
 */
router.get('/', getMyPills);

/**
 * @swagger
 * /api/mypills/{mypillid}:
 *   delete:
 *     summary: 약 정보 삭제
 *     tags: [mypills]
 *     parameters:
 *       - in: path
 *         name: mypillid
 *         required: true
 *         schema:
 *           type: string
 *         description: 삭제할 약 ID
 *     responses:
 *       200:
 *         description: 성공
 */
router.delete('/:mypillid', deleteMyPill);

export default router;
