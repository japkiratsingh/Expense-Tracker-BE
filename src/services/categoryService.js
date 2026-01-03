/**
 * Category Service
 * Business logic for category management
 */

const categoryRepository = require('../repositories/CategoryRepository');
const Category = require('../models/Category');
const AppError = require('../utils/AppError');
const { HTTP_STATUS, CATEGORY_CONSTANTS } = require('../constants');

class CategoryService {
  constructor() {
    this.categoryRepository = categoryRepository;
  }

  /**
   * Initialize system categories if needed
   */
  async initializeSystemCategories() {
    return this.categoryRepository.initializeSystemCategories();
  }

  /**
   * Create a new user category
   */
  async createCategory(userId, categoryData) {
    // Create category instance
    const category = new Category({
      ...categoryData,
      userId,
      type: CATEGORY_CONSTANTS.TYPE.USER
    });

    // Validate category
    const validation = category.validate();
    if (!validation.isValid) {
      throw new AppError(validation.errors.join(', '), HTTP_STATUS.BAD_REQUEST);
    }

    // Check if category with same name already exists for this user
    const existingCategory = await this.categoryRepository.findByName(
      category.name,
      userId
    );

    if (existingCategory) {
      throw new AppError(
        CATEGORY_CONSTANTS.ERROR.NAME_ALREADY_EXISTS,
        HTTP_STATUS.BAD_REQUEST
      );
    }

    // If parentCategoryId is provided, verify it exists and user has access
    if (category.parentCategoryId) {
      const parentCategory = await this.categoryRepository.findById(
        category.parentCategoryId
      );

      if (!parentCategory) {
        throw new AppError(
          CATEGORY_CONSTANTS.ERROR.NOT_FOUND,
          HTTP_STATUS.NOT_FOUND
        );
      }

      const hasAccess = await this.categoryRepository.belongsToUser(
        category.parentCategoryId,
        userId
      );

      if (!hasAccess) {
        throw new AppError(
          CATEGORY_CONSTANTS.ERROR.UNAUTHORIZED,
          HTTP_STATUS.FORBIDDEN
        );
      }
    }

    // Create category
    const createdCategory = await this.categoryRepository.create(category.toJSON());

    return createdCategory;
  }

  /**
   * Get all categories for a user (system + user's own)
   */
  async getAllCategories(userId) {
    // Initialize system categories if needed
    await this.initializeSystemCategories();

    const categories = await this.categoryRepository.findAllForUser(userId);

    return categories;
  }

  /**
   * Get category by ID
   */
  async getCategoryById(categoryId, userId) {
    const category = await this.categoryRepository.findById(categoryId);

    if (!category) {
      throw new AppError(
        CATEGORY_CONSTANTS.ERROR.NOT_FOUND,
        HTTP_STATUS.NOT_FOUND
      );
    }

    // Check if user has access to this category
    const hasAccess = await this.categoryRepository.belongsToUser(categoryId, userId);

    if (!hasAccess) {
      throw new AppError(
        CATEGORY_CONSTANTS.ERROR.UNAUTHORIZED,
        HTTP_STATUS.FORBIDDEN
      );
    }

    return category;
  }

