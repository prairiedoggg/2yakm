import express from 'express';
import swaggerUi from 'swagger-ui-express';
import specs from './swagger';

const app = express();
const port = process.env.PORT || 3000;


app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.listen(port, () => {
    console.log(`Server is running http://localhost:${port}`);
});