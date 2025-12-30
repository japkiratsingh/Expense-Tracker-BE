const { validationResult } = require('express-validator');
const AppError = require('../utils/AppError');
const { ERROR_MESSAGES, HTTP_STATUS } = require('../constants');

const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(err => ({
      field: err.path || err.param,
      message: err.msg,
      value: err.value
    }));

    throw new AppError(
      ERROR_MESSAGES.VALIDATION.FAILED,
      HTTP_STATUS.BAD_REQUEST,
      errorMessages
    );
  }

  next();
};

module.exports = { validate };
