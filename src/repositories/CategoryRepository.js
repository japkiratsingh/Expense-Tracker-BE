/**
 * Category Repository
 * Data access layer for categories
 */

const path = require('path');
const BaseRepository = require('./BaseRepository');
const Category = require('../models/Category');
const config = require('../config');
const { CATEGORY_CONSTANTS } = require('../constants');

class CategoryRepository extends BaseRepository {
  constructor() {
    const filePath = path.join(config.DATA_DIR, 'categories.json');
    super(filePath, Category);
  }

  /**
   * Find all system categories
   */
  async findSystemCategories() {
    return this.find({ type: CATEGORY_CONSTANTS.TYPE.SYSTEM });
  }

  /**
   * Find all user categories for a specific user
   */
  async findUserCategories(userId) {
    return this.find({
      userId,
      type: CATEGORY_CONSTANTS.TYPE.USER
    });
  }

  /**
   * Find all active categories (system + user's own)
   */
  async findAllForUser(userId) {
    return this.find({
      $or: [
        { type: CATEGORY_CONSTANTS.TYPE.SYSTEM },
        { userId, type: CATEGORY_CONSTANTS.TYPE.USER }
      ],
      isActive: CATEGORY_CONSTANTS.STATUS.ACTIVE
    });
  }

  /**
   * Find category by name for a user (checks both system and user categories)
   */
  async findByName(name, userId = null) {
    const query = {
      name: { $regex: new RegExp(`^${name}$`, 'i') }
    };

    if (userId) {
      query.$or = [
        { type: CATEGORY_CONSTANTS.TYPE.SYSTEM },
        { userId, type: CATEGORY_CONSTANTS.TYPE.USER }
      ];
    } else {
      query.type = CATEGORY_CONSTANTS.TYPE.SYSTEM;
    }

    return this.findOne(query);
  }

  /**
   * Find subcategories of a parent category
   */
  async findSubcategories(parentCategoryId, userId = null) {
    const query = {
      parentCategoryId,
      isActive: CATEGORY_CONSTANTS.STATUS.ACTIVE
    };

    if (userId) {
      query.$or = [
        { type: CATEGORY_CONSTANTS.TYPE.SYSTEM },
        { userId, type: CATEGORY_CONSTANTS.TYPE.USER }
      ];
    }

    return this.find(query);
  }

  /**
   * Soft delete a category (only user categories)
   */
  async softDelete(id) {
    return this.updateById(id, {
      isActive: CATEGORY_CONSTANTS.STATUS.INACTIVE,
      updatedAt: new Date().toISOString()
    });
  }

  /**
   * Initialize system categories if they don't exist
   */
  async initializeSystemCategories() {
    const systemCategories = await this.findSystemCategories();

    if (systemCategories.length === 0) {
      const categoriesToCreate = CATEGORY_CONSTANTS.SYSTEM_CATEGORIES.map(cat =>
        new Category({
          ...cat,
          userId: null,
          type: CATEGORY_CONSTANTS.TYPE.SYSTEM
        })
      );

      for (const category of categoriesToCreate) {
        await this.create(category.toJSON());
      }

      return categoriesToCreate.length;
    }

    return 0;
  }

  /**
   * Count categories by user
   */
  async countUserCategories(userId) {
    return this.count({
      userId,
      type: CATEGORY_CONSTANTS.TYPE.USER,
      isActive: CATEGORY_CONSTANTS.STATUS.ACTIVE
    });
  }

  /**
   * Check if category belongs to user or is a system category
   */
  async belongsToUser(categoryId, userId) {
    const category = await this.findById(categoryId);

    if (!category) {
      return false;
    }

    return category.type === CATEGORY_CONSTANTS.TYPE.SYSTEM ||
           category.userId === userId;
  }
}

module.exports = CategoryRepository;
