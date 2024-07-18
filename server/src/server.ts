const express = require('express');
const swaggerUi = require('swagger-ui-express');
const specs = require('./swagger');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const mypageRouter = require('./routes/mypage_route');
const authRouter = require('./routes/auth_route');
const uploadRoutes = require('./routes/uploadRoutes');
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

app.use('/auth', authRouter);
app.use('/mypage', mypageRouter);
app.use('/api/upload', uploadRoutes);


app.listen(port, () => {
  console.log(`Server is running http://localhost:${port}`);
});


