import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { createError } from '../utils/error';
import { pool } from '../db';
import nodemailer from 'nodemailer';
import axiosRequest from '../utils/axios';
import axios from 'axios';

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

interface user {
  id: string;
  email: string;
  username: string;
  password: string;
  kakaoid?: string;
  googleid?: string;
  naverid?: string;
  profileimg: string;
  lastpasswordresetrequest?: Date;
  lastemailverificationrequest?: Date;
}

interface userResponse {
  id: string;
  email: string;
  username: string;
  role: boolean;
  kakaoid?: number;
  naverid?: number;
  googleid?: number;
  profileimg: string;
}

interface decoded {
  id: string;
  email: string;
  role: boolean;
}

interface kakaoTokenResponse {
  access_token: string;
}

interface naverTokenResponse {
  access_token: string;
}

interface googleTokenResponse {
  access_token: string;
}

interface naverUserInfoResponse {
  response: {
    id: string;
    email: string;
    nickname: string;
  };
}

interface kakaoUserInfoResponse {
  id: string;
  kakao_account: {
    email: string | null;
    profile: {
      nickname: string;
    };
  };
  properties: {
    nickname: string;
  };
}

interface googleUserInfoResponse {
  id: string;
  email: string;
  name: string;
}

const SECRET_KEY = process.env.SECRET_KEY;
const REFRESH_TOKEN_SECRET_KEY = process.env.REFRESH_TOKEN_SECRET_KEY;
const BASE_URL = 
  process.env.NODE_ENV === 'development'
    ? `http://localhost:${process.env.PORT ?? 3000}`
    : process.env.CORS_ORIGIN;

const FRONTEND_URL = 
  process.env.NODE_ENV === 'development'
    ? `http://localhost:${process.env.FRONTEND_URL ?? 5173}`
    : process.env.CORS_ORIGIN;

if (!SECRET_KEY || !REFRESH_TOKEN_SECRET_KEY) {
  throw new Error('SECRET_KEY 또는 REFRESH_TOKEN_SECRET_KEY 확인바람.');
}

// 로그인
export const login = async (
  email: string,
  password: string
): Promise<{ token: string, refreshToken: string }> => {
  try {
    const query = 'SELECT userid, email, password, username, kakaoid, googleid, naverid FROM users WHERE email = $1';
    const values = [email];
    const result = await pool.query(query, values);
    const user = result.rows[0];

    if (!user) {
      throw createError('UserNotFound', '사용자를 찾을 수 없습니다.', 404);
    }
    if (user.kakaoid || user.googleid || user.naverid) {
      throw createError('SocialUser', '해당 이메일은 소셜 계정 가입자입니다.', 400);
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw createError('InvalidCredentials', '비밀번호가 틀렸습니다.', 401);
    }

    const payload = { id: user.userid, email: user.email, role: user.role };
    const token = jwt.sign(payload, SECRET_KEY, {
      expiresIn: '2h',
    });
    const refreshToken = jwt.sign(
      { id: user.userid },
      REFRESH_TOKEN_SECRET_KEY,
      { expiresIn: '7d' }
    );

    return { token, refreshToken };
  } catch (error: unknown) {
    console.error('Login Error:', error);
    throw createError('DBError', '데이터베이스 오류가 발생했습니다.', 500);
  }
};

