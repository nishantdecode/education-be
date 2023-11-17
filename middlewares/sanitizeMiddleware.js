const { sanitize } = require('dompurify');

function sanitizeRequest(req, res, next) {
  for (let key in req.body) {
    req.body[key] = sanitize(req.body[key]);
  }
  next();
}

module.exports = sanitizeRequest;
