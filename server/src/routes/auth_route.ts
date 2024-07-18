const express = require('express');
const { loginController, signupController, refreshTokenController, kakaoLoginController, kakaoSignupController } = require('../controllers/authController');
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

/**
 * @swagger
 * /auth/kakao/callback:
 *   get:
 *     summary: 카카오 로그인 콜백
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
 *       500:
 *         description: 서버 오류
 */
router.get('/kakao/callback', kakaoLoginController);

/**
 * @swagger
 * /auth/kakao/signup:
 *   post:
 *     summary: 카카오 회원가입
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
 *                 token:
 *                   type: string
 *       409:
 *         description: 이미 가입된 사용자
 */
router.post('/kakao/signup', kakaoSignupController);

router.post('/token', refreshTokenController);

module.exports = router;
