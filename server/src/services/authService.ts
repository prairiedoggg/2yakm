import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { createError } from '../utils/error';
import { pool } from '../db';
import dotenv from 'dotenv';
import axios from 'axios';
import nodemailer from 'nodemailer';

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

interface User {
  id: number;
  email: string;
  username: string;
  password: string;
  kakaoid?: string;
  googleid?: string;
}

interface UserResponse {
  email: string;
  username: string;
}

const SECRET_KEY = process.env.SECRET_KEY;
const REFRESH_TOKEN_SECRET_KEY = process.env.REFRESH_TOKEN_SECRET_KEY;

if (!SECRET_KEY || !REFRESH_TOKEN_SECRET_KEY) {
  throw new Error('SECRET_KEY 또는 REFRESH_TOKEN_SECRET_KEY 확인바람.');
}

// 로그인
export const login = async (
  email: string,
  password: string
): Promise<{ token: string, refreshToken: string, userName: string, email: string }> => {
  try {
    const query = 'SELECT * FROM users WHERE email = $1';
    const values = [email];
    const result = await pool.query(query, values);
    const user = result.rows[0];

    if (!user) {
      throw createError('UserNotFound', '사용자를 찾을 수 없습니다.', 404);
    }
    if (user.kakaoid ?? user.googleid) {
      throw createError('SocialUser', '해당 이메일은 소셜 계정 가입자입니다.', 400);
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw createError('InvalidCredentials', '비밀번호가 틀렸습니다.', 401);
    }

    const payload = { id: user.userid, email: user.email };
    const token = jwt.sign(payload, SECRET_KEY, {
      expiresIn: '30m',
    });
    const refreshToken = jwt.sign(
      { id: user.userid },
      REFRESH_TOKEN_SECRET_KEY,
      { expiresIn: '7d' }
    );

    return { token, refreshToken, userName: user.username, email: user.email };
  } catch (error) {
    throw createError('DBError', '데이터베이스 오류가 발생했습니다.', 500);
  }
};

// 이메일 인증 요청 인증 전
export const requestEmailVerification = async (email: string, username: string, password: string): Promise<void> => {
  try {
    const checkUserQuery = 'SELECT * FROM users WHERE email = $1';
    const checkUserValues = [email];
    const existingUserResult = await pool.query(checkUserQuery, checkUserValues);

    if (existingUserResult.rows.length > 0) {
      throw createError('UserExists', '해당 이메일로 이미 사용자가 존재합니다.', 409);
    }

    const emailToken = jwt.sign({ email, username, password }, SECRET_KEY, { expiresIn: '5m' });
    const url = `http://localhost:3000/api/auth/verify-email?token=${emailToken}`;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: '이메일 인증',
      text: `이메일 인증을 완료하려면 링크를 클릭하세요: ${url}`,
    };
    await transporter.sendMail(mailOptions);
  } catch (error) {
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
    const checkUserQuery = 'SELECT * FROM users WHERE email = $1';
    const checkUserValues = [email];
    const existingUserResult = await pool.query(checkUserQuery, checkUserValues);

    if (existingUserResult.rows.length > 0) {
      const user = existingUserResult.rows[0];
      if (!user.isVerified) {
        throw createError('EmailNotVerified', '이메일 인증이 완료되지 않았습니다.', 400);
      }
      throw createError('UserExists', '해당 이메일로 이미 사용자가 존재합니다.', 409);
    }

    if (password !== confirmPassword) {
      throw createError('PasswordMismatch', '비밀번호가 일치하지 않습니다.', 400);
    }

    await requestEmailVerification(email, username, password);
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw createError('DBError', error.message, 400);
    }
    throw createError('DBError', '데이터베이스 오류가 발생했습니다.', 500);
  }
};

// 이메일 인증 완료
export const verifyEmailService = async (token: string): Promise<void> => {
  try {
    const decoded: any = jwt.verify(token, SECRET_KEY);

    const checkUserQuery = 'SELECT * FROM users WHERE email = $1';
    const checkUserValues = [decoded.email];
    const existingUserResult = await pool.query(checkUserQuery, checkUserValues);

    if (existingUserResult.rows.length > 0) {
      const user = existingUserResult.rows[0];
      if (user.isVerified) {
        throw createError('AlreadyVerified', '이미 이메일 인증이 완료되었습니다.', 400);
      }
    }

    const hashedPassword = await bcrypt.hash(decoded.password, 10);

    const insertUserQuery = `
      INSERT INTO users (email, username, password, role, isVerified) VALUES ($1, $2, $3, $4, $5)
      RETURNING email
    `;
    const insertUserValues = [decoded.email, decoded.username, hashedPassword, false, true];
    const result = await pool.query(insertUserQuery, insertUserValues);
  } catch (error) {
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
  } catch (error) {
    throw createError('InvalidRefreshToken', '유효하지 않은 토큰입니다.', 403);
  }

  const newToken = jwt.sign(
    { id: (payload as any).id, email: (payload as any).email },
    SECRET_KEY,
    { expiresIn: '30m' }
  );
  const newRefreshToken = jwt.sign(
    { id: (payload as any).id },
    REFRESH_TOKEN_SECRET_KEY,
    { expiresIn: '7d' }
  );

  return { token: newToken, refreshToken: newRefreshToken };
};

