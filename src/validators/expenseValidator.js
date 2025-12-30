const { body, param, query } = require('express-validator');
const {
  VALIDATION_MESSAGES,
  EXPENSE_CONSTANTS
} = require('../constants');

const createExpenseValidator = [
  body('amount')
    .exists().withMessage(VALIDATION_MESSAGES.EXPENSE.AMOUNT.REQUIRED)
    .isFloat({ min: EXPENSE_CONSTANTS.AMOUNT.MIN })
    .withMessage(
      VALIDATION_MESSAGES.EXPENSE.AMOUNT.MIN
        .replace('{{min}}', EXPENSE_CONSTANTS.AMOUNT.MIN)
    )
    .isFloat({ max: EXPENSE_CONSTANTS.AMOUNT.MAX })
    .withMessage(
      VALIDATION_MESSAGES.EXPENSE.AMOUNT.TOO_LARGE
        .replace('{{max}}', EXPENSE_CONSTANTS.AMOUNT.MAX)
    ),
  body('description')
    .exists().withMessage(VALIDATION_MESSAGES.EXPENSE.DESCRIPTION.REQUIRED)
    .trim()
    .notEmpty().withMessage(VALIDATION_MESSAGES.EXPENSE.DESCRIPTION.EMPTY)
    .isLength({ min: EXPENSE_CONSTANTS.FIELD_LENGTHS.DESCRIPTION_MIN })
    .withMessage(
      VALIDATION_MESSAGES.EXPENSE.DESCRIPTION.TOO_SHORT
        .replace('{{min}}', EXPENSE_CONSTANTS.FIELD_LENGTHS.DESCRIPTION_MIN)
    )
    .isLength({ max: EXPENSE_CONSTANTS.FIELD_LENGTHS.DESCRIPTION_MAX })
    .withMessage(
      VALIDATION_MESSAGES.EXPENSE.DESCRIPTION.TOO_LONG
        .replace('{{max}}', EXPENSE_CONSTANTS.FIELD_LENGTHS.DESCRIPTION_MAX)
    ),
  body('date')
    .optional()
    .matches(/^\d{4}-\d{2}-\d{2}$/)
    .withMessage(VALIDATION_MESSAGES.EXPENSE.DATE.INVALID),
  body('categoryId')
    .optional()
    .isUUID().withMessage(VALIDATION_MESSAGES.EXPENSE.CATEGORY.INVALID),
  body('tags')
    .optional()
    .isArray().withMessage(VALIDATION_MESSAGES.EXPENSE.TAGS.INVALID),
  body('tags.*')
    .optional()
    .isUUID().withMessage(VALIDATION_MESSAGES.EXPENSE.TAGS.INVALID),
  body('paymentMethod')
    .optional()
    .isIn(Object.values(EXPENSE_CONSTANTS.PAYMENT_METHODS))
    .withMessage(VALIDATION_MESSAGES.EXPENSE.PAYMENT_METHOD.INVALID),
  body('notes')
    .optional()
    .isLength({ max: EXPENSE_CONSTANTS.FIELD_LENGTHS.NOTES_MAX })
    .withMessage(
      VALIDATION_MESSAGES.EXPENSE.NOTES.TOO_LONG
        .replace('{{max}}', EXPENSE_CONSTANTS.FIELD_LENGTHS.NOTES_MAX)
    )
];

const updateExpenseValidator = [
  param('id')
    .exists().withMessage(VALIDATION_MESSAGES.EXPENSE.ID.REQUIRED)
    .isUUID().withMessage(VALIDATION_MESSAGES.EXPENSE.ID.INVALID),
  body('amount')
    .optional()
    .isFloat({ min: EXPENSE_CONSTANTS.AMOUNT.MIN })
    .withMessage(
      VALIDATION_MESSAGES.EXPENSE.AMOUNT.MIN
        .replace('{{min}}', EXPENSE_CONSTANTS.AMOUNT.MIN)
    )
    .isFloat({ max: EXPENSE_CONSTANTS.AMOUNT.MAX })
    .withMessage(
      VALIDATION_MESSAGES.EXPENSE.AMOUNT.TOO_LARGE
        .replace('{{max}}', EXPENSE_CONSTANTS.AMOUNT.MAX)
    ),
  body('description')
    .optional()
    .trim()
    .notEmpty().withMessage(VALIDATION_MESSAGES.EXPENSE.DESCRIPTION.EMPTY)
    .isLength({ min: EXPENSE_CONSTANTS.FIELD_LENGTHS.DESCRIPTION_MIN })
    .withMessage(
      VALIDATION_MESSAGES.EXPENSE.DESCRIPTION.TOO_SHORT
        .replace('{{min}}', EXPENSE_CONSTANTS.FIELD_LENGTHS.DESCRIPTION_MIN)
    )
    .isLength({ max: EXPENSE_CONSTANTS.FIELD_LENGTHS.DESCRIPTION_MAX })
    .withMessage(
      VALIDATION_MESSAGES.EXPENSE.DESCRIPTION.TOO_LONG
        .replace('{{max}}', EXPENSE_CONSTANTS.FIELD_LENGTHS.DESCRIPTION_MAX)
    ),
  body('date')
    .optional()
    .matches(/^\d{4}-\d{2}-\d{2}$/)
    .withMessage(VALIDATION_MESSAGES.EXPENSE.DATE.INVALID),
  body('categoryId')
    .optional()
    .isUUID().withMessage(VALIDATION_MESSAGES.EXPENSE.CATEGORY.INVALID),
  body('tags')
    .optional()
    .isArray().withMessage(VALIDATION_MESSAGES.EXPENSE.TAGS.INVALID),
  body('tags.*')
    .optional()
    .isUUID().withMessage(VALIDATION_MESSAGES.EXPENSE.TAGS.INVALID),
  body('paymentMethod')
    .optional()
    .isIn(Object.values(EXPENSE_CONSTANTS.PAYMENT_METHODS))
    .withMessage(VALIDATION_MESSAGES.EXPENSE.PAYMENT_METHOD.INVALID),
  body('notes')
    .optional()
    .isLength({ max: EXPENSE_CONSTANTS.FIELD_LENGTHS.NOTES_MAX })
    .withMessage(
      VALIDATION_MESSAGES.EXPENSE.NOTES.TOO_LONG
        .replace('{{max}}', EXPENSE_CONSTANTS.FIELD_LENGTHS.NOTES_MAX)
    )
];

