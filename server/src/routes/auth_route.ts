import { Router } from 'express';
import {
  loginController,
  signupController,
  refreshTokenController,
  kakaoAuthController,
  logoutController,
  changePasswordController,
  requestPasswordController,
  resetPasswordController,
  googleAuthController,
  linkKakaoAccountController,
  linkGoogleAccountController,
  linkNaverAccountController,
  verifyEmailController,
  requestEmailVerificationController,
  changeUsernameController,
  deleteAccountController,
  naverAuthController,
  getUserInfoController,
  kakaoRedirectController,
  naverRedirectController,
  googleRedirectController
} from '../controllers/authController';
import authByToken from '../middlewares/authByToken';

const router = Router();

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: 사용자 로그인
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
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
 *       401:
 *         description: 인증 실패
 */
router.post('/login', loginController);

/**
 * @swagger
 * /api/auth/token:
 *   post:
 *     summary: 토큰 갱신
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
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
 */
router.post('/token', refreshTokenController);

/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     summary: 사용자 회원가입
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               confirmPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: 회원가입 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       409:
 *         description: 사용자 이미 존재함
 */
router.post('/signup', signupController);

/**
 * @swagger
 * /api/auth/request-email-verification:
 *   post:
 *     summary: 이메일 인증 요청
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: 이메일 인증 링크가 전송되었습니다.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       429:
 *         description: 비밀번호 재설정 요청 쿨타임이 지나지 않았습니다. 잠시 후 다시 시도해주세요.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
router.post('/request-email-verification', requestEmailVerificationController);

/**
 * @swagger
 * /api/auth/kakao/callback:
 *   get:
 *     summary: 카카오 로그인 콜백
 *     tags: [Auth]
 *     parameters:
 *       - name: code
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       302:
 *         description: 로그인 성공, 리다이렉션
 *       400:
 *         description: 인증 실패, 로그인 페이지로 리디렉션
 */
router.get('/kakao/callback', kakaoAuthController);

/**
 * @swagger
 * /api/auth/naver/callback:
 *   get:
 *     summary: 네이버 로그인 콜백
 *     tags: [Auth]
 *     parameters:
 *       - name: code
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *       - name: state
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       302:
 *         description: 로그인 성공, 리다이렉션
 *       400:
 *         description: 인증 실패, 로그인 페이지로 리디렉션
 */
router.get('/naver/callback', naverAuthController);

/**
 * @swagger
 * /api/auth/google/callback:
 *   get:
 *     summary: 구글 로그인 콜백
 *     tags: [Auth]
 *     parameters:
 *       - name: code
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       302:
 *         description: 로그인 성공, 리다이렉션
 *       400:
 *        description: 인증 실패, 로그인 페이지로 리디렉션
 *       500:
 *         description: 서버 오류
 */
router.get('/google/callback', googleAuthController);

/**
 * @swagger
 * /api/auth/kakao:
 *   get:
 *     summary: 카카오 로그인 리디렉션
 *     tags: [Auth]
 *     responses:
 *       302:
 *         description: 카카오 로그인 페이지로 리디렉션
 *       500:
 *         description: 서버 오류
 */
router.get('/kakao', kakaoRedirectController);

/**
 * @swagger
 * /api/auth/naver:
 *   get:
 *     summary: 네이버 로그인 리디렉션
 *     tags: [Auth]
 *     responses:
 *       302:
 *         description: 네이버 로그인 페이지로 리디렉션
 *       500:
 *         description: 서버 오류
 */
router.get('/naver', naverRedirectController);

/**
 * @swagger
 * /api/auth/google:
 *   get:
 *     summary: 구글 로그인 리디렉션
 *     tags: [Auth]
 *     responses:
 *       302:
 *         description: 구글 로그인 페이지로 리디렉션
 *       500:
 *         description: 서버 오류
 */
router.get('/google', googleRedirectController);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: 로그아웃
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: 로그아웃 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
router.post('/logout', logoutController);

/**
 * @swagger
 * /api/auth/change-password:
 *   patch:
 *     summary: 비밀번호 변경
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               oldPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
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
router.patch('/change-password', authByToken, changePasswordController);

/**
 * @swagger
 * /api/auth/request-password:
 *   post:
 *     summary: 비밀번호 재설정 요청
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
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
 *       429:
 *         description: 이메일 인증 요청 쿨타임이 지나지 않았습니다. 잠시 후 다시 시도해주세요.
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
 * /api/auth/reset-password:
 *   post:
 *     summary: 비밀번호 재설정
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       302:
 *         description: 비밀번호 재설정 완료, 리다이렉션
 *       400:
 *         description: 유효하지 않은 토큰 또는 비밀번호 불일치
 *       500:
 *         description: 서버 오류
 */
router.post('/reset-password', resetPasswordController);

/**
 * @swagger
 * /api/auth/link/kakao:
 *   post:
 *     summary: 카카오 계정 연동
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: number
 *               socialId:
 *                 type: string
 *     responses:
 *       200:
 *         description: 카카오 계정 연동 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
router.post('/link/kakao', authByToken, linkKakaoAccountController);

/**
 * @swagger
 * /api/auth/link/naver:
 *   post:
 *     summary: 네이버 계정 연동
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: number
 *               socialId:
 *                 type: string
 *     responses:
 *       200:
 *         description: 네이버 계정 연동 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
router.post('/link/naver', authByToken, linkNaverAccountController);

/**
 * @swagger
 * /api/auth/link/google:
 *   post:
 *     summary: 구글 계정 연동
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: number
 *               socialId:
 *                 type: string
 *     responses:
 *       200:
 *         description: 구글 계정 연동 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
router.post('/link/google', authByToken, linkGoogleAccountController);

/**
 * @swagger
 * /api/auth/verify-email:
 *   get:
 *     summary: 이메일 인증
 *     tags: [Auth]
 *     parameters:
 *       - name: token
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *        302:
 *          description: 이메일 인증 완료, 리다이렉션
 *        400:
 *          description: 유효하지 않은 토큰
 *        500:
 *          description: 서버 오류
 */
router.get('/verify-email', verifyEmailController);

/**
 * @swagger
 * /api/auth/change-username:
 *   patch:
 *     summary: 유저네임 변경
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               newUsername:
 *                 type: string
 *     responses:
 *       200:
 *         description: 유저네임 변경 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
router.patch('/change-username', changeUsernameController);

/**
 * @swagger
 * /api/auth/delete-account:
 *   delete:
 *     summary: 회원탈퇴
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 회원탈퇴 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       401:
 *         description: 인증 실패
 */
router.delete('/delete-account', authByToken, deleteAccountController);

/**
 * @swagger
 * /api/auth/user-info:
 *   get:
 *     summary: 유저 정보 가져오기
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 유저 정보 가져오기 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 email:
 *                   type: string
 *                 username:
 *                   type: string
 *                 role:
 *                   type: boolean
 *                 kakaoid:
 *                   type: string
 *                   nullable: true
 *                 naverid:
 *                   type: string
 *                   nullable: true
 *                 googleid:
 *                   type: string
 *                   nullable: true
 *                 profileimg:
 *                   type: string
 *       401:
 *         description: 인증 실패
 */
router.get('/user-info', authByToken, getUserInfoController);

export default router;