  /**
   * Update a category
   */
  async updateCategory(categoryId, userId, updates) {
    const category = await this.categoryRepository.findById(categoryId);

    if (!category) {
      throw new AppError(
        CATEGORY_CONSTANTS.ERROR.NOT_FOUND,
        HTTP_STATUS.NOT_FOUND
      );
    }

    // Check if it's a system category
    if (category.type === CATEGORY_CONSTANTS.TYPE.SYSTEM) {
      throw new AppError(
        CATEGORY_CONSTANTS.ERROR.CANNOT_MODIFY_SYSTEM,
        HTTP_STATUS.FORBIDDEN
      );
    }

    // Check if user owns this category
    if (category.userId !== userId) {
      throw new AppError(
        CATEGORY_CONSTANTS.ERROR.UNAUTHORIZED,
        HTTP_STATUS.FORBIDDEN
      );
    }

    // If name is being updated, check for duplicates
    if (updates.name && updates.name !== category.name) {
      const existingCategory = await this.categoryRepository.findByName(
        updates.name,
        userId
      );

      if (existingCategory && existingCategory._id !== categoryId) {
        throw new AppError(
          CATEGORY_CONSTANTS.ERROR.NAME_ALREADY_EXISTS,
          HTTP_STATUS.BAD_REQUEST
        );
      }
    }

    // Create updated category instance for validation
    const updatedCategory = new Category({
      ...category,
      ...updates,
      _id: categoryId,
      userId,
      type: CATEGORY_CONSTANTS.TYPE.USER,
      updatedAt: new Date().toISOString()
    });

    // Validate
    const validation = updatedCategory.validate();
    if (!validation.isValid) {
      throw new AppError(validation.errors.join(', '), HTTP_STATUS.BAD_REQUEST);
    }

    // Update category
    const result = await this.categoryRepository.updateById(
      categoryId,
      updatedCategory.toJSON()
    );

    return result;
  }

  /**
   * Delete a category (soft delete)
   */
  async deleteCategory(categoryId, userId) {
    const category = await this.categoryRepository.findById(categoryId);

    if (!category) {
      throw new AppError(
        CATEGORY_CONSTANTS.ERROR.NOT_FOUND,
        HTTP_STATUS.NOT_FOUND
      );
    }

    // Check if it's a system category
    if (category.type === CATEGORY_CONSTANTS.TYPE.SYSTEM) {
      throw new AppError(
        CATEGORY_CONSTANTS.ERROR.CANNOT_DELETE_SYSTEM,
        HTTP_STATUS.FORBIDDEN
      );
    }

    // Check if user owns this category
    if (category.userId !== userId) {
      throw new AppError(
        CATEGORY_CONSTANTS.ERROR.UNAUTHORIZED,
        HTTP_STATUS.FORBIDDEN
      );
    }

    // Soft delete (mark as inactive)
    await this.categoryRepository.softDelete(categoryId);

    return { deleted: true };
  }

  /**
   * Get expenses in a category (placeholder for now)
   * This will be implemented when we add the expense feature
   */
  async getCategoryExpenses(categoryId, userId, filters = {}) {
    // Verify category exists and user has access
    await this.getCategoryById(categoryId, userId);

    // TODO: Implement when expense repository is available
    // For now, return empty array
    return {
      expenses: [],
      total: 0,
      message: 'Expense feature not yet implemented'
    };
  }

  /**
   * Get category statistics (placeholder for now)
   * This will be fully implemented when we add the expense feature
   */
  async getCategoryStatistics(categoryId, userId) {
    // Verify category exists and user has access
    const category = await this.getCategoryById(categoryId, userId);

    // TODO: Implement real statistics when expense repository is available
    // For now, return basic structure
    return {
      categoryId: category._id,
      categoryName: category.name,
      budget: category.budget,
      totalExpenses: 0,
      expenseCount: 0,
      averageExpense: 0,
      budgetUsedPercentage: 0,
      remainingBudget: category.budget || 0,
      message: 'Statistics will be calculated once expenses are tracked'
    };
  }

  /**
   * Get user's category statistics overview
   */
  async getUserCategoryOverview(userId) {
    const categories = await this.getAllCategories(userId);

    const systemCount = categories.filter(
      c => c.type === CATEGORY_CONSTANTS.TYPE.SYSTEM
    ).length;

    const userCount = categories.filter(
      c => c.type === CATEGORY_CONSTANTS.TYPE.USER
    ).length;

    const withBudget = categories.filter(c => c.budget && c.budget > 0).length;

    return {
      totalCategories: categories.length,
      systemCategories: systemCount,
      userCategories: userCount,
      categoriesWithBudget: withBudget,
      categories: categories
    };
  }
}

module.exports = new CategoryService();
