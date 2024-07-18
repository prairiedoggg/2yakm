const express = require('express');
const { loginController, signupController, refreshTokenController, kakaoAuthController, logoutController, changePasswordController, requestPasswordController, resetPasswordController
} = require('../controllers/authController');
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
 *                   type: object
 *                   properties:
 *                     email:
 *                       type: string
 *                     username:
 *                       type: string
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
router.get('/kakao/callback', kakaoAuthController);

// 로그아웃
router.post('/logout', logoutController);

/**
 * @swagger
 * /token:
 *   post:
 *     summary: 토큰 갱신
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: 토큰 갱신 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 token:
 *                   type: string
 */
router.post('/token', refreshTokenController);

/**
 * @swagger
 * /change-password:
 *   post:
 *     summary: 비밀번호 변경
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: 비밀번호 변경 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
router.post('/change-password', changePasswordController);

/**
 * @swagger
 * /request-password:
 *   post:
 *     summary: 비밀번호 재설정 요청
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: 비밀번호 재설정 이메일이 전송되었습니다.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
router.post('/request-password', requestPasswordController);

/**
 * @swagger
 * /reset-password:
 *   post:
 *     summary: 비밀번호 재설정
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: 비밀번호가 재설정되었습니다.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
router.post('/reset-password', resetPasswordController);

module.exports = router;
