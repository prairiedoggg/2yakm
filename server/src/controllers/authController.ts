import { Request, Response, NextFunction } from 'express';
const { loginService, signupService, refreshTokenService, kakaoLoginService } = require('../services/authService');
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
    const refreshToken = req.cookies.refreshToken;
    const newToken = await refreshTokenService(refreshToken);
    res.cookie('jwt', newToken, { httpOnly: true });
    res.status(200).json({ message: '토큰 갱신 성공', token: newToken });
  } catch (error) {
    next(error);
  }
};

// 카카오 로그인
exports.kakaoLoginController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { code } = req.query;
    const result = await kakaoLoginService(code);
    res.cookie('jwt', result.token, { httpOnly: true });
    res.cookie('refreshToken', result.refreshToken, { httpOnly: true });
    res.status(200).json({ message: '카카오 로그인 성공', token: result.token });
  } catch (error) {
    next(error)
  }
};