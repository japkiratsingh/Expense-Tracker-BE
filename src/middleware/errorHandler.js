const AppError = require('../utils/AppError');

const errorHandler = (err, req, res, next) => {
  let error = err;

  if (!(error instanceof AppError)) {
    const statusCode = error.statusCode || 500;
    const message = error.message || 'Internal Server Error';
    error = new AppError(message, statusCode);
  }

  const response = {
    success: false,
    error: {
      message: error.message,
      statusCode: error.statusCode
    }
  };

  if (error.errors) {
    response.error.errors = error.errors;
  }

  if (process.env.NODE_ENV === 'development') {
    response.error.stack = error.stack;
  }

  res.status(error.statusCode).json(response);
};

module.exports = errorHandler;
