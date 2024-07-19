const express = require('express');
const alarmController = require('../controllers/alarmController');

const router = express.Router();

/**
 * @swagger
 * /api/alarms:
 *   post:
 *     summary: 알람 생성 및 스케줄링
 *     tags: [Alarms]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               startDate:
 *                 type: string
 *                 format: date-time
 *               duration:
 *                 type: number
 *               interval:
 *                 type: number
 *               message:
 *                 type: string
 *               time:
 *                 type: string
 *                 pattern: ^\d{2}:\d{2}$
 *     responses:
 *       201:
 *         description: 알람 생성 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userId:
 *                   type: string
 *                 startDate:
 *                   type: string
 *                   format: date-time
 *                 endDate:
 *                   type: string
 *                   format: date-time
 *                 interval:
 *                   type: number
 *                 message:
 *                   type: string
 *                 time:
 *                   type: string
 *                 alarmStatus:
 *                   type: boolean
 *       400:
 *         description: 잘못된 요청
 *       500:
 *         description: 서버 오류
 */
router.post('/', alarmController.createAndScheduleAlarm);

/**
 * @swagger
 * /api/alarms:
 *   get:
 *     summary: 사용자 알람 조회
 *     tags: [Alarms]
 *     responses:
 *       200:
 *         description: 알람 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   userId:
 *                     type: string
 *                   startDate:
 *                     type: string
 *                     format: date-time
 *                   endDate:
 *                     type: string
 *                     format: date-time
 *                   interval:
 *                     type: number
 *                   message:
 *                     type: string
 *                   time:
 *                     type: string
 *                   alarmStatus:
 *                     type: boolean
 *       500:
 *         description: 서버 오류
 */
router.get('/', alarmController.getUserAlarmsController);

/**
 * @swagger
 * /api/alarms/{id}:
 *   put:
 *     summary: 알람 업데이트
 *     tags: [Alarms]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               startDate:
 *                 type: string
 *                 format: date-time
 *               endDate:
 *                 type: string
 *                 format: date-time
 *               interval:
 *                 type: number
 *               message:
 *                 type: string
 *               time:
 *                 type: string
 *                 pattern: ^\d{2}:\d{2}$
 *               alarmStatus:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: 알람 업데이트 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userId:
 *                   type: string
 *                 startDate:
 *                   type: string
 *                   format: date-time
 *                 endDate:
 *                   type: string
 *                   format: date-time
 *                 interval:
 *                   type: number
 *                 message:
 *                   type: string
 *                 time:
 *                   type: string
 *                 alarmStatus:
 *                   type: boolean
 *       404:
 *         description: 알람을 찾을 수 없음
 *       500:
 *         description: 서버 오류
 */
router.put('/:id', alarmController.updateAlarmController);

/**
 * @swagger
 * /api/alarms/{id}:
 *   delete:
 *     summary: 알람 삭제
 *     tags: [Alarms]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 알람 삭제 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: 알람을 찾을 수 없음
 *       500:
 *         description: 서버 오류
 */
router.delete('/:id', alarmController.deleteAlarmController);

module.exports = router;
