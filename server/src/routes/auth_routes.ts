const express = require('express');
const { loginController, signupController, refreshTokenController } = require('../controllers/authController');
// const { loginService, signupService } = require('../services/authService');
const router = express.Router();

/**
 * @swagger
 * /login:
 *   post:
 *     summary: 사용자 로그인
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: 로그인 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 token:
 *                   type: string
 *       401:
 *         description: 인증 실패
 */
router.post('/login', loginController);

/**
 * @swagger
 * /signup:
 *   post:
 *     summary: 사용자 회원가입
 *     tags: [Auth]
 *     responses:
 *       201:
 *         description: 회원가입 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *       409:
 *         description: 사용자 이미 존재함
 */
router.post('/signup', signupController);
router.post('/token', refreshTokenController);

module.exports = router;
