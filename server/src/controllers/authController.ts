import { Request, Response, NextFunction } from 'express';
import { 
  login,
  signupService,
  refreshTokenService,
  kakaoAuthService,
  changePasswordService,
  requestPasswordService,
  resetPasswordService,
  googleAuthService,
  linkSocialAccountService,
  verifyEmailService,
  requestEmailVerification,
  changeUsernameService,
  deleteAccountService
} from '../services/authService';
import { createError } from '../utils/error';

// 로그인
export const loginController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const result = await login(email, password);
    res.cookie('jwt', result.token, { httpOnly: true });
    res.cookie('refreshToken', result.refreshToken, { httpOnly: true });
    res.status(200).json({ message: '로그인 성공', token: result.token, refreshToken: result.refreshToken, userName: result.userName, email: result.email });
  } catch (error) {
    next(error);
  }
};

// 이메일 인증 요청
export const requestEmailVerificationController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, username, password } = req.body;
    await requestEmailVerification(email, username, password);
    res.status(200).json({ message: '이메일 인증 링크가 전송되었습니다.' });
  } catch (error) {
    next(error);
  }
};

// 회원가입
export const signupController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, username, password, confirmPassword } = req.body;
    if (email == null ?? username == null ?? password == null ?? confirmPassword == null) {
      throw createError(
        'InvalidInput',
        '이메일, 유저네임, 비밀번호를 모두 입력해야 합니다.',
        400
      );
    }
    await signupService(email, username, password, confirmPassword);
    res.status(200).json({ message: '이메일 인증을 완료하세요.' });
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.message === 'EmailNotVerified') {
        res.status(400).json({ message: '이메일 인증이 완료되지 않았습니다.' });
      }
    } else {
      next(error);
    }
  }
};

// 이메일 인증
export const verifyEmailController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token } = req.query;
    await verifyEmailService(token as string);
    res.status(200).json({ message: '이메일 인증 완료되었습니다. 회원가입을 계속해주세요.' });
  } catch (error) {
    console.error('Error in verifyEmailController:', error);
    next(error);
  }
};

// 토큰 갱신
export const refreshTokenController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken } = req.body;
    const { token, refreshToken: newRefreshToken } = await refreshTokenService(refreshToken);
    res.status(200).json({ token, refreshToken: newRefreshToken });
  } catch (error) {
    next(error);
  }
};

// 카카오 인증 (로그인 및 회원가입)
export const kakaoAuthController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { code } = req.query;
    console.log({code});
    const result = await kakaoAuthService(code as string);
    if (result.message) {
      res.status(400).json({ message: result.message });
    } else {
      res.cookie('jwt', result.token, { httpOnly: true });
      res.cookie('refreshToken', result.refreshToken, { httpOnly: true });
      res.status(200).json({ message: '로그인 성공', token: result.token, refreshToken: result.refreshToken, userName: result.userName, email: result.email });
    }
  } catch (error) {
    next(error);
  }
};

// 구글 로그인
export const googleAuthController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { code } = req.query;
    const result = await googleAuthService(code as string);
    
    if (result.message) {
      res.status(400).json({ message: result.message });
    } else {
      res.cookie('jwt', result.token, { httpOnly: true });
      res.cookie('refreshToken', result.refreshToken, { httpOnly: true });
      res.status(200).json({ message: '구글 인증 성공', token: result.token, refreshToken: result.refreshToken, userName: result.userName, email: result.email });
    }
  } catch (error) {
    next(error);
  }
};

// 로그아웃
export const logoutController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.clearCookie('jwt');
    res.clearCookie('refreshToken');
    res.status(200).json({ message: '로그아웃 성공' });
  } catch (error) {
    next(error);
  }
};

// 비밀번호 변경
export const changePasswordController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, oldPassword, newPassword } = req.body;
    await changePasswordService(email, oldPassword, newPassword);
    res.status(200).json({ message: '비밀번호 변경 성공' });
  } catch (error) {
    next(error);
  }
};

// 비번 재설정 요청
export const requestPasswordController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body;
    await requestPasswordService(email);
    res
      .status(200)
      .json({ message: '비밀번호 재설정 이메일이 전송되었습니다.' });
  } catch (error) {
    next(error);
  }
};

// 비번 재설정
export const resetPasswordController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token, newPassword } = req.body;
    await resetPasswordService(token, newPassword);
    res.status(200).json({ message: '비밀번호가 재설정되었습니다.' });
  } catch (error) {
    next(error);
  }
};

// 카카오 연동
export const linkKakaoAccountController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId, socialId } = req.body;
    console.log('linkKakaoAccountController:', { userId, socialId });
    await linkSocialAccountService(userId, socialId, 'kakao');
    res.status(200).json({ message: '카카오 계정 연동 성공' });
  } catch (error) {
    next(error);
  }
};

// 구글 연동
export const linkGoogleAccountController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId, socialId } = req.body;
    console.log('Google',{ userId, socialId });
    await linkSocialAccountService(userId, socialId, 'google');
    res.status(200).json({ message: '구글 계정 연동 성공' });
  } catch (error) {
    next(error);
  }
};

// 유저네임 변경
export const changeUsernameController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, newUsername} = req.body;
    await changeUsernameService(email, newUsername);
    res.status(200).json({ message: '유저네임 변경 완료' });
  } catch (error) {
    next(error);
  }
};

// 회원탈퇴
export const deleteAccountController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.body;
    await deleteAccountService(userId);
    res.status(200).json({ message: '회원탈퇴 완료' });
  } catch (error) {
    next(error);
  }
};