const { Router } = require("express");
const calendarController = require('../controllers/calendarController');
const router = Router();

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
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   userId:
 *                     type: string
 *                   date:
 *                     type: string
 *                     format: date-time
 *                   calImg:
 *                     type: string
 *                   condition:
 *                     type: string
 *                   weight:
 *                     type: number
 *                   temperature:
 *                     type: number
 *                   bloodsugar:
 *                     type: number
 *       500:
 *         description: 서버 오류
 */
router.get('/', calendarController.getAllCalendars); // 사용자 일정 전체보기

/**
 * @swagger
 * /api/calendars/{id}:
 *   get:
 *     summary: 일정 상세보기
 *     tags: [Calendars]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 일정 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 userId:
 *                   type: string
 *                 date:
 *                   type: string
 *                   format: date-time
 *                 calImg:
 *                   type: string
 *                 condition:
 *                   type: string
 *                 weight:
 *                   type: number
 *                 temperature:
 *                   type: number
 *                 bloodsugar:
 *                   type: number
 *       404:
 *         description: 일정을 찾을 수 없음
 *       500:
 *         description: 서버 오류
 */
router.get('/:id', calendarController.getCalendarById); // 일정 상세보기

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
 *               alarm:
 *                 type: string
 *                 format: date-time
 *               condition:
 *                 type: string
 *               weight:
 *                 type: number
 *               temperature:
 *                 type: number
 *               bloodsugar:
 *                 type: number
 *               calImg:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: 일정 작성 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 userId:
 *                   type: string
 *                 date:
 *                   type: string
 *                   format: date-time
 *                 calImg:
 *                   type: string
 *                 condition:
 *                   type: string
 *                 weight:
 *                   type: number
 *                 temperature:
 *                   type: number
 *                 bloodsugar:
 *                   type: number
 *       400:
 *         description: 잘못된 요청
 *       500:
 *         description: 서버 오류
 */
router.post('/', calendarController.createCalendar); // 일정 작성

/**
 * @swagger
 * /api/calendars/{id}:
 *   put:
 *     summary: 일정 업데이트
 *     tags: [Calendars]
 *     parameters:
 *       - in: path
 *         name: id
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
 *               bloodsugar:
 *                 type: number
 *               calImg:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: 일정 업데이트 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 userId:
 *                   type: string
 *                 date:
 *                   type: string
 *                   format: date-time
 *                 calImg:
 *                   type: string
 *                 condition:
 *                   type: string
 *                 weight:
 *                   type: number
 *                 temperature:
 *                   type: number
 *                 bloodsugar:
 *                   type: number
 *       404:
 *         description: 일정을 찾을 수 없음
 *       500:
 *         description: 서버 오류
 */
router.put('/:id', calendarController.updateCalendar); // 일정 ID로 업데이트

/**
 * @swagger
 * /api/calendars/{id}:
 *   delete:
 *     summary: 일정 삭제
 *     tags: [Calendars]
 *     parameters:
 *       - in: path
 *         name: id
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
router.delete('/:id', calendarController.deleteCalendar); // 일정 ID로 삭제

module.exports = router;
