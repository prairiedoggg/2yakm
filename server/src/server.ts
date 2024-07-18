const express = require('express');
const swaggerUi = require('swagger-ui-express');
const specs = require('./swagger');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');

const reviewRouter = require('./routes/review_route');
const authRoutes = require('./routes/auth_routes');

const calenderRoutes = require('./routes/calendar_routes');
const uploadRoutes = require('./routes/uploadRoutes');
const alarmRoutes = require('./routes/alarm_route');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// // ESM에서는 __dirname을 사용할 수 없어서 만들어줘야함
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

app.use('/review', reviewRouter);
app.use('/api', authRoutes);

app.listen(port, () => {
  console.log(`Server is running http://localhost:${port}`);
});

app.use('/api/calenders', calenderRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/alarms', alarmRoutes);

module.exports = app;