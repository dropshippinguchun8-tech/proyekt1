const jwt = require('jsonwebtoken');
const config = require('../config/env');
const { User } = require('../models');
const ApiError = require('../utils/apiError');

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(ApiError.unauthorized('Authentication token missing'));
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, config.jwt.secret);
    const user = await User.findByPk(decoded.id);

    if (!user) {
      return next(ApiError.unauthorized('Invalid authentication token'));
    }

    req.user = user;
    return next();
  } catch (error) {
    return next(ApiError.unauthorized('Invalid authentication token'));
  }
};

const authorizeRoles = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return next(ApiError.forbidden('You do not have permission to perform this action'));
  }

  return next();
};

module.exports = {
  authenticate,
  authorizeRoles,
};
