const { param, body } = require('express-validator');

const expenseIdValidator = [
  param('expenseId')
    .exists().withMessage('Expense ID is required')
    .isUUID().withMessage('Invalid expense ID format')
];

const attachmentIdValidator = [
  param('id')
    .exists().withMessage('Attachment ID is required')
    .isUUID().withMessage('Invalid attachment ID format')
];

const uploadAttachmentValidator = [
  param('expenseId')
    .exists().withMessage('Expense ID is required')
    .isUUID().withMessage('Invalid expense ID format'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Description must not exceed 500 characters')
];

module.exports = {
  expenseIdValidator,
  attachmentIdValidator,
  uploadAttachmentValidator
};
