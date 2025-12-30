/**
 * Category Model
 * Represents expense categories (both system and user-defined)
 */

const { v4: uuidv4 } = require('uuid');
const { CATEGORY_CONSTANTS } = require('../constants');

class Category {
  constructor(data = {}) {
    this._id = data._id || uuidv4();
    this.userId = data.userId !== undefined ? data.userId : null; // null for system categories
    this.name = data.name;
    this.description = data.description || '';
    this.color = data.color || CATEGORY_CONSTANTS.COLOR.DEFAULT;
    this.icon = data.icon || CATEGORY_CONSTANTS.ICON.DEFAULT;
    this.type = this.userId ? CATEGORY_CONSTANTS.TYPE.USER : CATEGORY_CONSTANTS.TYPE.SYSTEM;
    this.budget = data.budget || null;
    this.parentCategoryId = data.parentCategoryId || null;
    this.isActive = data.isActive !== undefined ? data.isActive : CATEGORY_CONSTANTS.STATUS.ACTIVE;
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }

  /**
   * Convert to plain object
   */
  toJSON() {
    return {
      _id: this._id,
      userId: this.userId,
      name: this.name,
      description: this.description,
      color: this.color,
      icon: this.icon,
      type: this.type,
      budget: this.budget,
      parentCategoryId: this.parentCategoryId,
      isActive: this.isActive,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  /**
   * Check if category is a system category
   */
  isSystemCategory() {
    return this.type === CATEGORY_CONSTANTS.TYPE.SYSTEM;
  }

  /**
   * Check if category is a user category
   */
  isUserCategory() {
    return this.type === CATEGORY_CONSTANTS.TYPE.USER;
  }

  /**
   * Check if category has a budget set
   */
  hasBudget() {
    return this.budget !== null && this.budget > CATEGORY_CONSTANTS.BUDGET.MIN_VALUE;
  }

  /**
   * Check if category is a subcategory
   */
  isSubcategory() {
    return this.parentCategoryId !== null;
  }

  /**
   * Update timestamp
   */
  touch() {
    this.updatedAt = new Date().toISOString();
  }

  /**
   * Validate category data
   */
  validate() {
    const errors = [];

    // Name validation
    if (!this.name || this.name.trim().length === 0) {
      errors.push(CATEGORY_CONSTANTS.VALIDATION.NAME_REQUIRED);
    } else if (this.name.length < CATEGORY_CONSTANTS.NAME.MIN_LENGTH) {
      errors.push(
        CATEGORY_CONSTANTS.VALIDATION.NAME_TOO_SHORT
          .replace('{{min}}', CATEGORY_CONSTANTS.NAME.MIN_LENGTH)
      );
    } else if (this.name.length > CATEGORY_CONSTANTS.NAME.MAX_LENGTH) {
      errors.push(
        CATEGORY_CONSTANTS.VALIDATION.NAME_TOO_LONG
          .replace('{{max}}', CATEGORY_CONSTANTS.NAME.MAX_LENGTH)
      );
    }

    // Description validation
    if (this.description && this.description.length > CATEGORY_CONSTANTS.DESCRIPTION.MAX_LENGTH) {
      errors.push(
        CATEGORY_CONSTANTS.VALIDATION.DESCRIPTION_TOO_LONG
          .replace('{{max}}', CATEGORY_CONSTANTS.DESCRIPTION.MAX_LENGTH)
      );
    }

    // Color validation
    if (this.color && !CATEGORY_CONSTANTS.COLOR.PATTERN.test(this.color)) {
      errors.push(CATEGORY_CONSTANTS.VALIDATION.COLOR_INVALID);
    }

    // Budget validation
    if (this.budget !== null) {
      if (typeof this.budget !== 'number' || this.budget < CATEGORY_CONSTANTS.BUDGET.MIN_VALUE) {
        errors.push(CATEGORY_CONSTANTS.VALIDATION.BUDGET_INVALID);
      } else if (this.budget > CATEGORY_CONSTANTS.BUDGET.MAX_VALUE) {
        errors.push(
          CATEGORY_CONSTANTS.VALIDATION.BUDGET_TOO_LARGE
            .replace('{{max}}', CATEGORY_CONSTANTS.BUDGET.MAX_VALUE)
        );
      }
    }

    // Icon validation
    if (this.icon && this.icon.length > CATEGORY_CONSTANTS.ICON.MAX_LENGTH) {
      errors.push(
        CATEGORY_CONSTANTS.VALIDATION.ICON_TOO_LONG
          .replace('{{max}}', CATEGORY_CONSTANTS.ICON.MAX_LENGTH)
      );
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

module.exports = Category;
