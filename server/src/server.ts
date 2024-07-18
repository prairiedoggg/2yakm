const express = require('express');
const swaggerUi = require('swagger-ui-express');
const specs = require('./swagger');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const authByToken = require('./middlewares/authByToken');
const reviewRouter = require('./routes/review_route');
const authRoutes = require('./routes/auth_routes');

const cookieParser = require('cookie-parser');
const calendarRouter = require('./routes/calendar_route');
const alarmRouter = require('./routes/alarm_route');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
app.use(cookieParser());

app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/review', reviewRouter);
app.use('/api', authRoutes);
app.use(authByToken);

app.listen(port, () => {
  console.log(`Server is running http://localhost:${port}`);
});


app.use('/api/calenders', authByToken, calendarRouter);
app.use('/api/alarms', authByToken, alarmRouter);

module.exports = app;