const { Op } = require('sequelize');
const { User } = require('../models');
const ApiError = require('../utils/apiError');
const { generateToken } = require('../utils/token');

const allowedRoles = ['affiliate', 'advertiser'];

const register = async (req, res, next) => {
  try {
    const { username, email, password, role = 'affiliate' } = req.body;

    if (!username || !email || !password) {
      return next(ApiError.badRequest('Username, email, and password are required'));
    }

    if (!allowedRoles.includes(role)) {
      return next(ApiError.badRequest('Invalid role specified'));
    }

    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ email }, { username }],
      },
    });

    if (existingUser) {
      return next(ApiError.badRequest('Username or email already registered'));
    }

    const user = await User.create({ username, email, password, role });
    const token = generateToken({ id: user.id, role: user.role });
    return res.status(201).json({ token, user: user.toJSON() });
  } catch (error) {
    return next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(ApiError.badRequest('Email and password are required'));
    }

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return next(ApiError.unauthorized('Invalid credentials'));
    }

    const isMatch = await user.validatePassword(password);

    if (!isMatch) {
      return next(ApiError.unauthorized('Invalid credentials'));
    }

    const token = generateToken({ id: user.id, role: user.role });
    return res.json({ token, user: user.toJSON() });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  register,
  login,
};
