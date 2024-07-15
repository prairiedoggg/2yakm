import express from 'express';
import swaggerUi from 'swagger-ui-express';
import specs from './swagger';
import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

const { Pool } = pg;
const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  port: Number(process.env.DB_PORT)
});

pool.connect((err: any) => {
  if (err) {
    console.log('PostgreSQL 연결에 실패했습니다.', err);
  } else {
    console.log('PostgresSQL 연결 성공');
  }
});

app.listen(port, () => {
  console.log(`Server is running http://localhost:${port}`);
});