// 카카오 소셜
export const kakaoAuthService = async (
  code: string
): Promise<{ token?: string, refreshToken?: string, message?: string, userName?:string, email?: string }> => {
  const redirectUri = 'http://localhost:5173/kakao/callback';
  const kakaoTokenUrl = `https://kauth.kakao.com/oauth/token`;

  try {
    const tokenResponse = await axios.post(kakaoTokenUrl, null, {
      params: {
        grant_type: 'authorization_code',
        client_id: process.env.VITE_APP_KAKAO_CLIENT_ID,
        redirect_uri: redirectUri,
        code,
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    const { access_token } = tokenResponse.data;
    console.log({ access_token });
    const userInfoResponse = await axios.get(
      'https://kapi.kakao.com/v2/user/me',
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
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
      const checkEmailQuery = 'SELECT * FROM users WHERE email = $1';
      const checkEmailValues = [email];
      const existingEmailResult = await pool.query(checkEmailQuery, checkEmailValues);

      if (existingEmailResult.rows.length > 0) {
        const user = existingEmailResult.rows[0];
        if (!user.kakaoid) {
          return { message: '해당 이메일은 이미 로컬 계정으로 존재합니다. 소셜 계정을 연동해주세요.' };
        }
      }

      const checkUserQuery = 'SELECT * FROM users WHERE kakaoid = $1';
      const checkUserValues = [id];
      const existingUserResult = await pool.query(checkUserQuery, checkUserValues);

      let user;
      if (existingUserResult.rows.length > 0) {
        user = existingUserResult.rows[0];
      } else {
        const insertUserQuery = `
          INSERT INTO users (email, username, password, role, kakaoid) VALUES ($1, $2, $3, $4, $5)
          RETURNING *
        `;
        const insertUserValues = [
          email,
          username,
          'kakao_auth_password',
          false,
          id,
        ];
        const newUserResult = await pool.query(insertUserQuery, insertUserValues);
        user = newUserResult.rows[0];
      }

      const payload = { id: user.userid, email: user.email, kakoid: user.kakoid };
      const token = jwt.sign(payload, SECRET_KEY, {
        expiresIn: '30m',
      });
      const refreshToken = jwt.sign(
        { id: user.id },
        REFRESH_TOKEN_SECRET_KEY,
        { expiresIn: '7d' }
      );

      return { token, refreshToken, userName: user.name, email: user.email };
    } catch (error) {
      throw createError('DBError', '데이터베이스 오류가 발생했습니다.', 500);
    }
  } catch (error) {
    throw createError('KakaoAuthError', '카카오 인증 실패', 500);
  }
};

// 네이버 소셜
export const naverAuthService = async (
  code: string,
  state: string
): Promise<{ token?: string, refreshToken?: string, message?: string, userName?: string, email?: string }> => {
  const redirectUri = 'http://localhost:5173/naver/callback';
  const naverTokenUrl = `https://nid.naver.com/oauth2.0/token`;
  const naverUserInfoUrl = `https://openapi.naver.com/v1/nid/me`;

  try {
    const tokenResponse = await axios.post(naverTokenUrl, null, {
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
    const userInfoResponse = await axios.get(naverUserInfoUrl, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    const { id, email, nickname } = userInfoResponse.data.response;

    if (!email) {
      throw createError(
        'NaverAuthError',
        '네이버에서 사용자 정보가 충분하지 않습니다.',
        400
      );
    }

    try {
      const checkEmailQuery = 'SELECT * FROM users WHERE email = $1';
      const checkEmailValues = [email];
      const existingEmailResult = await pool.query(checkEmailQuery, checkEmailValues);

      if (existingEmailResult.rows.length > 0) {
        const user = existingEmailResult.rows[0];
        if (!user.naverid) {
          return { message: '해당 이메일은 이미 로컬 계정으로 존재합니다. 소셜 계정을 연동해주세요.' };
        }
      }

      const checkUserQuery = 'SELECT * FROM users WHERE naverid = $1';
      const checkUserValues = [id];
      const existingUserResult = await pool.query(checkUserQuery, checkUserValues);

      let user;
      if (existingUserResult.rows.length > 0) {
        user = existingUserResult.rows[0];
      } else {
        const insertUserQuery = `
          INSERT INTO users (email, username, password, role, naverid) VALUES ($1, $2, $3, $4, $5)
          RETURNING *
        `;
        const insertUserValues = [
          email,
          nickname,
          'naver_auth_password',
          false,
          id,
        ];
        const newUserResult = await pool.query(insertUserQuery, insertUserValues);
        user = newUserResult.rows[0];
      }

      const payload = { id: user.userid, email: user.email, naverid: user.naverid };
      const token = jwt.sign(payload, SECRET_KEY, {
        expiresIn: '30m',
      });
      const refreshToken = jwt.sign(
        { id: user.userid },
        REFRESH_TOKEN_SECRET_KEY,
        { expiresIn: '7d' }
      );

      return { token, refreshToken, userName: user.username, email: user.email };
    } catch (error) {
      throw createError('DBError', '데이터베이스 오류가 발생했습니다.', 500);
    }
  } catch (error) {
    throw createError('NaverAuthError', '네이버 인증 실패', 500);
  }
};

// 구글 소셜
export const googleAuthService = async (
  code: string
): Promise<{ token?: string, refreshToken?: string, message?: string, userName?:string, email?: string }> => {
  const tokenUrl = 'https://oauth2.googleapis.com/token';
  const userInfoUrl = 'https://www.googleapis.com/oauth2/v2/userinfo';

  try {
    const tokenResponse = await axios.post(tokenUrl, null, {
      params: {
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: 'http://localhost:5173/google/callback',
        grant_type: 'authorization_code',
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    const { access_token } = tokenResponse.data;
    const userInfoResponse = await axios.get(userInfoUrl, {
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
      const checkEmailQuery = 'SELECT * FROM users WHERE email = $1';
      const checkEmailValues = [email];
      const existingEmailResult = await pool.query(checkEmailQuery, checkEmailValues);

      if (existingEmailResult.rows.length > 0) {
        const user = existingEmailResult.rows[0];
        if (!user.googleid) {
          return { message: '해당 이메일은 이미 로컬 계정으로 존재합니다. 소셜 계정을 연동해주세요.' };
        }
      }

      const checkUserQuery = 'SELECT * FROM users WHERE googleid = $1';
      const checkUserValues = [id];
      const existingUserResult = await pool.query(checkUserQuery, checkUserValues);

      let user;
      if (existingUserResult.rows.length > 0) {
        user = existingUserResult.rows[0];
      } else {
        const insertUserQuery = `
          INSERT INTO users (email, username, password, role, googleid) VALUES ($1, $2, $3, $4, $5)
          RETURNING *
        `;
        const insertUserValues = [
          email,
          name,
          'google_auth_password',
          false,
          id,
        ];
        const newUserResult = await pool.query(insertUserQuery, insertUserValues);
        user = newUserResult.rows[0];
      }

      const payload = { id: user.userid, email: user.email, googleid: user.googleid };
      const token = jwt.sign(payload, SECRET_KEY, {
        expiresIn: '30m',
      });
      const refreshToken = jwt.sign(
        { id: user.userid },
        REFRESH_TOKEN_SECRET_KEY,
        { expiresIn: '7d' }
      );

      return { token, refreshToken, userName: user.name, email: user.email };
    } catch (error) {
      throw createError('DBError', '데이터베이스 오류가 발생했습니다.', 500);
    }
  } catch (error) {
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
    const query = 'SELECT * FROM users WHERE email = $1';
    const values = [email];
    const result = await pool.query(query, values);
    const user = result.rows[0];

    if (!user) {
      throw createError('UserNotFound', '사용자를 찾을 수 없습니다.', 404);
    }
    if (user.kakaoid ?? user.googleid) {
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

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    const updateQuery = 'UPDATE users SET password = $1 WHERE email = $2';
    const updateValues = [hashedNewPassword, email];
    await pool.query(updateQuery, updateValues);
  } catch (error) {
    throw createError('DBError', '데이터베이스 오류가 발생했습니다.', 500);
  }
};

// 비번 재설정 요청
export const requestPasswordService = async (email: string): Promise<void> => {
  try {
    const query = 'SELECT * FROM users WHERE email = $1';
    const values = [email];
    const result = await pool.query(query, values);
    const user = result.rows[0];

    if (!user) {
      throw createError('User Not Found', '사용자를 찾을 수 없습니다', 404);
    }
    if (user.kakaoid ?? user.goolgeid) {
      throw createError('Social User Error', '소셜 회원은 비밀번호를 재설정할 수 없습니다.', 400);
    }

    const token = jwt.sign(
      { id: user.userid, email: user.email },
      SECRET_KEY,
      { expiresIn: '3m' }
    );
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: '비밀번호 재설정',
      text: `비밀번호를 재설정하려면 링크를 클릭하세요 (유효시간: 3분): http://localhost:3000/reset-password?token=${token}`,
    };
    await transporter.sendMail(mailOptions);
  } catch (error) {
    throw createError('DBError', '데이터베이스 오류가 발생했습니다.', 500);
  }
};

// 비번 재설정
export const resetPasswordService = async (
  token: string,
  newPassword: string
): Promise<void> => {
  try {
    const decoded: any = jwt.verify(token, SECRET_KEY);
    try {
      const query = 'SELECT * FROM users WHERE userid = $1';
      const values = [decoded.id];
      const result = await pool.query(query, values);

      if (result.rows.length === 0) {
        throw createError('UserNotFound', '사용자를 찾을 수 없습니다', 404);
      }

      const user = result.rows[0];

      const hashedNewPassword = await bcrypt.hash(newPassword, 10);

      const updateQuery = 'UPDATE users SET password = $1 WHERE userid = $2';
      const updateValues = [hashedNewPassword, decoded.id];
      await pool.query(updateQuery, updateValues);
    } catch (error) {
      throw createError('DBError', '데이터베이스 오류가 발생했습니다.', 500);
    }
  } catch (error) {
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
export const linkSocialAccountService = async (userId: number, socialId: string, provider: 'kakao' | 'google'): Promise<void> => {
  try {
    const query = 'SELECT * FROM users WHERE userid = $1';
    const values = [userId];
    const result = await pool.query(query, values);
    const user = result.rows[0];

    if (!user) {
      throw createError('UserNotFound', '사용자를 찾을 수 없습니다.', 404);
    }

    const defaultPassword = provider === 'kakao' ? 'kakao_auth_password' : 'google_auth_password';

    if (provider === 'kakao') {
      if (user.kakaoid) {
        throw createError('AlreadyLinked', '이미 카카오 계정과 연동되어 있습니다.', 400);
      }

      const updateQuery = 'UPDATE users SET kakaoid = $1, password = $2 WHERE userid = $3';
      const updateValues = [socialId, defaultPassword, userId];
      await pool.query(updateQuery, updateValues);
    } else if (provider === 'google') {
      if (user.googleid) {
        throw createError('AlreadyLinked', '이미 구글 계정과 연동되어 있습니다.', 400);
      }

      const updateQuery = 'UPDATE users SET googleid = $1, password = $2 WHERE userid = $3';
      const updateValues = [socialId, defaultPassword, userId];
      await pool.query(updateQuery, updateValues);
    }
  } catch (error) {
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
  } catch (error) {
    throw createError('DBError', '데이터베이스 오류가 발생했습니다.', 500);
  }
};

// 회원 탈퇴
export const deleteAccountService = async (userId: string): Promise<void> => {
  try {
    const query = 'SELECT * FROM users WHERE userid = $1';
    const values = [userId];
    const result = await pool.query(query, values);
    const user = result.rows[0];

    if (!user) {
      throw createError('User Not Found', '사용자를 찾을 수 없습니다.', 404);
    }

    // 소셜 연동 해제
    if (user.kakaoid) {
      await unlinkKakaoAccount(user.kakaoid);
    } else if (user.googleid) {
      await unlinkGoogleAccount(user.googleid);
    }

    const deleteQuery = 'DELETE FROM users WHERE userid = $1';
    await pool.query(deleteQuery, values);
  } catch (error) {
    throw createError('DBError', '데이터베이스 오류 발생', 500);
  }
};

// 카카오 연동 해제
const unlinkKakaoAccount = async (kakaoId: string): Promise<void> => {
  try {
    const unlinkUrl = `https://kapi.kakao.com/v1/user/unlink`;
    await axios.post(unlinkUrl, null, {
      headers: {
        'Authorization': `Bearer ${kakaoId}`
      }
    });
  } catch (error) {
    throw createError('kakaoUnlinkError', '카카오 연동 해제 실패', 500);
  }
};

// 구글 계정 연동 해제
const unlinkGoogleAccount = async (googleId: string): Promise<void> => {
  try {
    const unlinkUrl = `https://accounts.google.com/o/oauth2/revoke?token=${googleId}`;
    await axios.post(unlinkUrl, null);
  } catch (error) {
    throw createError('GoogleUnlinkError', '구글 계정 연동 해제 실패', 500);
  }
};