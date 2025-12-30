const { body } = require('express-validator');
const {
  VALIDATION_MESSAGES,
  AUTH_CONSTANTS,
  USER_CONSTANTS
} = require('../constants');

const registerValidator = [
  body('email')
    .exists().withMessage(VALIDATION_MESSAGES.EMAIL.REQUIRED)
    .isEmail().withMessage(VALIDATION_MESSAGES.EMAIL.INVALID)
    .normalizeEmail(),
  body('password')
    .exists().withMessage(VALIDATION_MESSAGES.PASSWORD.REQUIRED)
    .isLength({ min: AUTH_CONSTANTS.PASSWORD.MIN_LENGTH })
    .withMessage(
      VALIDATION_MESSAGES.PASSWORD.MIN_LENGTH
        .replace('{{min}}', AUTH_CONSTANTS.PASSWORD.MIN_LENGTH)
    ),
  body('firstName')
    .exists().withMessage(VALIDATION_MESSAGES.FIRST_NAME.REQUIRED)
    .trim()
    .notEmpty().withMessage(VALIDATION_MESSAGES.FIRST_NAME.EMPTY)
    .isLength({ max: USER_CONSTANTS.FIELD_LENGTHS.FIRST_NAME_MAX })
    .withMessage(VALIDATION_MESSAGES.FIRST_NAME.TOO_LONG),
  body('lastName')
    .exists().withMessage(VALIDATION_MESSAGES.LAST_NAME.REQUIRED)
    .trim()
    .notEmpty().withMessage(VALIDATION_MESSAGES.LAST_NAME.EMPTY)
    .isLength({ max: USER_CONSTANTS.FIELD_LENGTHS.LAST_NAME_MAX })
    .withMessage(VALIDATION_MESSAGES.LAST_NAME.TOO_LONG)
];

const loginValidator = [
  body('email')
    .isEmail().withMessage(VALIDATION_MESSAGES.EMAIL.INVALID)
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage(VALIDATION_MESSAGES.PASSWORD.REQUIRED)
];

const refreshTokenValidator = [
  body('refreshToken')
    .notEmpty().withMessage(VALIDATION_MESSAGES.TOKEN.REFRESH_REQUIRED)
];

module.exports = {
  registerValidator,
  loginValidator,
  refreshTokenValidator
};
