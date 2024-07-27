import { Router } from 'express';
import * as alarmController from '../controllers/alarmController';

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     AlarmTime:
 *       type: object
 *       properties:
 *         time:
 *           type: string
 *           pattern: ^\d{2}:\d{2}$
 *     Alarm:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         userId:
 *           type: string
 *         name:
 *           type: string
 *         startDate:
 *           type: string
 *           format: date-time
 *         endDate:
 *           type: string
 *           format: date-time
 *         times:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/AlarmTime'
 *         alarmStatus:
 *           type: boolean
 */

/**
 * @swagger
 * tags:
 *   name: Alarms
 *   description: 알람 관리 API
 */

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
 *               name:
 *                 type: string
 *               startDate:
 *                 type: string
 *                 format: date-time
 *               endDate:
 *                 type: string
 *                 format: date-time
 *               times:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/AlarmTime'
 *     responses:
 *       201:
 *         description: 알람 생성 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Alarm'
 *       400:
 *         description: 잘못된 요청
 *       401:
 *         description: 인증되지 않은 사용자
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
 *                 $ref: '#/components/schemas/Alarm'
 *       401:
 *         description: 인증되지 않은 사용자
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
 *               name:
 *                 type: string
 *               startDate:
 *                 type: string
 *                 format: date-time
 *               endDate:
 *                 type: string
 *                 format: date-time
 *               times:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/AlarmTime'
 *               alarmStatus:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: 알람 업데이트 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Alarm'
 *       400:
 *         description: 잘못된 요청
 *       401:
 *         description: 인증되지 않은 사용자
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
 *       401:
 *         description: 인증되지 않은 사용자
 *       404:
 *         description: 알람을 찾을 수 없음
 *       500:
 *         description: 서버 오류
 */
router.delete('/:id', alarmController.deleteAlarmController);

/**
 * @swagger
 * /api/alarms/{id}/status:
 *   patch:
 *     summary: 알람 상태 업데이트
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
 *               alarmStatus:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: 알람 상태 업데이트 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Alarm'
 *       400:
 *         description: 잘못된 요청
 *       401:
 *         description: 인증되지 않은 사용자
 *       404:
 *         description: 알람을 찾을 수 없음
 *       500:
 *         description: 서버 오류
 */
router.patch('/:id/status', alarmController.updateAlarmStatusController);

export default router;
