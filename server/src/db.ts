import { Pool, QueryResult } from 'pg';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { createError } from './utils/error';

dotenv.config();

// 인증서가 있는지 확인하는 함수
const isCertFiles = (certPath: string): string => {
  const filePath = path.join(__dirname, certPath);

  if (!fs.existsSync(filePath)) {
    throw createError('NotFound', `DB 인증서를 찾을 수 없습니다.`, 404);
  }
  return fs.readFileSync(filePath).toString();
};

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  port: Number(process.env.DB_PORT),
  ssl: {
    rejectUnauthorized: false,
    ca: isCertFiles('../certs/server-ca.pem'),
    key: isCertFiles('../certs/client-key.pem'),
    cert: isCertFiles('../certs/client-cert.pem')
  }
});

const connectDB = async (): Promise<void> => {
  try {
    const client = await pool.connect();
    console.log('PostgreSQL 연결 성공');
    client.release(); // pool을 반납함
  } catch (error: any) {
    throw createError(
      'Connection Failed',
      'PostgreSQL 연결에 실패했습니다.',
      500
    );
  }
};

connectDB();

export { pool, QueryResult };
