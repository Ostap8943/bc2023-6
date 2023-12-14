const express = require('express');
const app = express();
const swaggerUi = require('swagger-ui-express');
const fs = require('fs');
const YAML = require('yaml');

const file = fs.readFileSync('./openapi.yaml', 'utf8');
const swaggerDocument = YAML.parse(file);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Додаємо middleware для розпізнавання JSON-даних
app.use(express.json());

const devices = [];

// Додаємо цей middleware для віддачі статичних файлів (зображень)
app.use('/static', express.static('public'));

app.listen(8000, () => {
  console.log('Server is running on port 8000');
});
