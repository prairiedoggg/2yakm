const express = require('express');
const swaggerUi = require('swagger-ui-express');
const specs = require('./swagger');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');

const mypageRoute = require('./routes/mypage_route');
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

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use('/mypage', mypageRoute);

app.listen(port, () => {
  console.log(`Server is running http://localhost:${port}`);
});


