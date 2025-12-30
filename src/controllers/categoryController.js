/**
 * Category Controller
 * Request handlers for category endpoints
 */

const categoryService = require('../services/categoryService');
const { HTTP_STATUS, CATEGORY_CONSTANTS, COMMON_CONSTANTS } = require('../constants');

/**
 * Create a new category
 * @route POST /api/categories
 */
const createCategory = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const categoryData = req.body;

    const category = await categoryService.createCategory(userId, categoryData);

    res.status(HTTP_STATUS.CREATED).json({
      success: COMMON_CONSTANTS.RESPONSE_STATUS.SUCCESS,
      message: CATEGORY_CONSTANTS.SUCCESS.CREATED,
      data: { category }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all categories (system + user's own)
 * @route GET /api/categories
 */
const getAllCategories = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const categories = await categoryService.getAllCategories(userId);

    res.status(HTTP_STATUS.OK).json({
      success: COMMON_CONSTANTS.RESPONSE_STATUS.SUCCESS,
      message: CATEGORY_CONSTANTS.SUCCESS.LIST_RETRIEVED,
      data: {
        categories,
        count: categories.length
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get category by ID
 * @route GET /api/categories/:id
 */
const getCategoryById = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;

    const category = await categoryService.getCategoryById(id, userId);

    res.status(HTTP_STATUS.OK).json({
      success: COMMON_CONSTANTS.RESPONSE_STATUS.SUCCESS,
      message: CATEGORY_CONSTANTS.SUCCESS.RETRIEVED,
      data: { category }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update a category
 * @route PUT /api/categories/:id
 */
const updateCategory = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;
    const updates = req.body;

    const category = await categoryService.updateCategory(id, userId, updates);

    res.status(HTTP_STATUS.OK).json({
      success: COMMON_CONSTANTS.RESPONSE_STATUS.SUCCESS,
      message: CATEGORY_CONSTANTS.SUCCESS.UPDATED,
      data: { category }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a category
 * @route DELETE /api/categories/:id
 */
const deleteCategory = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;

    await categoryService.deleteCategory(id, userId);

    res.status(HTTP_STATUS.OK).json({
      success: COMMON_CONSTANTS.RESPONSE_STATUS.SUCCESS,
      message: CATEGORY_CONSTANTS.SUCCESS.DELETED,
      data: null
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get expenses in a category
 * @route GET /api/categories/:id/expenses
 */
const getCategoryExpenses = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;
    const filters = req.query;

    const result = await categoryService.getCategoryExpenses(id, userId, filters);

    res.status(HTTP_STATUS.OK).json({
      success: COMMON_CONSTANTS.RESPONSE_STATUS.SUCCESS,
      message: 'Category expenses retrieved successfully',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get category statistics
 * @route GET /api/categories/:id/stats
 */
const getCategoryStatistics = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;

    const statistics = await categoryService.getCategoryStatistics(id, userId);

    res.status(HTTP_STATUS.OK).json({
      success: COMMON_CONSTANTS.RESPONSE_STATUS.SUCCESS,
      message: 'Category statistics retrieved successfully',
      data: { statistics }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get user's category overview
 * @route GET /api/categories/overview
 */
const getCategoryOverview = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const overview = await categoryService.getUserCategoryOverview(userId);

    res.status(HTTP_STATUS.OK).json({
      success: COMMON_CONSTANTS.RESPONSE_STATUS.SUCCESS,
      message: 'Category overview retrieved successfully',
      data: overview
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
  getCategoryExpenses,
  getCategoryStatistics,
  getCategoryOverview
};
