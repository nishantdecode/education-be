const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 10, // limit each IP to 10 requests per minute
  delayMs: 0, // disable delaying - faster blocking
  message: 'Too many requests from this IP, please try again in a minute',
});

module.exports = limiter;
