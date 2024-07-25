const express = require('express');
const swaggerUi = require('swagger-ui-express');
const specs = require('./swagger');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
import { errorHandler, notFoundHandler } from './middlewares/errorHandler';
import authByToken from './middlewares/authByToken';

import reviewRouter from './routes/review_route';
import authRouter from './routes/auth_route';
const calendarRouter = require('./routes/calendar_route');
const alarmRouter = require('./routes/alarm_route');
import favoriteRouter from './routes/favorite_route';
import mypageRouter from './routes/mypage_route';
import mypillRouter from './routes/mypill_route';
const chatbotRouter = require('./routes/chatbot_route');
import pillRouter from './routes/pill_route';
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
  console.log(`Server is running http://localhost:${port}`);
});