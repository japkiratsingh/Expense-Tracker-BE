const express = require('express');
const router = express.Router();
const attachmentController = require('../controllers/attachmentController');
const { validate } = require('../middleware/validation');
const { authenticate } = require('../middleware/auth');
const { upload, handleMulterError } = require('../middleware/upload');
const {
  expenseIdValidator,
  attachmentIdValidator,
  uploadAttachmentValidator
} = require('../validators/attachmentValidator');

// All routes require authentication
router.use(authenticate);

// Get user storage statistics
router.get('/storage-stats', attachmentController.getStorageStats);

// Attachment operations by ID
router.get('/:id', attachmentIdValidator, validate, attachmentController.getAttachmentById);
router.delete('/:id', attachmentIdValidator, validate, attachmentController.deleteAttachment);
router.get('/:id/download', attachmentIdValidator, validate, attachmentController.downloadAttachment);
router.get('/:id/thumbnail', attachmentIdValidator, validate, attachmentController.getThumbnail);

// Expense-specific attachment operations
// Upload must be mounted separately to handle multer errors
router.post(
  '/expenses/:expenseId',
  upload.single('file'),
  handleMulterError,
  uploadAttachmentValidator,
  validate,
  attachmentController.uploadAttachment
);

router.get(
  '/expenses/:expenseId',
  expenseIdValidator,
  validate,
  attachmentController.getExpenseAttachments
);

module.exports = router;
