const { Pool } = require('pg');
const fs = require('fs');
const dotenv = require('dotenv');
dotenv.config();
const path = require('path');

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  port: Number(process.env.DB_PORT),
  ssl: {
    rejectUnauthorized: false,
    ca: fs
      .readFileSync(path.join(__dirname, '../certs/server-ca.pem'))
      .toString(),
    key: fs
      .readFileSync(path.join(__dirname, '../certs/client-key.pem'))
      .toString(),
    cert: fs
      .readFileSync(path.join(__dirname, '../certs/client-cert.pem'))
      .toString()
  }
});

pool.connect((err: any) => {
  if (err) {
    console.log('PostgreSQL 연결에 실패했습니다.', err);
  } else {
    console.log('PostgresSQL 연결 성공');
  }
});

module.exports = { pool };
