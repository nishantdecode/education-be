const express = require('express');
const app = express();
const http = require('http');
const sequelize = require('./config/db'); // Import the sequelize instance
const fileUpload = require('express-fileupload');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: 'dqdrxtrw1',
  api_key: '275662918232285',
  api_secret: 'bwbsRQKjTdolXK1bBJ3ea2a2WVA'
});

require('dotenv').config();

const corsMiddleware = require('./middlewares/corsMiddleware');
const helmetMiddleware = require('./middlewares/helmetMiddleware');
const limiterMiddleware = require('./middlewares/rateLimitMiddleware');
const sanitizeMiddleware = require('./middlewares/sanitizeMiddleware');
const logMiddleware = require('./middlewares/logMiddleware');

const routes = require('./routes');

const hostname = process.env.HOSTNAME;
const port = process.env.PORT || 3000;

// Use middlewares
app.use(corsMiddleware);
app.use(helmetMiddleware);
app.use(limiterMiddleware);
app.use(sanitizeMiddleware);
app.use(logMiddleware);
app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: '/tmp/'
}));

// Parse incoming JSON
app.use(express.json());

// Connect to PostgreSQL
sequelize
  .authenticate()
  .then(() => {
    console.log('Connected to PostgreSQL');
    // Start the server
    const server = http.createServer(app);
    server.listen(port, "localhost", () => {
      console.log(`Server running at http://localhost:${port}/`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to PostgreSQL:', err);
  });

// Add a route for showing a message on the browser
app.get('/', (req, res) => {
  res.send(`Hello World!`);
});

// Add routes
app.use('/api', routes);
