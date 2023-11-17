const jwt = require('jsonwebtoken');
require('dotenv').config();

const generateToken = (userId, role) => {
  const token = jwt.sign(
    { userId, role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRATION_TIME }
  );
  return token;
};

module.exports = generateToken;
