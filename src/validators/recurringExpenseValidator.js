const { body, param } = require('express-validator');
const {
  VALIDATION_MESSAGES,
  RECURRING_CONSTANTS
} = require('../constants');

const createRecurringValidator = [
  body('amount')
    .exists().withMessage(VALIDATION_MESSAGES.EXPENSE.AMOUNT.REQUIRED)
    .isFloat({ min: 0.01 }).withMessage(VALIDATION_MESSAGES.EXPENSE.AMOUNT.POSITIVE),
  body('description')
    .exists().withMessage(VALIDATION_MESSAGES.EXPENSE.DESCRIPTION.REQUIRED)
    .trim()
    .notEmpty().withMessage(VALIDATION_MESSAGES.EXPENSE.DESCRIPTION.REQUIRED)
    .isLength({ max: RECURRING_CONSTANTS.FIELD_LENGTHS.DESCRIPTION_MAX })
    .withMessage('Description is too long'),
  body('frequency')
    .exists().withMessage(VALIDATION_MESSAGES.RECURRING.FREQUENCY.REQUIRED)
    .isIn(Object.values(RECURRING_CONSTANTS.FREQUENCIES))
    .withMessage(VALIDATION_MESSAGES.RECURRING.FREQUENCY.INVALID),
  body('startDate')
    .exists().withMessage(VALIDATION_MESSAGES.RECURRING.START_DATE.REQUIRED)
    .matches(/^\d{4}-\d{2}-\d{2}$/)
    .withMessage(VALIDATION_MESSAGES.RECURRING.START_DATE.INVALID),
  body('endDate')
    .optional()
    .matches(/^\d{4}-\d{2}-\d{2}$/)
    .withMessage(VALIDATION_MESSAGES.RECURRING.END_DATE.INVALID),
  body('categoryId')
    .optional()
    .isUUID().withMessage(VALIDATION_MESSAGES.EXPENSE.CATEGORY.INVALID),
  body('tags')
    .optional()
    .isArray().withMessage(VALIDATION_MESSAGES.EXPENSE.TAGS.INVALID),
  body('paymentMethod')
    .optional(),
  body('notes')
    .optional()
    .isLength({ max: RECURRING_CONSTANTS.FIELD_LENGTHS.NOTES_MAX })
    .withMessage('Notes are too long'),
  body('dayOfMonth')
    .optional()
    .isInt({ min: 1, max: 31 })
    .withMessage(VALIDATION_MESSAGES.RECURRING.DAY_OF_MONTH.INVALID),
  body('dayOfWeek')
    .optional()
    .isInt({ min: 0, max: 6 })
    .withMessage(VALIDATION_MESSAGES.RECURRING.DAY_OF_WEEK.INVALID),
  body('intervalCount')
    .optional()
    .isInt({ min: RECURRING_CONSTANTS.LIMITS.INTERVAL_MIN, max: RECURRING_CONSTANTS.LIMITS.INTERVAL_MAX })
    .withMessage(
      VALIDATION_MESSAGES.RECURRING.INTERVAL.INVALID
        .replace('{{min}}', RECURRING_CONSTANTS.LIMITS.INTERVAL_MIN)
        .replace('{{max}}', RECURRING_CONSTANTS.LIMITS.INTERVAL_MAX)
    )
];

const updateRecurringValidator = [
  param('id')
    .exists().withMessage('Recurring expense ID is required')
    .isUUID().withMessage('Invalid recurring expense ID format'),
  body('amount')
    .optional()
    .isFloat({ min: 0.01 }).withMessage(VALIDATION_MESSAGES.EXPENSE.AMOUNT.POSITIVE),
  body('description')
    .optional()
    .trim()
    .notEmpty().withMessage(VALIDATION_MESSAGES.EXPENSE.DESCRIPTION.REQUIRED)
    .isLength({ max: RECURRING_CONSTANTS.FIELD_LENGTHS.DESCRIPTION_MAX })
    .withMessage('Description is too long'),
  body('frequency')
    .optional()
    .isIn(Object.values(RECURRING_CONSTANTS.FREQUENCIES))
    .withMessage(VALIDATION_MESSAGES.RECURRING.FREQUENCY.INVALID),
  body('startDate')
    .optional()
    .matches(/^\d{4}-\d{2}-\d{2}$/)
    .withMessage(VALIDATION_MESSAGES.RECURRING.START_DATE.INVALID),
  body('endDate')
    .optional()
    .matches(/^\d{4}-\d{2}-\d{2}$/)
    .withMessage(VALIDATION_MESSAGES.RECURRING.END_DATE.INVALID),
  body('categoryId')
    .optional()
    .isUUID().withMessage(VALIDATION_MESSAGES.EXPENSE.CATEGORY.INVALID),
  body('tags')
    .optional()
    .isArray().withMessage(VALIDATION_MESSAGES.EXPENSE.TAGS.INVALID),
  body('dayOfMonth')
    .optional()
    .isInt({ min: 1, max: 31 })
    .withMessage(VALIDATION_MESSAGES.RECURRING.DAY_OF_MONTH.INVALID),
  body('dayOfWeek')
    .optional()
    .isInt({ min: 0, max: 6 })
    .withMessage(VALIDATION_MESSAGES.RECURRING.DAY_OF_WEEK.INVALID),
  body('intervalCount')
    .optional()
    .isInt({ min: RECURRING_CONSTANTS.LIMITS.INTERVAL_MIN, max: RECURRING_CONSTANTS.LIMITS.INTERVAL_MAX })
    .withMessage(
      VALIDATION_MESSAGES.RECURRING.INTERVAL.INVALID
        .replace('{{min}}', RECURRING_CONSTANTS.LIMITS.INTERVAL_MIN)
        .replace('{{max}}', RECURRING_CONSTANTS.LIMITS.INTERVAL_MAX)
    )
];

const recurringIdValidator = [
  param('id')
    .exists().withMessage('Recurring expense ID is required')
    .isUUID().withMessage('Invalid recurring expense ID format')
];

module.exports = {
  createRecurringValidator,
  updateRecurringValidator,
  recurringIdValidator
};
