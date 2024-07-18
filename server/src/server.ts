const express = require('express');
const swaggerUi = require('swagger-ui-express');
const specs = require('./swagger');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');

const reviewRouter = require('./routes/review_route');
const authRouter = require('./routes/auth_route');
// const calenderRouter = require('./routes/calendar_routes');
// const uploadRouter = require('./routes/uploadRoutes');
const calenderRoutes = require('./routes/calenderRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
// const alarmRoutes = require('./routes/alarm_route');
const favoriteRoutes = require('./routes/favorite_route');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// CORS
app.use(
  cors({
    origin: true,
    credentials: true
  })
);

// Helmet
app.use(helmet());
app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api/reviews', reviewRouter);
app.use('/auth', authRouter);
// app.use('/api/calenders', calenderRouter);
// app.use('/api/upload', uploadRouter);
app.use('/api/calenders', calenderRoutes);
app.use('/api/upload', uploadRoutes);
// app.use('/api/alarms', alarmRoutes);
app.use('/api/favorites', favoriteRoutes);

app.listen(port, () => {
  console.log(`Server is running http://localhost:${port}`);
});

module.exports = app;
