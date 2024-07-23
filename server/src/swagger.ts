//import swaggerJsdoc from 'swagger-jsdoc';
const swaggerJsdoc = require('swagger-jsdoc');
const options = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'My API',
      version: '1.0.0',
      description: 'My Express API with Swagger'
    },
    servers: [
      {
        url: 'http://localhost:3000/',
        description: 'Development server'
      }
    ]
  },
  apis: ['./src/routes/*.ts']
};

const specs = swaggerJsdoc(options);

export default specs;