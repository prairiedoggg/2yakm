import { Router } from 'express';
import * as calendarController from '../controllers/calendarController';

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Calendar:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         userId:
 *           type: string
 *         date:
 *           type: string
 *           format: date-time
 *         calImg:
 *           type: string
 *         condition:
 *           type: string
 *         weight:
 *           type: number
 *         temperature:
 *           type: number
 *         bloodsugarBefore:
 *           type: number
 *         bloodsugarAfter:
 *           type: number
 *         medications:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               time:
 *                 type: string
 *               taken:
 *                 type: boolean
 *
 */

/**
 * @swagger
 * /api/calendars:
 *   get:
 *     summary: 사용자 일정 전체보기
 *     tags: [Calendars]
 *     responses:
 *       200:
 *         description: 일정 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Calendar'
 *       500:
 *         description: 서버 오류
 */
router.get('/', calendarController.getAllCalendars);

/**
 * @swagger
 * /api/calendars/{date}:
 *   get:
 *     summary: 일정 상세보기
 *     tags: [Calendars]
 *     parameters:
 *       - in: path
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 일정 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Calendar'
 *       404:
 *         description: 일정을 찾을 수 없음
 *       500:
 *         description: 서버 오류
 */
router.get('/:date', calendarController.getCalendarById);

/**
 * @swagger
 * /api/calendars:
 *   post:
 *     summary: 일정 작성
 *     tags: [Calendars]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               date:
 *                 type: string
 *                 format: date-time
 *               condition:
 *                 type: string
 *               weight:
 *                 type: number
 *               temperature:
 *                 type: number
 *               bloodsugarBefore:
 *                 type: number
 *               bloodsugarAfter:
 *                 type: number
 *               medications:
 *                 type: string
 *               calImg:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: 일정 작성 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Calendar'
 *       400:
 *         description: 잘못된 요청
 *       500:
 *         description: 서버 오류
 */
router.post('/', calendarController.createCalendar);

/**
 * @swagger
 * /api/calendars/{date}:
 *   put:
 *     summary: 일정 업데이트
 *     tags: [Calendars]
 *     parameters:
 *       - in: path
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               date:
 *                 type: string
 *                 format: date-time
 *               condition:
 *                 type: string
 *               weight:
 *                 type: number
 *               temperature:
 *                 type: number
 *               bloodsugarBefore:
 *                 type: number
 *               bloodsugarAfter:
 *                 type: number
 *               medications:
 *                 type: string
 *               calImg:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: 일정 업데이트 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Calendar'
 *       404:
 *         description: 일정을 찾을 수 없음
 *       500:
 *         description: 서버 오류
 */
router.put('/:date', calendarController.updateCalendar);

/**
 * @swagger
 * /api/calendars/{date}:
 *   delete:
 *     summary: 일정 삭제
 *     tags: [Calendars]
 *     parameters:
 *       - in: path
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 일정 삭제 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: 일정을 찾을 수 없음
 *       500:
 *         description: 서버 오류
 */
router.delete('/:date', calendarController.deleteCalendar);

export default router;
