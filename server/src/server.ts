const express = require('express');
const swaggerUi = require('swagger-ui-express');
const spec = require('./swagger');
const pg = require('pg');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

const calenderRoutes = require('./routes/calenderRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(spec));

app.listen(port, () => {
  console.log(`Server is running http://localhost:${port}`);
});

app.use('/api/calenders', calenderRoutes);
app.use('/api/upload', uploadRoutes);

module.exports = app;