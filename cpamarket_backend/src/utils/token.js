const jwt = require('jsonwebtoken');
const config = require('../config/env');

const generateToken = (payload) =>
  jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  });

module.exports = {
  generateToken,
};
