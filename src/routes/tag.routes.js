const express = require('express');
const router = express.Router();
const tagController = require('../controllers/tagController');
const { validate } = require('../middleware/validation');
const { authenticate } = require('../middleware/auth');
const {
  createTagValidator,
  updateTagValidator,
  tagIdValidator,
  mergeTagValidator
} = require('../validators/tagValidator');

// All tag routes require authentication
router.use(authenticate);

// Tag CRUD operations
router.post('/', createTagValidator, validate, tagController.createTag);
router.get('/', tagController.getAllTags);
router.get('/:id', tagIdValidator, validate, tagController.getTagById);
router.put('/:id', updateTagValidator, validate, tagController.updateTag);
router.delete('/:id', tagIdValidator, validate, tagController.deleteTag);

// Tag-specific operations
router.get('/:id/expenses', tagIdValidator, validate, tagController.getExpensesByTag);
router.patch('/:id/merge', mergeTagValidator, validate, tagController.mergeTags);

// Tag statistics (optional - for future enhancement)
// router.get('/:id/statistics', tagIdValidator, validate, tagController.getTagStatistics);

module.exports = router;
