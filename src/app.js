const express = require('express');
const app = express();
const swaggerUi = require('swagger-ui-express');
const fs = require('fs');
const YAML = require('js-yaml');

const file = fs.readFileSync('./openapi.yaml', 'utf8');
const swaggerDocument = YAML.safeLoad(file);

app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const deviceRoutes = require('./routes/deviceRoutes');
const userRoutes = require('./routes/userRoutes');

app.use('/devices', deviceRoutes);
app.use('/users', userRoutes);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
