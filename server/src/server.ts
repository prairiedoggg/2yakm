// import express from 'express';
// import swaggerUi from 'swagger-ui-express';
// import specs from './swagger';
// import pg from 'pg';
// import fs from 'fs';
// import path from 'path';
// import { fileURLToPath } from 'url';
// import dotenv from 'dotenv';
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const spec = require('./swagger');
const pg = require('pg');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(spec));

// // ESM에서는 __dirname을 사용할 수 없어서 만들어줘야함
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

const { Pool } = pg;
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

app.listen(port, () => {
  console.log(`Server is running http://localhost:${port}`);
});
