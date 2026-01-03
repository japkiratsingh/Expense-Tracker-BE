/**
 * Category Model
 * Represents expense categories (both system and user-defined)
 */

const mongoose = require('mongoose');
const { CATEGORY_CONSTANTS } = require('../constants');

const categorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null, // null for system categories
    index: true
  },
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: [CATEGORY_CONSTANTS.NAME.MIN_LENGTH, CATEGORY_CONSTANTS.VALIDATION.NAME_TOO_SHORT],
    maxlength: [CATEGORY_CONSTANTS.NAME.MAX_LENGTH, CATEGORY_CONSTANTS.VALIDATION.NAME_TOO_LONG]
  },
  description: {
    type: String,
    default: '',
    maxlength: [CATEGORY_CONSTANTS.DESCRIPTION.MAX_LENGTH, CATEGORY_CONSTANTS.VALIDATION.DESCRIPTION_TOO_LONG]
  },
  color: {
    type: String,
    default: CATEGORY_CONSTANTS.COLOR.DEFAULT,
    validate: {
      validator: function(v) {
        return CATEGORY_CONSTANTS.COLOR.PATTERN.test(v);
      },
      message: CATEGORY_CONSTANTS.VALIDATION.COLOR_INVALID
    }
  },
  icon: {
    type: String,
    default: CATEGORY_CONSTANTS.ICON.DEFAULT,
    maxlength: [CATEGORY_CONSTANTS.ICON.MAX_LENGTH, CATEGORY_CONSTANTS.VALIDATION.ICON_TOO_LONG]
  },
  type: {
    type: String,
    enum: [CATEGORY_CONSTANTS.TYPE.SYSTEM, CATEGORY_CONSTANTS.TYPE.USER],
    required: true
  },
  budget: {
    type: Number,
    default: null,
    min: [CATEGORY_CONSTANTS.BUDGET.MIN_VALUE, CATEGORY_CONSTANTS.VALIDATION.BUDGET_INVALID],
    max: [CATEGORY_CONSTANTS.BUDGET.MAX_VALUE, CATEGORY_CONSTANTS.VALIDATION.BUDGET_TOO_LARGE]
  },
  parentCategoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    default: null
  },
  isActive: {
    type: Boolean,
    default: CATEGORY_CONSTANTS.STATUS.ACTIVE
  }
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      ret._id = ret._id.toString();
      if (ret.userId) ret.userId = ret.userId.toString();
      if (ret.parentCategoryId) ret.parentCategoryId = ret.parentCategoryId.toString();
      delete ret.__v;
      return ret;
    }
  }
});

// Set type based on userId before validation
categorySchema.pre('validate', function(next) {
  if (!this.type) {
    this.type = this.userId ? CATEGORY_CONSTANTS.TYPE.USER : CATEGORY_CONSTANTS.TYPE.SYSTEM;
  }
  next();
});

// Add indexes for efficient queries
categorySchema.index({ userId: 1, name: 1 });
categorySchema.index({ type: 1 });
categorySchema.index({ userId: 1, isActive: 1 });

// Instance methods
categorySchema.methods.isSystemCategory = function() {
  return this.type === CATEGORY_CONSTANTS.TYPE.SYSTEM;
};

categorySchema.methods.isUserCategory = function() {
  return this.type === CATEGORY_CONSTANTS.TYPE.USER;
};

categorySchema.methods.hasBudget = function() {
  return this.budget !== null && this.budget > CATEGORY_CONSTANTS.BUDGET.MIN_VALUE;
};

categorySchema.methods.isSubcategory = function() {
  return this.parentCategoryId !== null;
};

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
