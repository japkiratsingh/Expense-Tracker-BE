const jwt = require('jsonwebtoken');
const AppError = require('../utils/AppError');
const { JWT_SECRET } = require('../config');
const {
  ERROR_MESSAGES,
  HTTP_STATUS,
  AUTH_CONSTANTS
} = require('../constants');

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith(AUTH_CONSTANTS.JWT.BEARER_PREFIX)) {
      throw new AppError(
        ERROR_MESSAGES.AUTH.NO_TOKEN_PROVIDED,
        HTTP_STATUS.UNAUTHORIZED
      );
    }

    const token = authHeader.substring(AUTH_CONSTANTS.JWT.BEARER_PREFIX_LENGTH);

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded; // { userId, email, iat, exp }
      next();
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        throw new AppError(
          ERROR_MESSAGES.AUTH.TOKEN_EXPIRED,
          HTTP_STATUS.UNAUTHORIZED
        );
      }
      throw new AppError(
        ERROR_MESSAGES.AUTH.INVALID_TOKEN,
        HTTP_STATUS.UNAUTHORIZED
      );
    }
  } catch (error) {
    next(error);
  }
};

const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith(AUTH_CONSTANTS.JWT.BEARER_PREFIX)) {
      const token = authHeader.substring(AUTH_CONSTANTS.JWT.BEARER_PREFIX_LENGTH);
      try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
      } catch (err) {
        // Token invalid but optional, continue without user
      }
    }
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = { authenticate, optionalAuth };