// 이메일 인증 요청 인증 전
export const requestEmailVerification = async (email: string): Promise<void> => {
  const emailVerificationCoolTime = 5 * 60 * 1000; // 요청 5분 쿨타임
  try {
    const checkUserQuery = 'SELECT email, lastemailverificationrequest FROM users WHERE email = $1';
    const checkUserValues = [email];
    const existingUserResult = await pool.query(checkUserQuery, checkUserValues);
    const user = existingUserResult.rows[0];

    if (user) {
      const lastRequestTime = user.lastemailverificationrequest;
      if (lastRequestTime && new Date().getTime() - new Date(lastRequestTime).getTime() < emailVerificationCoolTime) {
        throw createError('TooManyRequests', '이메일 인증 요청 쿨타임이 지나지 않았습니다.', 429);
      }
    }

    if (existingUserResult.rows.length > 0) {
      throw createError('UserExists', '해당 이메일로 이미 사용자가 존재합니다.', 409);
    }

    const emailToken = jwt.sign({ email}, SECRET_KEY, { expiresIn: '5m' });
    const url = `${FRONTEND_URL}/api/auth/verify-email?token=${emailToken}`;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: '이메일 인증',
      text: `이메일 인증을 완료하려면 링크를 클릭하세요: ${url}`,
    };
    await transporter.sendMail(mailOptions);

    const updateUserQuery = 'UPDATE users SET lastemailverificationrequest = $1 WHERE email = $2';
    const updateUserValues = [new Date(), email];
    await pool.query(updateUserQuery, updateUserValues);

  } catch (error: unknown) {
    console.error('RequestEmailVerification Error:', error);
    if (error instanceof Error) {
      if (error.message === 'UserExists') {
        throw createError('UserExists', '해당 이메일로 이미 사용자가 존재합니다.', 409);
      }
      throw createError('DBError', error.message, 500);
    }
    throw createError('DBError', '데이터베이스 오류가 발생했습니다.', 500);
  }
};

// 회원가입
export const signupService = async (
  email: string,
  username: string,
  password: string,
  confirmPassword: string
): Promise<void> => {
  try {
    const checkUserQuery = 'SELECT isverified FROM users WHERE email = $1';
    const checkUserValues = [email];
    const existingUserResult = await pool.query(checkUserQuery, checkUserValues);

    if (existingUserResult.rows.length === 0) {
      throw createError('UserNotFound', '사용자를 찾을 수 없습니다.', 404);
    }

    const user = existingUserResult.rows[0];
    if (!user.isverified) {
      throw createError('EmailNotVerified', '이메일 인증이 완료되지 않았습니다.', 400);
    }

    if (password !== confirmPassword) {
      throw createError('PasswordMismatch', '비밀번호가 일치하지 않습니다.', 400);
    }

    if (username.length < 3 || username.length > 20) {
      throw createError('InvalidUsername', '이름은 3자 이상 20자 이하여야 합니다.', 400);
    }

    const passwordRegex = /^(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/;
    if (!passwordRegex.test(password)) {
      throw createError('InvalidPassword', '비밀번호는 특수문자를 포함한 8자리 이상이어야 합니다.',400)
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const updateUserQuery = 'UPDATE users SET username = $1, password = $2 WHERE email = $3';
    const updateUserValues = [username, hashedPassword, email];
    await pool.query(updateUserQuery, updateUserValues);
  } catch (error: unknown) {
    console.error('Signup Error:', error);
    if (error instanceof Error) {
      throw createError('DBError', error.message, 400);
    }
    throw createError('DBError', '데이터베이스 오류가 발생했습니다.', 500);
  }
};

// 이메일 인증 완료
export const verifyEmailService = async (token: string): Promise<void> => {
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    
    if (typeof decoded !== 'string' && decoded.email) {
      const email = decoded.email;

      const checkUserQuery = 'SELECT email, isVerified FROM users WHERE email = $1';
      const checkUserValues = [email];
      const existingUserResult = await pool.query(checkUserQuery, checkUserValues);

      if (existingUserResult.rows.length > 0) {
        const user = existingUserResult.rows[0];
        if (user.isVerified) {
          throw createError('AlreadyVerified', '이미 이메일 인증이 완료되었습니다.', 400);
        }
        // 존재하는 사용자의 이메일 인증 업데이트
        const updateUserQuery = `
          UPDATE users SET isVerified = $1 WHERE email = $2
        `;
        const updateUserValues = [true, email];
        await pool.query(updateUserQuery, updateUserValues);
      } else {
        const insertUserQuery = `
          INSERT INTO users (email, isVerified) VALUES ($1, $2)
        `;
        const insertUserValues = [email, true];
        await pool.query(insertUserQuery, insertUserValues);
      }
    } else {
      throw createError('InvalidToken', '유효하지 않은 토큰입니다.', 400);
    }
  } catch (error: unknown) {
    console.error('verifyEmailService Error:', error);
    if (error instanceof jwt.TokenExpiredError) {
      throw createError('TokenExpired', '토큰이 만료됨', 400);
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw createError('InvalidToken', '토큰이 유효하지 않음', 400);
    }
    throw createError('DBError', '데이터베이스 오류가 발생했습니다.', 500);
  }
};

// 토큰 갱신
export const refreshTokenService = async (
  refreshToken: string
): Promise<{ token: string; refreshToken: string }> => {
  if (!refreshToken) {
    throw createError('NoRefreshToken', '토큰이 없습니다.', 401);
  }

  let payload;
  try {
    payload = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET_KEY);

    if (typeof payload !== 'string' && 'id' in payload) {
      const query = 'SELECT email, role FROM users WHERE userid = $1';
      const values = [payload.id];
      const result = await pool.query(query, values);
      const user = result.rows[0];

      if (!user) {
        throw createError('UserNotFound', '사용자를 찾을 수 없습니다.', 404);
      }

      const newPayload = { id: payload.id, email: user.email, role: user.role };
      const newToken = jwt.sign(newPayload, SECRET_KEY, {
        expiresIn: '2h'
      });
      const newRefreshToken = jwt.sign(
        { id: payload.id },
        REFRESH_TOKEN_SECRET_KEY,
        { expiresIn: '7d' }
      );

      return { token: newToken, refreshToken: newRefreshToken };
    } else {
      throw createError('InvalidToken', '유효하지 않은 토큰입니다.', 400);
    }
  } catch (error: unknown) {
    console.error('refreshToken Error:', error);
    throw createError('InvalidRefreshToken', '유효하지 않은 토큰입니다.', 403);
  }
};

