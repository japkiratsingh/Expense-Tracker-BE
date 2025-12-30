/**
 * Category Validators
 * Input validation for category endpoints
 */

const { body, param, query } = require('express-validator');
const { CATEGORY_CONSTANTS, VALIDATION_MESSAGES, COMMON_CONSTANTS } = require('../constants');

/**
 * Validator for creating a category
 */
const createCategoryValidator = [
  body('name')
    .exists().withMessage(CATEGORY_CONSTANTS.VALIDATION.NAME_REQUIRED)
    .trim()
    .isLength({ min: CATEGORY_CONSTANTS.NAME.MIN_LENGTH })
    .withMessage(
      CATEGORY_CONSTANTS.VALIDATION.NAME_TOO_SHORT
        .replace('{{min}}', CATEGORY_CONSTANTS.NAME.MIN_LENGTH)
    )
    .isLength({ max: CATEGORY_CONSTANTS.NAME.MAX_LENGTH })
    .withMessage(
      CATEGORY_CONSTANTS.VALIDATION.NAME_TOO_LONG
        .replace('{{max}}', CATEGORY_CONSTANTS.NAME.MAX_LENGTH)
    ),

  body('description')
    .optional()
    .trim()
    .isLength({ max: CATEGORY_CONSTANTS.DESCRIPTION.MAX_LENGTH })
    .withMessage(
      CATEGORY_CONSTANTS.VALIDATION.DESCRIPTION_TOO_LONG
        .replace('{{max}}', CATEGORY_CONSTANTS.DESCRIPTION.MAX_LENGTH)
    ),

  body('color')
    .optional()
    .trim()
    .matches(CATEGORY_CONSTANTS.COLOR.PATTERN)
    .withMessage(CATEGORY_CONSTANTS.VALIDATION.COLOR_INVALID),

  body('icon')
    .optional()
    .trim()
    .isLength({ max: CATEGORY_CONSTANTS.ICON.MAX_LENGTH })
    .withMessage(
      CATEGORY_CONSTANTS.VALIDATION.ICON_TOO_LONG
        .replace('{{max}}', CATEGORY_CONSTANTS.ICON.MAX_LENGTH)
    ),

  body('budget')
    .optional()
    .isFloat({ min: CATEGORY_CONSTANTS.BUDGET.MIN_VALUE, max: CATEGORY_CONSTANTS.BUDGET.MAX_VALUE })
    .withMessage(
      CATEGORY_CONSTANTS.VALIDATION.BUDGET_TOO_LARGE
        .replace('{{max}}', CATEGORY_CONSTANTS.BUDGET.MAX_VALUE)
    ),

  body('parentCategoryId')
    .optional()
    .trim()
    .isString()
    .withMessage(VALIDATION_MESSAGES.INVALID_FORMAT)
];

/**
 * Validator for updating a category
 */
const updateCategoryValidator = [
  param('id')
    .exists().withMessage(VALIDATION_MESSAGES.ID_REQUIRED)
    .trim()
    .isString()
    .withMessage(VALIDATION_MESSAGES.INVALID_FORMAT),

  body('name')
    .optional()
    .trim()
    .isLength({ min: CATEGORY_CONSTANTS.NAME.MIN_LENGTH })
    .withMessage(
      CATEGORY_CONSTANTS.VALIDATION.NAME_TOO_SHORT
        .replace('{{min}}', CATEGORY_CONSTANTS.NAME.MIN_LENGTH)
    )
    .isLength({ max: CATEGORY_CONSTANTS.NAME.MAX_LENGTH })
    .withMessage(
      CATEGORY_CONSTANTS.VALIDATION.NAME_TOO_LONG
        .replace('{{max}}', CATEGORY_CONSTANTS.NAME.MAX_LENGTH)
    ),

  body('description')
    .optional()
    .trim()
    .isLength({ max: CATEGORY_CONSTANTS.DESCRIPTION.MAX_LENGTH })
    .withMessage(
      CATEGORY_CONSTANTS.VALIDATION.DESCRIPTION_TOO_LONG
        .replace('{{max}}', CATEGORY_CONSTANTS.DESCRIPTION.MAX_LENGTH)
    ),

  body('color')
    .optional()
    .trim()
    .matches(CATEGORY_CONSTANTS.COLOR.PATTERN)
    .withMessage(CATEGORY_CONSTANTS.VALIDATION.COLOR_INVALID),

  body('icon')
    .optional()
    .trim()
    .isLength({ max: CATEGORY_CONSTANTS.ICON.MAX_LENGTH })
    .withMessage(
      CATEGORY_CONSTANTS.VALIDATION.ICON_TOO_LONG
        .replace('{{max}}', CATEGORY_CONSTANTS.ICON.MAX_LENGTH)
    ),

  body('budget')
    .optional()
    .isFloat({ min: CATEGORY_CONSTANTS.BUDGET.MIN_VALUE, max: CATEGORY_CONSTANTS.BUDGET.MAX_VALUE })
    .withMessage(
      CATEGORY_CONSTANTS.VALIDATION.BUDGET_TOO_LARGE
        .replace('{{max}}', CATEGORY_CONSTANTS.BUDGET.MAX_VALUE)
    ),

  body('isActive')
    .optional()
    .isBoolean()
    .withMessage(VALIDATION_MESSAGES.INVALID_FORMAT)
];

/**
 * Validator for category ID parameter
 */
const categoryIdValidator = [
  param('id')
    .exists().withMessage(VALIDATION_MESSAGES.ID_REQUIRED)
    .trim()
    .isString()
    .withMessage(VALIDATION_MESSAGES.INVALID_FORMAT)
];

/**
 * Validator for getting category expenses
 */
const getCategoryExpensesValidator = [
  param('id')
    .exists().withMessage(VALIDATION_MESSAGES.ID_REQUIRED)
    .trim()
    .isString()
    .withMessage(VALIDATION_MESSAGES.INVALID_FORMAT),

  query('startDate')
    .optional()
    .isISO8601()
    .withMessage(VALIDATION_MESSAGES.DATE.INVALID),

  query('endDate')
    .optional()
    .isISO8601()
    .withMessage(VALIDATION_MESSAGES.DATE.INVALID),

  query('page')
    .optional()
    .isInt({ min: COMMON_CONSTANTS.PAGINATION.MIN_PAGE })
    .withMessage(VALIDATION_MESSAGES.INVALID_FORMAT),

  query('limit')
    .optional()
    .isInt({ min: COMMON_CONSTANTS.PAGINATION.MIN_LIMIT, max: COMMON_CONSTANTS.PAGINATION.MAX_LIMIT })
    .withMessage(VALIDATION_MESSAGES.INVALID_FORMAT)
];

/**
 * Validator for listing categories
 */
const listCategoriesValidator = [
  query('type')
    .optional()
    .isIn([CATEGORY_CONSTANTS.TYPE.SYSTEM, CATEGORY_CONSTANTS.TYPE.USER, 'all'])
    .withMessage(VALIDATION_MESSAGES.INVALID_FORMAT),

  query('includeInactive')
    .optional()
    .isBoolean()
    .withMessage(VALIDATION_MESSAGES.INVALID_FORMAT)
];

module.exports = {
  createCategoryValidator,
  updateCategoryValidator,
  categoryIdValidator,
  getCategoryExpensesValidator,
  listCategoriesValidator
};
