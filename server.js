const express = require("express");
const http = require("http");
const sequelize = require("./config/db");
require("dotenv").config();

const corsMiddleware = require("./middlewares/corsMiddleware");
const helmetMiddleware = require("./middlewares/helmetMiddleware");
// const limiterMiddleware = require('./middlewares/rateLimitMiddleware');
const sanitizeMiddleware = require("./middlewares/sanitizeMiddleware");
const logMiddleware = require("./middlewares/logMiddleware");

const routes = require("./routes");

const hostname = process.env.HOSTNAME || "localhost";
const port = process.env.PORT || 3001;

const app = express();

// Middleware
app.use(corsMiddleware);
app.use(helmetMiddleware);
// app.use(limiterMiddleware);
app.use(sanitizeMiddleware);
app.use(logMiddleware);
app.use(express.json({ limit: "100mb" })); // Parse JSON bodies
app.use(express.urlencoded({ extended: false })); // Parse URL-encoded bodies

// Routes
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api", routes);

// Connect to database and start the server
sequelize
  .authenticate()
  .then(() => {
    console.log("Connected to PostgreSQL");
    const server = http.createServer(app);
    server.listen(port, () => {
      console.log(`Server running at http://${hostname}:${port}/`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to PostgreSQL:", err);
  });
