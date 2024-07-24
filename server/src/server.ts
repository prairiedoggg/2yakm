import express, { Request, Response, NextFunction } from 'express';
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
import authByToken from './middlewares/authByToken';

import visionRouter from './routes/vision_route';
import reviewRouter from './routes/review_route';
import authRouter from './routes/auth_route';
import calendarRouter from './routes/calendar_route';
import alarmRouter from './routes/alarm_route';
import mypageRouter from './routes/mypage_route';
import mydrugRouter from './routes/mydrug_route';
import chatbotRouter from './routes/chatbot_route';
import favoriteRouter from './routes/favorite_route';

dotenv.config();

const app = express();

const port = process.env.PORT ?? 3000;
// Helmet
app.use(helmet());
app.use(express.json());
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
app.use('/api/chatbot', authByToken, chatbotRouter);
app.use('/api/calendars', authByToken, calendarRouter);
app.use('/api/alarms', authByToken, alarmRouter);

// 404 error Handler
app.use((req: Request, res: Response, next: NextFunction) => {
  res
    .status(404)
    .send('404 Not Found: The page you are looking for does not exist.');
});

// Error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send(err);
});

app.listen(port, () => {
  console.log(`Server is running http://localhost:${port}`);
});
