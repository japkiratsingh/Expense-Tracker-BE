const { body, param } = require('express-validator');
const {
  VALIDATION_MESSAGES,
  TAG_CONSTANTS
} = require('../constants');

const createTagValidator = [
  body('name')
    .exists().withMessage(VALIDATION_MESSAGES.TAG.NAME.REQUIRED)
    .trim()
    .notEmpty().withMessage(VALIDATION_MESSAGES.TAG.NAME.EMPTY)
    .isLength({ min: TAG_CONSTANTS.FIELD_LENGTHS.NAME_MIN })
    .withMessage(
      VALIDATION_MESSAGES.TAG.NAME.TOO_SHORT
        .replace('{{min}}', TAG_CONSTANTS.FIELD_LENGTHS.NAME_MIN)
    )
    .isLength({ max: TAG_CONSTANTS.FIELD_LENGTHS.NAME_MAX })
    .withMessage(
      VALIDATION_MESSAGES.TAG.NAME.TOO_LONG
        .replace('{{max}}', TAG_CONSTANTS.FIELD_LENGTHS.NAME_MAX)
    ),
  body('color')
    .optional()
    .matches(/^#[0-9A-Fa-f]{6}$/)
    .withMessage(VALIDATION_MESSAGES.TAG.COLOR.INVALID)
];

const updateTagValidator = [
  param('id')
    .exists().withMessage(VALIDATION_MESSAGES.TAG.ID.REQUIRED)
    .isUUID().withMessage(VALIDATION_MESSAGES.TAG.ID.INVALID),
  body('name')
    .optional()
    .trim()
    .notEmpty().withMessage(VALIDATION_MESSAGES.TAG.NAME.EMPTY)
    .isLength({ min: TAG_CONSTANTS.FIELD_LENGTHS.NAME_MIN })
    .withMessage(
      VALIDATION_MESSAGES.TAG.NAME.TOO_SHORT
        .replace('{{min}}', TAG_CONSTANTS.FIELD_LENGTHS.NAME_MIN)
    )
    .isLength({ max: TAG_CONSTANTS.FIELD_LENGTHS.NAME_MAX })
    .withMessage(
      VALIDATION_MESSAGES.TAG.NAME.TOO_LONG
        .replace('{{max}}', TAG_CONSTANTS.FIELD_LENGTHS.NAME_MAX)
    ),
  body('color')
    .optional()
    .matches(/^#[0-9A-Fa-f]{6}$/)
    .withMessage(VALIDATION_MESSAGES.TAG.COLOR.INVALID)
];

const tagIdValidator = [
  param('id')
    .exists().withMessage(VALIDATION_MESSAGES.TAG.ID.REQUIRED)
    .isUUID().withMessage(VALIDATION_MESSAGES.TAG.ID.INVALID)
];

const mergeTagValidator = [
  param('id')
    .exists().withMessage(VALIDATION_MESSAGES.TAG.ID.REQUIRED)
    .isUUID().withMessage(VALIDATION_MESSAGES.TAG.ID.INVALID),
  body('targetTagId')
    .exists().withMessage(VALIDATION_MESSAGES.TAG.TARGET_TAG_ID.REQUIRED)
    .isUUID().withMessage(VALIDATION_MESSAGES.TAG.ID.INVALID)
];

module.exports = {
  createTagValidator,
  updateTagValidator,
  tagIdValidator,
  mergeTagValidator
};
