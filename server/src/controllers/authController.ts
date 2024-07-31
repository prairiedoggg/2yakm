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
  naverAuthService,
  linkSocialAccountService,
  verifyEmailService,
  requestEmailVerification,
  changeUsernameService,
  deleteAccountService,
  getUserInfo
} from '../services/authService';
import { createError } from '../utils/error';
import { CustomRequest } from '../types/express';

// 로그인
export const loginController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const result = await login(email, password);
    res.cookie('jwt', result.token, { httpOnly: true });
    res.cookie('refreshToken', result.refreshToken, { httpOnly: true });
    res.cookie('userId', result.userId, { httpOnly: true }); 
    res.status(200).json({ message: '로그인 성공' });
  } catch (error) {
    next(error);
  }
};

// 이메일 인증 요청
export const requestEmailVerificationController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body;
    if (!email) {
      throw createError('InvalidInput', '이메일을 입력해야 합니다.', 400);
    }
    await requestEmailVerification(email);
    res.status(200).json({ message: '이메일 인증 링크가 전송되었습니다.' });
  } catch (error) {
    next(error)
  }
};

// 회원가입
export const signupController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, username, password, confirmPassword } = req.body;
    if (!email || !username || !password || !confirmPassword) {
      throw createError(
        'InvalidInput',
        '이메일, 유저네임, 비밀번호를 모두 입력해야 합니다.',
        400
      );
    }
    await signupService(email, username, password, confirmPassword);
    res.status(200).json({ message: '회원가입이 완료되었습니다' });
  } catch (error) {
    next(error)
  }
};

// 이메일 인증
export const verifyEmailController = async (req: Request<{ query: { token: string } }>, res: Response, next: NextFunction) => {
  try {
    const { token } = req.query;
    if (!token || typeof token !== 'string') {
      throw createError('Invalid Token', '유효하지 않은 토큰입니다.', 400);
    }
    await verifyEmailService(token);
    res.status(200).json({ message: '이메일 인증 완료되었습니다. 회원가입을 계속해주세요.' });
  } catch (error) {
    next(error);
  }
};

// 토큰 갱신
export const refreshTokenController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      throw createError('No RefreshToken', '리프레시 토큰이 없습니다.', 401);
    }
    const { token, refreshToken: newRefreshToken } = await refreshTokenService(refreshToken);
    res.cookie('jwt', token, { httpOnly: true });
    res.cookie('refreshToken', newRefreshToken, { httpOnly: true });
    res.status(200).json({ message: '토큰 갱신 성공' });
  } catch (error) {
    next(error);
  }
};

// 카카오 인증 (로그인 및 회원가입)
export const kakaoAuthController = async (req: Request<{ query: { code: string } }>, res: Response, next: NextFunction) => {
  try {
    const { code } = req.query;
    if (!code || typeof code !== 'string') {
      throw createError('Invalid Code', '유효하지 않은 코드입니다.', 400);
    }
    const result = await kakaoAuthService(code);
    if (result.message) {
      res.status(400).json({ message: result.message });
    } else {
      res.cookie('jwt', result.token, { httpOnly: true });
      res.cookie('refreshToken', result.refreshToken, { httpOnly: true });
      res.cookie('userId', result.userId, { httpOnly: true });
      res.status(200).json({ message: '로그인 성공' });
    }
  } catch (error) {
    next(error);
  }
};

// 네이버 로그인
export const naverAuthController = async (req: Request<{ query: { code: string, state: string } }>, res: Response, next: NextFunction) => {
  try {
    const { code, state } = req.query;
    if (!code || typeof code !== 'string' || !state || typeof state !== 'string') {
      throw createError('Invalid Code or State', '유효하지 않은 코드 또는 상태입니다.', 400);
    }
    const result = await naverAuthService(code, state);
    
    if (result.message) {
      res.status(400).json({ message: result.message });
    } else {
      res.cookie('jwt', result.token, { httpOnly: true });
      res.cookie('refreshToken', result.refreshToken, { httpOnly: true });
      res.cookie('userId', result.userId, { httpOnly: true });
      res.status(200).json({ message: '네이버 인증 성공' });
    }
  } catch (error) {
    next(error);
  }
};


// 구글 로그인
export const googleAuthController = async (req: Request<{ query: { code: string } }>, res: Response, next: NextFunction) => {
  try {
    const { code } = req.query;
    if (!code || typeof code !== 'string') {
      throw createError('Invalid Code', '유효하지 않은 코드입니다.', 400);
    }
    const result = await googleAuthService(code);
    
    if (result.message) {
      res.status(400).json({ message: result.message });
    } else {
      res.cookie('jwt', result.token, { httpOnly: true });
      res.cookie('refreshToken', result.refreshToken, { httpOnly: true });
      res.cookie('userId', result.userId, { httpOnly: true });
      res.status(200).json({ message: '구글 인증 성공' });
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
export const deleteAccountController = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw createError('Unauthorized', '사용자 인증이 필요합니다.', 401);
    }
    await deleteAccountService(userId);
    res.status(200).json({ message: '회원탈퇴 완료' });
  } catch (error) {
    next(error);
  }
};

// 유저 정보
export const getUserInfoController = async (req: CustomRequest, res: Response, next: NextFunction ) => {
  try {
    const userId = req.cookies.userId;
    if (!userId) {
      throw createError('Unauthorized', '사용자 인증이 필요합니다.', 401);
    }
    const userInfo = await getUserInfo(userId);
    res.status(200).json(userInfo);
  } catch (error) {
    next(error);
  }
};