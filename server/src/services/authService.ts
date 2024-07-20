const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { createError } = require('../utils/error');
const { pool } = require('../db');
const dotenv = require('dotenv');
const axios = require('axios');
const nodemailer = require('nodemailer');

dotenv.config();

// 이메일 전송 설정
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// User 인터페이스
interface User {
  id: number;
  email: string;
  username: string;
  password: string;
  kakaoid?: string;
}

// User 응답 (password 필드 없음)
interface UserResponse {
  email: string;
  username: string;
}

// 로그인
exports.loginService = async (
  email: string,
  password: string
): Promise<{ token: string; refreshToken: string }> => {
  const client = await pool.connect();
  try {
    const query = 'SELECT * FROM users WHERE email = $1';
    const values = [email];
    const result = await client.query(query, values);
    const user = result.rows[0];

    if (!user) {
      throw createError('UserNotFound', '사용자를 찾을 수 없습니다.', 404);
    }
    if (user.kakaid || user.googleid) {
      throw createError('SocialUser', '해당 이메일은 소셜 계정 가입자입니다.', 400);
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw createError('InvalidCredentials', '비밀번호가 틀렸습니다.', 401);
    }

    const payload = { id: user.userid, email: user.email };
    const token = jwt.sign(payload, process.env.SECRET_KEY, {
      expiresIn: '30m'
    });
    const refreshToken = jwt.sign(
      { id: user.userid },
      process.env.REFRESH_TOKEN_SECRET_KEY,
      { expiresIn: '7d' }
    );

    return { token, refreshToken };
  } catch (error) {
    throw error;
  } finally {
    client.release();
  }
};

// 회원가입
exports.signupService = async (
  email: string,
  username: string,
  password: string,
  confirmPassword: string
): Promise<void> => {
  const client = await pool.connect();
  try {
    const checkUserQuery = 'SELECT * FROM users WHERE email = $1';
    const checkUserValues = [email];
    const existingUserResult = await client.query(checkUserQuery, checkUserValues);

    if (existingUserResult.rows.length > 0) {
      const user = existingUserResult.rows[0];
      if (user.kakaoid || user.googleid) {
        throw createError('Social', '해당 이메일은 소셜 계정 가입자입니다. 소셜 로그인을 사용하세요.', 400);
      }
      throw createError('UserExists', '해당 이메일로 이미 사용자가 존재합니다.', 409);
    }

    if (password !== confirmPassword) {
      throw createError('PasswordMismatch', '비밀번호가 일치하지 않습니다.', 400);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const insertUserQuery = `
      INSERT INTO users (email, username, password, role, isVerified) VALUES ($1, $2, $3, $4, $5)
      RETURNING email
    `;
    const insertUserValues = [email, username, hashedPassword, false, false];
    const newUserResult = await client.query(insertUserQuery, insertUserValues);
    const newUser = newUserResult.rows[0];

    // 이메일 인증 토큰
    const emailToken = jwt.sign({ email: newUser.email }, process.env.SECRET_KEY, { expiresIn: '5m' });
    const url = `http://localhost:3000/api/auth/verify-email?token=${emailToken}`;

    // email 전송
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: newUser.email,
      subject: '이메일 인증',
      text: `이메일 인증을 완료하려면 링크를 클릭하세요: ${url}`,
    };
    await transporter.sendMail(mailOptions);
  } catch (error) {
    throw error;
  } finally {
    client.release();
  }
};

// 토큰 갱신
exports.refreshTokenService = async (
  refreshToken: string
): Promise<{ token: string; refreshToken: string }> => {
  if (!refreshToken) {
    throw createError('NoRefreshToken', '토큰이 없습니다.', 401);
  }

  let payload;
  try {
    payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET_KEY);
  } catch (error) {
    throw createError('InvalidRefreshToken', '유효하지 않은 토큰입니다.', 403);
  }

  const newToken = jwt.sign(
    { id: (payload as any).id, email: (payload as any).email },
    process.env.SECRET_KEY,
    { expiresIn: '30m' }
  );
  const newRefreshToken = jwt.sign(
    { id: (payload as any).id },
    process.env.REFRESH_TOKEN_SECRET_KEY,
    { expiresIn: '7d' }
  );

  return { token: newToken, refreshToken: newRefreshToken };
};

