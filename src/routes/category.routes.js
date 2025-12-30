/**
 * Category Routes
 * All routes related to category management
 */

const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { authenticate } = require('../middleware/auth');
const { validate } = require('../middleware/validation');
const {
  createCategoryValidator,
  updateCategoryValidator,
  categoryIdValidator,
  getCategoryExpensesValidator,
  listCategoriesValidator
} = require('../validators/categoryValidator');

/**
 * @route   GET /api/categories/overview
 * @desc    Get user's category overview
 * @access  Private
 */
router.get(
  '/overview',
  authenticate,
  categoryController.getCategoryOverview
);

/**
 * @route   POST /api/categories
 * @desc    Create a new category
 * @access  Private
 */
router.post(
  '/',
  authenticate,
  createCategoryValidator,
  validate,
  categoryController.createCategory
);

/**
 * @route   GET /api/categories
 * @desc    Get all categories (system + user's own)
 * @access  Private
 */
router.get(
  '/',
  authenticate,
  listCategoriesValidator,
  validate,
  categoryController.getAllCategories
);

/**
 * @route   GET /api/categories/:id
 * @desc    Get category by ID
 * @access  Private
 */
router.get(
  '/:id',
  authenticate,
  categoryIdValidator,
  validate,
  categoryController.getCategoryById
);

/**
 * @route   PUT /api/categories/:id
 * @desc    Update a category
 * @access  Private
 */
router.put(
  '/:id',
  authenticate,
  updateCategoryValidator,
  validate,
  categoryController.updateCategory
);

/**
 * @route   DELETE /api/categories/:id
 * @desc    Delete a category
 * @access  Private
 */
router.delete(
  '/:id',
  authenticate,
  categoryIdValidator,
  validate,
  categoryController.deleteCategory
);

/**
 * @route   GET /api/categories/:id/expenses
 * @desc    Get expenses in a category
 * @access  Private
 */
router.get(
  '/:id/expenses',
  authenticate,
  getCategoryExpensesValidator,
  validate,
  categoryController.getCategoryExpenses
);

/**
 * @route   GET /api/categories/:id/stats
 * @desc    Get category statistics
 * @access  Private
 */
router.get(
  '/:id/stats',
  authenticate,
  categoryIdValidator,
  validate,
  categoryController.getCategoryStatistics
);

module.exports = router;
