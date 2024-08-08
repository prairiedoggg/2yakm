import { Pool, PoolClient } from 'pg';
import fs from 'fs';
import path from 'path';
import { createError } from './utils/error';

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

export { pool };

// ResultType은 Generic variable, 즉 아래의 transaction의 결과물의 type(리턴 type)
export async function withTransaction<ResultType>(
  task: (connection: PoolClient) => Promise<ResultType>
): Promise<ResultType> {
  const client = await pool.connect(); // client connect
  try {
    await client.query('BEGIN');
    const result = await task(client);
    await client.query('COMMIT'); // transaction commit
    return result;
  } catch (error) {
    await client.query('ROLLBACK'); // transaction rollback
    throw error;
  } finally {
    client.release(); // connection end
  }
}