const expenseIdValidator = [
  param('id')
    .exists().withMessage(VALIDATION_MESSAGES.EXPENSE.ID.REQUIRED)
    .isUUID().withMessage(VALIDATION_MESSAGES.EXPENSE.ID.INVALID)
];

const listExpensesValidator = [
  query('page')
    .optional()
    .isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: EXPENSE_CONSTANTS.PAGINATION.MAX_LIMIT })
    .withMessage(`Limit must be between 1 and ${EXPENSE_CONSTANTS.PAGINATION.MAX_LIMIT}`),
  query('sortBy')
    .optional()
    .isIn(Object.values(EXPENSE_CONSTANTS.SORT_FIELDS))
    .withMessage('Invalid sort field'),
  query('sortOrder')
    .optional()
    .isIn(Object.values(EXPENSE_CONSTANTS.SORT_ORDERS))
    .withMessage('Sort order must be either asc or desc'),
  query('categoryId')
    .optional()
    .isUUID().withMessage(VALIDATION_MESSAGES.EXPENSE.CATEGORY.INVALID),
  query('startDate')
    .optional()
    .matches(/^\d{4}-\d{2}-\d{2}$/)
    .withMessage(VALIDATION_MESSAGES.EXPENSE.DATE.INVALID),
  query('endDate')
    .optional()
    .matches(/^\d{4}-\d{2}-\d{2}$/)
    .withMessage(VALIDATION_MESSAGES.EXPENSE.DATE.INVALID),
  query('minAmount')
    .optional()
    .isFloat({ min: 0 }).withMessage('Minimum amount must be a positive number'),
  query('maxAmount')
    .optional()
    .isFloat({ min: 0 }).withMessage('Maximum amount must be a positive number'),
  query('paymentMethod')
    .optional()
    .isIn(Object.values(EXPENSE_CONSTANTS.PAYMENT_METHODS))
    .withMessage(VALIDATION_MESSAGES.EXPENSE.PAYMENT_METHOD.INVALID)
];

const exportExpensesValidator = [
  body('format')
    .exists().withMessage('Export format is required')
    .isIn(Object.values(EXPENSE_CONSTANTS.EXPORT_FORMATS))
    .withMessage(VALIDATION_MESSAGES.EXPENSE.EXPORT_FORMAT.INVALID),
  body('startDate')
    .optional()
    .matches(/^\d{4}-\d{2}-\d{2}$/)
    .withMessage(VALIDATION_MESSAGES.EXPENSE.DATE.INVALID),
  body('endDate')
    .optional()
    .matches(/^\d{4}-\d{2}-\d{2}$/)
    .withMessage(VALIDATION_MESSAGES.EXPENSE.DATE.INVALID)
];

const importExpensesValidator = [
  body('expenses')
    .exists().withMessage('Expenses array is required')
    .isArray().withMessage('Expenses must be an array'),
  body('expenses.*.amount')
    .exists().withMessage('Amount is required for all expenses')
    .isFloat({ min: EXPENSE_CONSTANTS.AMOUNT.MIN })
    .withMessage('Amount must be a positive number'),
  body('expenses.*.description')
    .exists().withMessage('Description is required for all expenses')
    .trim()
    .notEmpty().withMessage('Description cannot be empty'),
  body('expenses.*.date')
    .optional()
    .matches(/^\d{4}-\d{2}-\d{2}$/)
    .withMessage('Date must be in YYYY-MM-DD format')
];

module.exports = {
  createExpenseValidator,
  updateExpenseValidator,
  expenseIdValidator,
  listExpensesValidator,
  exportExpensesValidator,
  importExpensesValidator
};
