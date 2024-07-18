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

const reviewRouter = require('./routes/review_route');
const authRouter = require('./routes/auth_route');
// const calenderRouter = require('./routes/calendar_routes');
// const uploadRouter = require('./routes/uploadRoutes');
const calenderRoutes = require('./routes/calenderRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

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
      const renderedHtml = data.replace(/YOUR_REST_API_KEY/g, process.env.KAKAO_CLIENT_ID || '');
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

app.use('api/review', reviewRouter);
app.use('api/auth', authRouter);
// app.use('/api/calenders', calenderRouter);
// app.use('/api/upload', uploadRouter);
app.use('/api/calenders', calenderRoutes);
app.use('/api/upload', uploadRoutes);


app.listen(port, () => {
  console.log(`Server is running http://localhost:${port}`);
});