import express from 'express';
import swaggerUi from 'swagger-ui-express';
import specs from './swagger';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import path from 'path';
import fs from 'fs';
import { errorHandler } from './middlewares/errorHandler';

import visionRouter from './routes/vision_route';
import reviewRouter from './routes/review_route';
import authRouter from './routes/auth_route';
const calendarRouter = require('./routes/calendar_route');
const alarmRouter = require('./routes/alarm_route');
import favoriteRouter from './routes/favorite_route';
const mypageRouter = require('./routes/mypage_route');
const mydrugRouter = require('./routes/mydrug_route');
const chatbotRouter = require('./routes/chatbot_route');

dotenv.config();

const app = express();

const port = process.env.PORT ?? 3000;
// Helmet
app.use(helmet());

// CORS
app.use(
  cors({
    origin: true,
    credentials: true
  })
);

app.use(express.static(path.join(__dirname, 'public')));
app.get('/', (req: any, res: any) => {
  const filePath = path.join(__dirname, 'public', 'index.html');
  fs.readFile(filePath, 'utf8', (err: any, data: any) => {
    if (err) {
      return res.status(500).send('Error reading index.html');
    }
    const renderedHtml = data.replace(
      /YOUR_REST_API_KEY/g,
      process.env.KAKAO_CLIENT_ID || ''
    );
    res.send(renderedHtml);
  });
});

app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api/reviews', reviewRouter);
app.use('/api/auth', authRouter);
app.use('/api/favorites', favoriteRouter);
app.use('/mypage', mypageRouter);
app.use('/mydrugs', mydrugRouter);

app.listen(port, () => {
  console.log(`Server is running http://localhost:${port}`);
});
