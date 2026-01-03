/**
 * Category Repository
 * Data access layer for categories
 */

const Category = require('../models/Category');
const { CATEGORY_CONSTANTS } = require('../constants');

class CategoryRepository {
  async findById(id) {
    return await Category.findById(id).lean();
  }

  async find(query = {}) {
    return await Category.find(query).lean();
  }

  async findOne(query) {
    return await Category.findOne(query).lean();
  }

  async create(data) {
    const category = new Category(data);
    await category.save();
    return category.toJSON();
  }

  async updateById(id, updates) {
    const category = await Category.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    ).lean();
    return category;
  }

  async deleteById(id) {
    const result = await Category.findByIdAndDelete(id);
    return !!result;
  }

  async count(query = {}) {
    return await Category.countDocuments(query);
  }

  /**
   * Find all system categories
   */
  async findSystemCategories() {
    return await this.find({ type: CATEGORY_CONSTANTS.TYPE.SYSTEM });
  }

  /**
   * Find all user categories for a specific user
   */
  async findUserCategories(userId) {
    return await this.find({
      userId,
      type: CATEGORY_CONSTANTS.TYPE.USER
    });
  }

  /**
   * Find all active categories (system + user's own)
   */
  async findAllForUser(userId) {
    return await Category.find({
      $or: [
        { type: CATEGORY_CONSTANTS.TYPE.SYSTEM },
        { userId, type: CATEGORY_CONSTANTS.TYPE.USER }
      ],
      isActive: CATEGORY_CONSTANTS.STATUS.ACTIVE
    }).lean();
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

    return await this.findOne(query);
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

    return await this.find(query);
  }

  /**
   * Soft delete a category (only user categories)
   */
  async softDelete(id) {
    return await this.updateById(id, {
      isActive: CATEGORY_CONSTANTS.STATUS.INACTIVE
    });
  }

  /**
   * Initialize system categories if they don't exist
   */
  async initializeSystemCategories() {
    const systemCategories = await this.findSystemCategories();

    if (systemCategories.length === 0) {
      const categoriesToCreate = CATEGORY_CONSTANTS.SYSTEM_CATEGORIES.map(cat => ({
        ...cat,
        userId: null,
        type: CATEGORY_CONSTANTS.TYPE.SYSTEM
      }));

      for (const categoryData of categoriesToCreate) {
        await this.create(categoryData);
      }

      return categoriesToCreate.length;
    }

    return 0;
  }

  /**
   * Count categories by user
   */
  async countUserCategories(userId) {
    return await this.count({
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
           (category.userId && category.userId.toString() === userId.toString());
  }
}

module.exports = new CategoryRepository();