// 카카오 인증 (로그인 및 회원가입)
exports.kakaoAuthService = async (
  code: string
): Promise<{ token?: string; refreshToken?: string; message?: string }> => {
  const redirectUri = 'http://localhost:3000/api/auth/kakao/callback';
  const kakaoTokenUrl = `https://kauth.kakao.com/oauth/token`;

  try {
    const tokenResponse = await axios.post(kakaoTokenUrl, null, {
      params: {
        grant_type: 'authorization_code',
        client_id: process.env.KAKAO_CLIENT_ID,
        redirect_uri: redirectUri,
        code
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    const { access_token } = tokenResponse.data;
    console.log({access_token});
    const userInfoResponse = await axios.get(
      'https://kapi.kakao.com/v2/user/me',
      {
        headers: {
          Authorization: `Bearer ${access_token}`
        }
      }
    );
    const { id, kakao_account, properties } = userInfoResponse.data;
    const email = kakao_account.email || null;
    const username =
      properties.nickname || kakao_account.profile.nickname || null;

    if (!email) {
      throw createError(
        'KakaoAuthError',
        '카카오에서 사용자 정보가 충분하지 않습니다.',
        400
      );
    }

    const client = await pool.connect();
    try {
      // 로컬, 소셜 이메일 중복 확인
      const checkEmailQuery = 'SELECT * FROM users WHERE email = $1';
      const checkEmailValues = [email];
      const existingEmailResult = await client.query(checkEmailQuery, checkEmailValues);

      if (existingEmailResult.rows.length > 0) {
        const user = existingEmailResult.rows[0];
        if (!user.kakaoid) {
          // 이메일이 로컬 계정으로 존재하고, 카카오 아이디가 연동되지 않으면
          return { message: '해당 이메일은 이미 로컬 계정으로 존재합니다. 소셜 계정을 연동해주세요.' };
        }
      }

      const checkUserQuery = 'SELECT * FROM users WHERE kakaoid = $1';
      const checkUserValues = [id];
      const existingUserResult = await client.query(
        checkUserQuery,
        checkUserValues
      );

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
          id
        ];
        const newUserResult = await client.query(
          insertUserQuery,
          insertUserValues
        );
        user = newUserResult.rows[0];
      }

      const payload = { id: user.userid, email: user.email };
      const token = jwt.sign(payload, process.env.SECRET_KEY, {
        expiresIn: '30m'
      });
      const refreshToken = jwt.sign(
        { id: user.id },
        process.env.REFRESH_TOKEN_SECRET_KEY,
        { expiresIn: '7d' }
      );

      return { token, refreshToken };
    } finally {
      client.release();
    }
  } catch (error) {
    throw createError('KakaoAuthError', '카카오 인증 실패', 500);
  }
};

// 구글 로그인
exports.googleAuthService = async (
  code: string
): Promise<{ token?: string; refreshToken?: string; message?: string }> => {
  const tokenUrl = 'https://oauth2.googleapis.com/token';
  const userInfoUrl = 'https://www.googleapis.com/oauth2/v2/userinfo';

  try {
    const tokenResponse = await axios.post(tokenUrl, null, {
      params: {
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: 'http://localhost:3000/api/auth/google/callback',
        grant_type: 'authorization_code'
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    const { access_token } = tokenResponse.data;
    const userInfoResponse = await axios.get(userInfoUrl, {
      headers: {
        Authorization: `Bearer ${access_token}`
      }
    });

    const { id, email, name } = userInfoResponse.data;

    if (!email) {
      throw createError(
        'GoogleAuthError',
        '구글에서 사용자 정보가 충분하지 않습니다.',
        400
      );
    }

    const client = await pool.connect();
    try {
      // 로컬, 소셜 이메일 중복 확인
      const checkEmailQuery = 'SELECT * FROM users WHERE email = $1';
      const checkEmailValues = [email];
      const existingEmailResult = await client.query(checkEmailQuery, checkEmailValues);

      if (existingEmailResult.rows.length > 0) {
        const user = existingEmailResult.rows[0];
        if (!user.googleid) {
          // 이메일이 로컬 계정으로 존재하고, 구글 아이디가 연동되지 않으면
          return { message: '해당 이메일은 이미 로컬 계정으로 존재합니다. 소셜 계정을 연동해주세요.' };
        }
      }

      const checkUserQuery = 'SELECT * FROM users WHERE googleid = $1';
      const checkUserValues = [id];
      const existingUserResult = await client.query(
        checkUserQuery,
        checkUserValues
      );

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
          id
        ];
        const newUserResult = await client.query(
          insertUserQuery,
          insertUserValues
        );
        user = newUserResult.rows[0];
      }

      const payload = { id: user.userid, email: user.email };
      const token = jwt.sign(payload, process.env.SECRET_KEY, {
        expiresIn: '30m'
      });
      const refreshToken = jwt.sign(
        { id: user.userid },
        process.env.REFRESH_TOKEN_SECRET_KEY,
        { expiresIn: '7d' }
      );

      return { token, refreshToken };
    } finally {
      client.release();
    }
  } catch (error) {
    throw createError('GoogleAuthError', '구글 인증 실패', 500);
  }
};


// 비번 변경
exports.changePasswordService = async (
  email: string,
  oldPassword: string,
  newPassword: string
): Promise<void> => {
  const client = await pool.connect();
  try {
    const query = 'SELECT * FROM users WHERE email = $1';
    const values = [email];
    const result = await client.query(query, values);
    const user = result.rows[0];

    if (!user) {
      throw createError('UserNotFound', '사용자를 찾을 수 없습니다.', 404);
    }
    if (user.kakaoid) {
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
    await client.query(updateQuery, updateValues);
  } catch (error) {
    throw error;
  } finally {
    client.release();
  }
};

// 비번 재설정 요청
exports.requestPasswordService = async (email: string): Promise<void> => {
  const client = await pool.connect();
  try {
    const query = 'SELECT * FROM users WHERE email = $1';
    const values = [email];
    const result = await client.query(query, values);
    const user = result.rows[0];

    if (!user) {
      throw createError('User Not Found', '사용자를 찾을 수 없습니다', 404);
    }

    const token = jwt.sign(
      { id: user.userid, email: user.email },
      process.env.SECRET_KEY,
      { expiresIn: '3m' }
    );
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: '비밀번호 재설정',
      text: `비밀번호를 재설정하려면 링크를 클릭하세요 (유효시간: 3분): http://localhost:3000/reset-password?token=${token}`
    };
    await transporter.sendMail(mailOptions);
  } catch (error) {
    throw error;
  } finally {
    client.release();
  }
};

// 비번 재설정
exports.resetPasswordService = async (
  token: string,
  newPassword: string
): Promise<void> => {
  try {
    const decoded: any = jwt.verify(token, process.env.SECRET_KEY);
    const client = await pool.connect();
    try {
      const query = 'SELECT * FROM users WHERE userid = $1';
      const values = [decoded.id];
      const result = await client.query(query, values);

      if (result.rows.length === 0) {
        throw createError('UserNotFound', '사용자를 찾을 수 없습니다', 404);
      }

      const user = result.rows[0];

      const hashedNewPassword = await bcrypt.hash(newPassword, 10);

      const updateQuery = 'UPDATE users SET password = $1 WHERE userid = $2';
      const updateValues = [hashedNewPassword, decoded.id];
      await client.query(updateQuery, updateValues);
    } finally {
      client.release();
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
exports.linkSocialAccountService = async (userId: number, socialId: string, email: string, provider: 'kakao' | 'google'): Promise<void> => {
  const client = await pool.connect();
  try {
    const query = 'SELECT * FROM users WHERE userid = $1';
    const values = [userId];
    const result = await client.query(query, values);
    const user = result.rows[0];

    if (!user) {
      throw createError('UserNotFound', '사용자를 찾을 수 없습니다.', 404);
    }
    const defaultPassword = provider === 'kakao' ? 'kakao_auth_password' : 'google_auth_password';
    if (provider === 'kakao') {
      if (user.kakaoid) {
        throw createError('AlreadyLinked', '이미 카카오 계정과 연동되어 있습니다.', 400);
      }
      const updateQuery = 'UPDATE users SET kakaoid = $1 WHERE userid = $2';
      const updateValues = [socialId, defaultPassword,userId];
      await client.query(updateQuery, updateValues);
    } else if (provider === 'google') {
      if (user.googleid) {
        throw createError('AlreadyLinked', '이미 구글 계정과 연동되어 있습니다.', 400);
      }
      const updateQuery = 'UPDATE users SET googleid = $1 WHERE userid = $2';
      const updateValues = [socialId, defaultPassword, userId];
      await client.query(updateQuery, updateValues);
    }
  } catch (error) {
    throw error;
  } finally {
    client.release();
  }
};

// 이메일 인증
exports.verifyEmailService = async (token: string): Promise<void> => {
  const client = await pool.connect();
  try {
    const decoded: any = jwt.verify(token, process.env.SECRET_KEY);
    
    const query = 'SELECT * FROM users WHERE email = $1';
    const values = [decoded.email];
    const result = await client.query(query, values);

    if (result.rows.length === 0) {
      throw createError('UserNotFound', '사용자를 찾을 수 없습니다', 404);
    }

    const user = result.rows[0];
    if (user.isVerified) {
      throw createError('AlreadyVerified', '이미 이메일 인증이 완료되었습니다.', 400);
    }

    const updateQuery = 'UPDATE users SET isVerified = true WHERE email = $1';
    await client.query(updateQuery, values);
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw createError('TokenExpired', '토큰이 만료됨', 400);
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw createError('InvalidToken', '토큰이 유효하지 않음', 400);
    }
    throw error;
  } finally {
    client.release();
  }
};