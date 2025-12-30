const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expenseController');
const { validate } = require('../middleware/validation');
const { authenticate } = require('../middleware/auth');
const {
  createExpenseValidator,
  updateExpenseValidator,
  expenseIdValidator,
  listExpensesValidator,
  exportExpensesValidator,
  importExpensesValidator
} = require('../validators/expenseValidator');

// All expense routes require authentication
router.use(authenticate);

// CRUD operations
router.post('/', createExpenseValidator, validate, expenseController.createExpense);
router.get('/', listExpensesValidator, validate, expenseController.getAllExpenses);
router.get('/search', listExpensesValidator, validate, expenseController.searchExpenses);
router.get('/:id', expenseIdValidator, validate, expenseController.getExpenseById);
router.put('/:id', updateExpenseValidator, validate, expenseController.updateExpense);
router.patch('/:id', updateExpenseValidator, validate, expenseController.updateExpense);
router.delete('/:id', expenseIdValidator, validate, expenseController.deleteExpense);

// Statistics endpoints
router.get('/stats/summary', expenseController.getSummaryStats);
router.get('/stats/by-category', expenseController.getCategoryStats);
router.get('/stats/by-tag', expenseController.getTagStats);
router.get('/stats/by-month', expenseController.getMonthlyStats);
router.get('/stats/trends', expenseController.getTrends);

// Export and Import
router.post('/export', exportExpensesValidator, validate, expenseController.exportExpenses);
router.post('/import', importExpensesValidator, validate, expenseController.importExpenses);

module.exports = router;
