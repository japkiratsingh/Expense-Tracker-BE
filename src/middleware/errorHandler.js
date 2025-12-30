const AppError = require('../utils/AppError');
const {
  COMMON_CONSTANTS,
  HTTP_STATUS,
  ERROR_MESSAGES
} = require('../constants');
const config = require('../config');

const errorHandler = (err, req, res, next) => {
  let error = err;

  if (!(error instanceof AppError)) {
    const statusCode = error.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR;
    const message = error.message || ERROR_MESSAGES.GENERAL.INTERNAL_SERVER_ERROR;
    error = new AppError(message, statusCode);
  }

  const response = {
    success: COMMON_CONSTANTS.RESPONSE_STATUS.FAILURE,
    error: {
      message: error.message,
      statusCode: error.statusCode
    }
  };

  if (error.errors) {
    response.error.errors = error.errors;
  }

  if (config.NODE_ENV === COMMON_CONSTANTS.ENVIRONMENTS.DEVELOPMENT) {
    response.error.stack = error.stack;
  }

  res.status(error.statusCode).json(response);
};

module.exports = errorHandler;
