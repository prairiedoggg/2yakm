const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { createError } = require('../utils/error');
require('dotenv').config();

// User 인터페이스 정의
interface User {
  id: number;
  email: string;
  username: string;
  password: string;
}

// 가상의 데이터베이스 역할을 하는 배열
const users: User[] = [];

// 이메일로 사용자
const getUserByEmail = async (email: string): Promise<User | undefined> => {
  return users.find(user => user.email === email);
};

// 사용자 저장
const saveUser = async (user: User): Promise<User> => {
  users.push(user);
  return user;
};

// 로그인 서비스 
const loginService = async (email: string, password: string): Promise<{ token: string, refreshToken: string }> => {
  const user = await getUserByEmail(email);

  if (!user) {
    throw createError('UserNotFound', '사용자를 찾을 수 없습니다.', 404);
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw createError('InvalidCredentials', '비밀번호가 틀렸습니다.', 401);
  }

  const payload = { id: user.id, email: user.email };
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
  const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET_KEY, { expiresIn: '7d' });

  return { token, refreshToken };
};

// 회원가입 서비스 
const signupService = async (email: string, username: string, password: string, confirmPassword: string): Promise<User> => {
  const existingUserByEmail = await getUserByEmail(email);

  if (existingUserByEmail) {
    throw createError('UserExists', '해당 이메일로 이미 사용자가 존재합니다.', 409);
  }

  if (password !== confirmPassword) {
    throw createError('PasswordMismatch', '비밀번호가 일치하지 않습니다.', 400);
  }

  console.log(`Signup Service - Email: ${email}, Username: ${username}, Password: ${password}`);

  const saltRounds = 10;
  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, saltRounds);
    console.log(`Hashed password: ${hashedPassword}`);
  } catch (error) {
    console.error('Error during password hashing:', error);
    throw createError('HashingError', '비밀번호 해싱에 실패했습니다.', 500);
  }

  const newUser: User = { id: users.length + 1, email, username, password: hashedPassword };
  await saveUser(newUser);

  return newUser;
};

// 토큰 갱신
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

  const newToken = jwt.sign({ id: payload.id, email: payload.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
  return newToken;
};

module.exports = {
  loginService,
  signupService,
  refreshTokenService,
};
