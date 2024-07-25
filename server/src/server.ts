const express = require('express');
const swaggerUi = require('swagger-ui-express');
const specs = require('./swagger');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const path = require('path');
const fs = require('fs');
import { errorHandler } from './middlewares/errorHandler';
import authByToken from './middlewares/authByToken';

import drugRouter from './routes/drug_route';
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

const port = process.env.PORT || 3000;
app.use(express.static(path.join(__dirname, 'public')));
// CORS
app.use(
  cors({
    origin: true,
    credentials: true
  })
);

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

// Helmet
app.use(helmet());
app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api/reviews', reviewRouter);
app.use('/api/auth', authRouter);
app.use('/api/favorites', favoriteRouter);
app.use('/mypage', authByToken, mypageRouter);
app.use('/mydrugs', authByToken, mydrugRouter);
app.use('/api/chatbot', authByToken, chatbotRouter);
app.use('/api/calendars', authByToken, calendarRouter);
app.use('/api/alarms', authByToken, alarmRouter);
app.use('/api/drugs', drugRouter);

app.listen(port, () => {
  console.log(`Server is running http://localhost:${port}`);
});