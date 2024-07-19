import { Request, Response, NextFunction } from 'express';
const { loginService, signupService, refreshTokenService, kakaoAuthService, changePasswordService, requestPasswordService, resetPasswordService, googleAuthService } = require('../services/authService');
const { createError } = require('../utils/error');

// 로그인
exports.loginController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const result = await loginService(email, password);
    res.cookie('jwt', result.token, { httpOnly: true });
    res.cookie('refreshToken', result.refreshToken, { httpOnly: true });
    res.status(200).json({ message: '로그인 성공', token: result.token });
  } catch (error) {
    next(error);
  }
};

// 회원가입
exports.signupController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, username, password, confirmPassword } = req.body;
    if (!email || !username || !password || !confirmPassword) {
      throw createError('InvalidInput', '이메일, 유저네임, 비밀번호를 모두 입력해야 합니다.', 400);
    }
    const newUser = await signupService(email, username, password, confirmPassword);
    res.status(201).json({ message: '회원가입 성공', user: newUser });
  } catch (error) {
    next(error);
  }
};

// 토큰 갱신
exports.refreshTokenController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken } = req.body;
    const { token, refreshToken: newRefreshToken } = await refreshTokenService(refreshToken);
    res.status(200).json({ token, refreshToken: newRefreshToken });
  } catch (error) {
    next(error);
  }
};

// 카카오 인증 (로그인 및 회원가입)
exports.kakaoAuthController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { code } = req.query;
    console.log({ code });
    const result = await kakaoAuthService(code);
    res.cookie('jwt', result.token, { httpOnly: true });
    res.cookie('refreshToken', result.refreshToken, { httpOnly: true });
    res.status(200).json({ message: '카카오 인증 성공', token: result.token });
  } catch (error) {
    next(error);
  }
};

// 구글 로그인
exports.googleAuthController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { code } = req.query;
    const result = await googleAuthService(code as string);
    res.cookie('jwt', result.token, { httpOnly: true });
    res.cookie('refreshToken', result.refreshToken, { httpOnly: true });
    res.status(200).json({ message: '구글 인증 성공', token: result.token });
  } catch (error) {
    next(error);
  }
};

// 로그아웃
exports.logoutController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.clearCookie('jwt');
    res.clearCookie('refreshToken');
    res.status(200).json({ message: '로그아웃 성공' });
  } catch (error) {
    next(error);
  }
};

// 비밀번호 변경
exports.changePasswordController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, oldPassword, newPassword } = req.body;
    await changePasswordService(email, oldPassword, newPassword);
    res.status(200).json({ message: '비밀번호 변경 성공'});
  } catch (error) {
    next(error);
  }
};

// 비번 재설정 요청
exports.requestPasswordController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body;
    await requestPasswordService(email);
    res.status(200).json({ message: '비밀번호 재설정 이메일이 전송되었습니다.' });
  } catch (error) {
    next(error);
  }
};

// 비번 재설정
exports.resetPasswordController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token, newPassword } = req.body;
    await resetPasswordService(token, newPassword);
    res.status(200).json({ message: '비밀번호가 재설정되었습니다.' });
  } catch (error) {
    next(error);
  }
};