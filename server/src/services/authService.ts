const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { createError } = require('../utils/error');
const { pool } = require('../db');
const dotenv = require('dotenv');

dotenv.config();

// User 인터페이스 정의
interface User {
  id: number;
  email: string;
  username: string;
  password: string;
}

// User 응답 타입 정의 (password 필드 없음)
interface UserResponse {
  email: string;
  username: string;
}

// 로그인 서비스 함수
const loginService = async (email: string, password: string): Promise<{ token: string; refreshToken: string }> => {
  const client = await pool.connect();
  try {
    const query = 'SELECT * FROM users WHERE email = $1';
    const values = [email];
    const result = await client.query(query, values);
    const user = result.rows[0];

    if (!user) {
      throw createError('UserNotFound', '사용자를 찾을 수 없습니다.', 404);
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw createError('InvalidCredentials', '비밀번호가 틀렸습니다.', 401);
    }

    const payload = { id: user.id, email: user.email };
    const token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: '1h' });
    const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET_KEY, { expiresIn: '7d' });

    return { token, refreshToken };
  } catch (error) {
    throw error;
  } finally {
    client.release();
  }
};

// 회원가입 서비스 함수
const signupService = async (email: string, username: string, password: string, confirmPassword: string): Promise<UserResponse> => {
  const client = await pool.connect();
  try {
    const checkUserQuery = 'SELECT * FROM users WHERE email = $1';
    const checkUserValues = [email];
    const existingUserResult = await client.query(checkUserQuery, checkUserValues);

    if (existingUserResult.rows.length > 0) {
      throw createError('UserExists', '해당 이메일로 이미 사용자가 존재합니다.', 409);
    }

    if (password !== confirmPassword) {
      throw createError('PasswordMismatch', '비밀번호가 일치하지 않습니다.', 400);
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const insertUserQuery = `
      INSERT INTO users (email, username, password) VALUES ($1, $2, $3)
      RETURNING email, username
    `;
    const insertUserValues = [email, username, hashedPassword];
    const newUserResult = await client.query(insertUserQuery, insertUserValues);
    const newUser = newUserResult.rows[0];

    return { email: newUser.email, username: newUser.username };
  } catch (error) {
    throw error;
  } finally {
    client.release();
  }
};

// 토큰 갱신 서비스 함수
const refreshTokenService = async (refreshToken: string): Promise<string> => {
  if (!refreshToken) {
    throw createError('NoRefreshToken', '토큰이 없습니다.', 401);
  }

  let payload;
  try {
    payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET_KEY);
  } catch (error) {
    throw createError('InvalidRefreshToken', '유효하지 않은 토큰입니다.', 403);
  }

  const newToken = jwt.sign({ id: (payload as any).id, email: (payload as any).email }, process.env.JWT_SECRET, { expiresIn: '1h' });
  return newToken;
};

module.exports = {
  loginService,
  signupService,
  refreshTokenService,
};
