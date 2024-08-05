import express from 'express';
import swaggerUi from 'swagger-ui-express';
import specs from './swagger';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { errorHandler, notFoundHandler } from './middlewares/errorHandler';
import authByToken from './middlewares/authByToken';

import reviewRouter from './routes/review_route';
import authRouter from './routes/auth_route';
import calendarRouter from './routes/calendar_route';
import alarmRouter from './routes/alarm_route';
import mypageRouter from './routes/mypage_route';
import chatbotRouter from './routes/chatbot_route';
import favoriteRouter from './routes/favorite_route';
import mypillRouter from './routes/mypill_route';
import pillRouter from './routes/pill_route';

import { rescheduleAllAlarms } from './services/alarmService';

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

app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api/reviews', reviewRouter);
app.use('/api/auth', authRouter);
app.use('/api/favorites', favoriteRouter);
app.use('/api/mypage', authByToken, mypageRouter);
app.use('/api/mypills', authByToken, mypillRouter);
app.use('/api/chatbot', authByToken, chatbotRouter);
app.use('/api/calendars', authByToken, calendarRouter);
app.use('/api/alarms', authByToken, alarmRouter);
app.use('/api/pills', pillRouter);

app.use(notFoundHandler);
app.use(errorHandler);
app.listen(port, () => {
  console.log(`Server is running ${port}`);
  rescheduleAllAlarms();
});

