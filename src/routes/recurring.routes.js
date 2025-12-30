const express = require('express');
const router = express.Router();
const recurringExpenseController = require('../controllers/recurringExpenseController');
const { validate } = require('../middleware/validation');
const { authenticate } = require('../middleware/auth');
const {
  createRecurringValidator,
  updateRecurringValidator,
  recurringIdValidator
} = require('../validators/recurringExpenseValidator');

// All routes require authentication
router.use(authenticate);

// Get upcoming recurring expenses (must be before /:id to avoid route conflicts)
router.get('/upcoming', recurringExpenseController.getUpcoming);

// CRUD operations
router.post('/', createRecurringValidator, validate, recurringExpenseController.createRecurring);
router.get('/', recurringExpenseController.getAllRecurring);
router.get('/:id', recurringIdValidator, validate, recurringExpenseController.getRecurringById);
router.put('/:id', updateRecurringValidator, validate, recurringExpenseController.updateRecurring);
router.delete('/:id', recurringIdValidator, validate, recurringExpenseController.deleteRecurring);

// State management
router.put('/:id/pause', recurringIdValidator, validate, recurringExpenseController.pauseRecurring);
router.put('/:id/resume', recurringIdValidator, validate, recurringExpenseController.resumeRecurring);

// Expense generation
router.post('/:id/generate', recurringIdValidator, validate, recurringExpenseController.generateExpense);
router.get('/:id/history', recurringIdValidator, validate, recurringExpenseController.getGeneratedHistory);

module.exports = router;