// 카카오 소셜
export const kakaoAuthService = async (
  code: string
): Promise<{ token?: string, refreshToken?: string, message?: string }> => {
  const redirectUri = `${BASE_URL}/api/auth/kakao/callback`;
  const kakaoTokenUrl = `https://kauth.kakao.com/oauth/token`;

  try {
    const tokenResponse = await axios.post<kakaoTokenResponse>(kakaoTokenUrl, null, {
      params: {
        grant_type: 'authorization_code',
        client_id: process.env.KAKAO_CLIENT_ID,
        redirect_uri: redirectUri,
        code,
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    const { access_token } = tokenResponse.data;

    const userInfoResponse = await axios.get<kakaoUserInfoResponse>('https://kapi.kakao.com/v2/user/me', {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    const { id, kakao_account, properties } = userInfoResponse.data;
    const email = kakao_account.email ?? null;
    const username =
      properties.nickname ?? kakao_account.profile.nickname ?? null;

    if (!email) {
      throw createError(
        'KakaoAuthError',
        '카카오에서 사용자 정보가 충분하지 않습니다.',
        400
      );
    }

    try {
      const checkEmailQuery = 'SELECT email, kakaoid FROM users WHERE email = $1';
      const checkEmailValues = [email];
      const existingEmailResult = await pool.query(checkEmailQuery, checkEmailValues);

      if (existingEmailResult.rows.length > 0) {
        const user = existingEmailResult.rows[0];
        if (!user.kakaoid) {
          return { message: '해당 이메일은 로컬 또는 소셜 가입자 입니다.' };
        }
      }

      const checkUserQuery = 'SELECT userid, email, username, kakaoid FROM users WHERE kakaoid = $1';
      const checkUserValues = [id];
      const existingUserResult = await pool.query(checkUserQuery, checkUserValues);

      let user;
      if (existingUserResult.rows.length > 0) {
        user = existingUserResult.rows[0];
      } else {
        const insertUserQuery = `
          INSERT INTO users (email, username, password, role, kakaoid, isVerified) VALUES ($1, $2, $3, $4, $5, $6)
          RETURNING userid, email, username
        `;
        const insertUserValues = [
          email,
          username,
          'kakao_auth_password',
          false,
          id,
          true,
        ];
        const newUserResult = await pool.query(insertUserQuery, insertUserValues);
        user = newUserResult.rows[0];
      }

      const payload = { id: user.userid, kakaoid: user.kakaoid, email: user.email, role: user.role };
      const token = jwt.sign(payload, SECRET_KEY, {
        expiresIn: '2h',
      });
      const refreshToken = jwt.sign(
        { id: user.id },
        REFRESH_TOKEN_SECRET_KEY,
        { expiresIn: '7d' }
      );

      return { token, refreshToken };
    } catch (error: unknown) {
      console.error('DB error:', error);
      throw createError('DBError', '데이터베이스 오류가 발생했습니다.', 500);
    }
  } catch (error: unknown) {
    console.error('kakao athentication error:', error );
    throw createError('KakaoAuthError', '카카오 인증 실패', 500);
  }
};

// 네이버 소셜
export const naverAuthService = async (
  code: string,
  state: string
): Promise<{ token?: string, refreshToken?: string, message?: string }> => {
  const redirectUri = `${BASE_URL}/api/auth/naver/callback`;
  const naverTokenUrl = `https://nid.naver.com/oauth2.0/token`;
  const naverUserInfoUrl = `https://openapi.naver.com/v1/nid/me`;

  try {
    const tokenResponse = await axios.post<naverTokenResponse>(naverTokenUrl, null, {
      params: {
        grant_type: 'authorization_code',
        client_id: process.env.NAVER_CLIENT_ID,
        client_secret: process.env.NAVER_CLIENT_SECRET,
        code,
        state,
        redirect_uri: redirectUri,
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    const { access_token } = tokenResponse.data;

    const userInfoResponse = await axios.get<naverUserInfoResponse>(naverUserInfoUrl, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    const { id, email, nickname } = userInfoResponse.data.response;

    if (!email) {
      return { message: '네이버에서 사용자 정보가 충분하지 않습니다.'};
    }

    try {
      const checkEmailQuery = 'SELECT email, naverid FROM users WHERE email = $1';
      const checkEmailValues = [email];
      const existingEmailResult = await pool.query(checkEmailQuery, checkEmailValues);

      if (existingEmailResult.rows.length > 0) {
        const user = existingEmailResult.rows[0];
        if (!user.naverid) {
          return { message: '해당 이메일은 로컬 또는 소셜 가입자 입니다.' };
        }
      }

      const checkUserQuery = 'SELECT userid, email, username, naverid FROM users WHERE naverid = $1';
      const checkUserValues = [id];
      const existingUserResult = await pool.query(checkUserQuery, checkUserValues);

      let user;
      if (existingUserResult.rows.length > 0) {
        user = existingUserResult.rows[0];
      } else {
        const insertUserQuery = `
          INSERT INTO users (email, username, password, role, naverid, isVerified) VALUES ($1, $2, $3, $4, $5, $6)
          RETURNING userid, email, username
        `;
        const insertUserValues = [
          email,
          nickname,
          'naver_auth_password',
          false,
          id,
          true,
        ];
        const newUserResult = await pool.query(insertUserQuery, insertUserValues);
        user = newUserResult.rows[0];
      }

      const payload = { id: user.userid, naverid: user.naverid, email: user.email, role: user.role };
      const token = jwt.sign(payload, SECRET_KEY, {
        expiresIn: '2h',
      });
      const refreshToken = jwt.sign(
        { id: user.userid },
        REFRESH_TOKEN_SECRET_KEY,
        { expiresIn: '7d' }
      );

      return { token, refreshToken };
    } catch (error: unknown) {
      console.error('DBError:', error);
      throw createError('DBError', '데이터베이스 오류가 발생했습니다.', 500);
    }
  } catch (error: unknown) {
    console.error('naver authentication error:', error);
    throw createError('NaverAuthError', '네이버 인증 실패', 500);
  }
};

// 구글 소셜
export const googleAuthService = async (
  code: string
): Promise<{ token?: string, refreshToken?: string, message?: string }> => {
  const tokenUrl = 'https://oauth2.googleapis.com/token';
  const userInfoUrl = 'https://www.googleapis.com/oauth2/v2/userinfo';

  try {
    const tokenResponse = await axios.post<googleTokenResponse>(tokenUrl, null, {
      params: {
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: `${BASE_URL}/api/auth/google/callback`,
        grant_type: 'authorization_code',
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    const { access_token } = tokenResponse.data;
    const userInfoResponse = await axios.get<googleUserInfoResponse>(userInfoUrl, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    const { id, email, name } = userInfoResponse.data;

    if (!email) {
      throw createError(
        'GoogleAuthError',
        '구글에서 사용자 정보가 충분하지 않습니다.',
        400
      );
    }

    try {
      const checkEmailQuery = 'SELECT email, googleid FROM users WHERE email = $1';
      const checkEmailValues = [email];
      const existingEmailResult = await pool.query(checkEmailQuery, checkEmailValues);

      if (existingEmailResult.rows.length > 0) {
        const user = existingEmailResult.rows[0];
        if (!user.googleid) {
          return { message: '해당 이메일은 로컬 또는 소셜 가입자 입니다.' };
        }
      }

      const checkUserQuery = 'SELECT userid, email, username, googleid FROM users WHERE googleid = $1';
      const checkUserValues = [id];
      const existingUserResult = await pool.query(checkUserQuery, checkUserValues);

      let user;
      if (existingUserResult.rows.length > 0) {
        user = existingUserResult.rows[0];
      } else {
        const insertUserQuery = `
          INSERT INTO users (email, username, password, role, googleid, isVerified) VALUES ($1, $2, $3, $4, $5, $6)
          RETURNING userid, email, username
        `;
        const insertUserValues = [
          email,
          name,
          'google_auth_password',
          false,
          id,
          true,
        ];
        const newUserResult = await pool.query(insertUserQuery, insertUserValues);
        user = newUserResult.rows[0];
      }

      const payload = { id: user.userid, googleid: user.googleid, email: user.email, role: user.role };
      const token = jwt.sign(payload, SECRET_KEY, {
        expiresIn: '2h',
      });
      const refreshToken = jwt.sign(
        { id: user.userid },
        REFRESH_TOKEN_SECRET_KEY,
        { expiresIn: '7d' }
      );

      return { token, refreshToken };
    } catch (error: unknown) {
      console.error('DBError:', error);
      throw createError('DBError', '데이터베이스 오류가 발생했습니다.', 500);
    }
  } catch (error: unknown) {
    console.error('google athentication error:', error);
    throw createError('GoogleAuthError', '구글 인증 실패', 500);
  }
};

// 비번 변경
export const changePasswordService = async (
  email: string,
  oldPassword: string,
  newPassword: string
): Promise<void> => {
  try {
    const query = 'SELECT password, kakaoid, naverid, googleid FROM users WHERE email = $1';
    const values = [email];
    const result = await pool.query(query, values);
    const user = result.rows[0];

    if (!user) {
      throw createError('UserNotFound', '사용자를 찾을 수 없습니다.', 404);
    }
    if (user.kakaoid ?? user.googleid ?? user.naverid) {
      throw createError(
        'SocialUserError',
        '소셜 로그인 사용자는 비밀번호를 변경할 수 없습니다.',
        400
      );
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);

    if (!isMatch) {
      throw createError(
        'InvalidCredentials',
        '기존 비밀번호가 틀렸습니다.',
        401
      );
    }
    
    const passwordRegex = /^(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      throw createError('InvalidPassword', '비밀번호는 특수문자를 포함한 8자리 이상이어야 합니다.',400)
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    const updateQuery = 'UPDATE users SET password = $1 WHERE email = $2';
    const updateValues = [hashedNewPassword, email];
    await pool.query(updateQuery, updateValues);
  } catch (error: unknown) {
    console.error('changePassword Error:', error);
    throw createError('DBError', '데이터베이스 오류가 발생했습니다.', 500);
  }
};

// 비번 재설정 요청
export const requestPasswordService = async (email: string): Promise<void> => {
  const passwordResetCoolTime = 5 * 60 * 1000;
  try {
    const query = 'SELECT userid, kakaoid, naverid, googleid, lastpasswordresetrequest FROM users WHERE email = $1';
    const values = [email];
    const result = await pool.query(query, values);
    const user = result.rows[0];

    if (!user) {
      throw createError('User Not Found', '사용자를 찾을 수 없습니다', 404);
    }
    if (user.kakaoid ?? user.goolgeid ?? user.naverid) {
      throw createError('Social User Error', '소셜 회원은 비밀번호를 재설정할 수 없습니다.', 400);
    }

    const lastRequestTime = user.lastpasswordresetrequest;

    if (lastRequestTime && new Date().getTime() - new Date(lastRequestTime).getTime() < passwordResetCoolTime) {
      throw createError('TooManyRequests', '비밀번호 재설정 요청 쿨타임이 지나지 않았습니다.', 429);
    }

    const token = jwt.sign(
      { id: user.userid, email: user.email },
      SECRET_KEY,
      { expiresIn: '5m' }
    );
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: '비밀번호 재설정',
      text: `비밀번호를 재설정하려면 링크를 클릭하세요 (유효시간: 3분): ${FRONTEND_URL}/reset-password?token=${token}`,
    };
    await transporter.sendMail(mailOptions);

    const updateUserQuery = 'UPDATE users SET lastPasswordResetRequest = $1 WHERE email = $2';
    const updateUserValues = [new Date(), email];
    await pool.query(updateUserQuery, updateUserValues);
  } catch (error: unknown) {
    console.error('requestPassword Error:', error);
    throw createError('DBError', '데이터베이스 오류가 발생했습니다.', 500);
  }
};

// 비번 재설정
export const resetPasswordService = async (
  token: string,
  newPassword: string
): Promise<void> => {
  try {
    const decoded = jwt.verify(token, SECRET_KEY);

    if (typeof decoded !== 'string' && 'id' in decoded) {
      try {
        const query = 'SELECT userid FROM users WHERE userid = $1';
        const values = [decoded.id];
        const result = await pool.query(query, values);

        if (result.rows.length === 0) {
          throw createError('UserNotFound', '사용자를 찾을 수 없습니다', 404);
        }

        const user = result.rows[0];

        const passwordRegex = /^(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/;
        if (!passwordRegex.test(newPassword)) {
          throw createError('InvalidPassword', '비밀번호는 특수문자를 포함한 8자리 이상이어야 합니다.', 400);
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        const updateQuery = 'UPDATE users SET password = $1 WHERE userid = $2';
        const updateValues = [hashedNewPassword, decoded.id];
        await pool.query(updateQuery, updateValues);
      } catch (error: unknown) {
        throw createError('DBError', '데이터베이스 오류가 발생했습니다.', 500);
      }
    } else {
      throw createError('InvalidToken', '유효하지 않은 토큰입니다.', 400);
    }
  } catch (error: unknown) {
    console.error('resetPassword Error:', error);
    if (error instanceof jwt.TokenExpiredError) {
      throw createError('TokenExpired', '토큰이 만료되었습니다.', 400);
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw createError('InvalidToken', '유효하지 않은 토큰입니다.', 400);
    }
    throw error;
  }
};

// 소셜 연동
export const linkSocialAccountService = async (userId: string, accessToken: string, provider: 'kakao' | 'google' | 'naver'): Promise<void> => {
  try {
    let socialId: string;
    if (provider === 'kakao') {
      const userInfoResponse = await axiosRequest<kakaoUserInfoResponse>({
        method: 'get',
        url: 'https://kapi.kakao.com/v2/user/me',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      socialId = userInfoResponse.id;
    } else if (provider === 'google') {
      const userInfoResponse = await axiosRequest<googleUserInfoResponse>({
        method: 'get',
        url: 'https://www.googleapis.com/oauth2/v2/userinfo',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      socialId = userInfoResponse.id;
    } else if (provider === 'naver') {
      const userInfoResponse = await axiosRequest<naverUserInfoResponse>({
        method: 'get',
        url: 'https://openapi.naver.com/v1/nid/me',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      socialId = userInfoResponse.response.id;
    } else {
      throw createError('InvalidProvider', '유효하지 않은 제공자입니다.', 400);
    }

    const query = 'SELECT kakaoid, naverid, googleid FROM users WHERE userid = $1';
    const values = [userId];
    const result = await pool.query(query, values);
    const user = result.rows[0];

    if (!user) {
      throw createError('UserNotFound', '사용자를 찾을 수 없습니다.', 404);
    }

    const defaultPassword = provider === 'kakao' ? 'kakao_auth_password' : provider === 'google' ? 'google_auth_password': 'naver_auth_password';

    if (provider === 'kakao') {
      const updateQuery = 'UPDATE users SET kakaoid = $1, password = $2 WHERE userid = $3';
      const updateValues = [socialId, defaultPassword, userId];
      await pool.query(updateQuery, updateValues);
    } else if (provider === 'google') {
      const updateQuery = 'UPDATE users SET googleid = $1, password = $2 WHERE userid = $3';
      const updateValues = [socialId, defaultPassword, userId];
      await pool.query(updateQuery, updateValues);
    } else if (provider === 'naver') {
      const updateQuery = 'UPDATE users SET naverid = $1, password = $2 WHERE userid = $3';
      const updateValues = [socialId, defaultPassword, userId];
      await pool.query(updateQuery, updateValues);
    }
  } catch (error: unknown) {
    console.error('Error in linkSocialAccountService:', error);
    throw createError('DBError', '데이터베이스 오류가 발생했습니다.', 500);
  }
};

// 유저네임 변경
export const changeUsernameService = async (email: string, newUsername: string): Promise<void> => {
  try {
    const query = 'UPDATE users SET username = $1 WHERE email = $2';
    const values = [newUsername, email];
    await pool.query(query, values);
  } catch (error: unknown) {
    console.error('changeUsername Error:', error);
    throw createError('DBError', '데이터베이스 오류가 발생했습니다.', 500);
  }
};

// 회원 탈퇴
export const deleteAccountService = async (userId: string): Promise<void> => {
  try {
    const query = 'SELECT userid FROM users WHERE userid = $1';
    const values = [userId];
    const result = await pool.query(query, values);
    const user = result.rows[0];

    if (result.rows.length === 0) {
      throw createError('User Not Found', '사용자를 찾을 수 없습니다.', 404);
    }

    // 소셜 연동 해제
    // if (user.kakaoid) {
    //   await unlinkKakaoAccount(user.kakaoid);
    // } else if (user.googleid) {
    //   await unlinkGoogleAccount(user.googleid);
    // } else if (user.naverid) {
    //   await unlinkNaverAccount(user.naverid)
    // }

    const deleteQuery = 'DELETE FROM users WHERE userid = $1';
    await pool.query(deleteQuery, values);
  } catch (error: unknown) {
    console.error('deleteAccount Error:', error);
    throw createError('DBError', '데이터베이스 오류 발생', 500);
  }
};

// 카카오 연동 해제
const unlinkKakaoAccount = async (kakaoId: string): Promise<void> => {
  try {
    const unlinkUrl = `https://kapi.kakao.com/v1/user/unlink`;
    await axiosRequest<void>({
      method: 'post',
      url: unlinkUrl,
      headers: {
        'Authorization': `Bearer ${kakaoId}`
      }
    });
  } catch (error: unknown) {
    console.error('unlink kakao Error:', error);
    throw createError('kakaoUnlinkError', '카카오 연동 해제 실패', 500);
  }
};

// 구글 계정 연동 해제
const unlinkGoogleAccount = async (googleId: string): Promise<void> => {
  try {
    const unlinkUrl = `https://accounts.google.com/o/oauth2/revoke?token=${googleId}`;
    await axiosRequest<void>({
      method: 'post',
      url: unlinkUrl
    });
  } catch (error: unknown) {
    console.error('unlink google Error:', error);
    throw createError('GoogleUnlinkError', '구글 계정 연동 해제 실패', 500);
  }
};

// 네이버 계정 연동 해제
const unlinkNaverAccount = async (naverId: string): Promise<void> => {
  try {
    const unlinkUrl = `https://nid.naver.com/oauth2.0/token?grant_type=delete&client_id=${process.env.NAVER_CLIENT_ID}&client_secret=${process.env.NAVER_CLIENT_SECRET}&access_token=${naverId}&service_provider=NAVER`;
    await axiosRequest({
      method: 'post',
      url: unlinkUrl
    });
  } catch (error: unknown) {
    console.error('unlink naver Error:', error);
    throw createError('NaverUnlinkError', '네이버 계정 연동 해제 실패', 500);
  }
};

// 유저 정보
export const getUserInfo = async (userId: string): Promise<userResponse> => {
  try {
    const query = 'SELECT userid, email, username, role, kakaoid, naverid, googleid, profileimg FROM users WHERE userid = $1';
    const values = [userId];
    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      throw createError('User Not Found', '사용자를 찾을 수 없습니다.', 404);
    }

    const user = result.rows[0];
    return { id: user.userid, email: user.email, username: user.username, role: user.role, kakaoid: user.kakaoid, naverid: user.naverid, googleid: user.googleid, profileimg: user.profileimg };
  } catch (error: unknown) {
    console.error('getUserInfo Error:', error);
    throw createError('DB Error', '데이터베이스 오류 발생', 500);
  }
};