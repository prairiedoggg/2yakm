const express = require('express');
const swaggerUi = require('swagger-ui-express');
const specs = require('./swagger');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');

const reviewRouter = require('./routes/review_route');

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

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/review', reviewRouter);

app.listen(port, () => {
  console.log(`Server is running http://localhost:${port}`);
});
