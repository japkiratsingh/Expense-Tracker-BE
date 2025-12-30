/**
 * Category Constants
 * All category-related constants
 */

module.exports = {
  // Category types
  TYPE: {
    SYSTEM: 'system',
    USER: 'user'
  },

  // System default categories
  SYSTEM_CATEGORIES: [
    {
      name: 'Food & Dining',
      color: '#FF6B6B',
      icon: 'restaurant',
      description: 'Restaurants, groceries, and food delivery'
    },
    {
      name: 'Transportation',
      color: '#4ECDC4',
      icon: 'directions_car',
      description: 'Gas, public transit, ride shares, and vehicle maintenance'
    },
    {
      name: 'Shopping',
      color: '#95E1D3',
      icon: 'shopping_cart',
      description: 'Clothing, electronics, and general shopping'
    },
    {
      name: 'Entertainment',
      color: '#F38181',
      icon: 'movie',
      description: 'Movies, concerts, hobbies, and subscriptions'
    },
    {
      name: 'Bills & Utilities',
      color: '#AA96DA',
      icon: 'receipt',
      description: 'Electricity, water, internet, and phone bills'
    },
    {
      name: 'Healthcare',
      color: '#FCBAD3',
      icon: 'local_hospital',
      description: 'Medical expenses, pharmacy, and insurance'
    },
    {
      name: 'Home',
      color: '#FFFFD2',
      icon: 'home',
      description: 'Rent, mortgage, furniture, and home improvement'
    },
    {
      name: 'Education',
      color: '#A8D8EA',
      icon: 'school',
      description: 'Tuition, books, courses, and training'
    },
    {
      name: 'Personal Care',
      color: '#FFDCB4',
      icon: 'spa',
      description: 'Salon, gym, beauty products, and wellness'
    },
    {
      name: 'Travel',
      color: '#B4E7CE',
      icon: 'flight',
      description: 'Flights, hotels, and vacation expenses'
    },
    {
      name: 'Income',
      color: '#90EE90',
      icon: 'attach_money',
      description: 'Salary, bonuses, and other income'
    },
    {
      name: 'Other',
      color: '#D3D3D3',
      icon: 'category',
      description: 'Miscellaneous expenses'
    }
  ],

  // Category name constraints
  NAME: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 50
  },

  // Category description constraints
  DESCRIPTION: {
    MAX_LENGTH: 200
  },

  // Category color format
  COLOR: {
    PATTERN: /^#[0-9A-Fa-f]{6}$/,
    DEFAULT: '#808080'
  },

  // Category icon constraints
  ICON: {
    MAX_LENGTH: 50,
    DEFAULT: 'category'
  },

  // Budget constraints
  BUDGET: {
    MIN_VALUE: 0,
    MAX_VALUE: 999999999.99
  },

  // Status
  STATUS: {
    ACTIVE: true,
    INACTIVE: false
  },

  // Validation messages specific to categories
  VALIDATION: {
    NAME_REQUIRED: 'Category name is required',
    NAME_TOO_SHORT: 'Category name must be at least {{min}} characters long',
    NAME_TOO_LONG: 'Category name must not exceed {{max}} characters',
    DESCRIPTION_TOO_LONG: 'Description must not exceed {{max}} characters',
    COLOR_INVALID: 'Color must be a valid hex color code (e.g., #FF5733)',
    BUDGET_INVALID: 'Budget must be a positive number',
    BUDGET_TOO_LARGE: 'Budget cannot exceed {{max}}',
    ICON_TOO_LONG: 'Icon name must not exceed {{max}} characters'
  },

  // Error messages specific to categories
  ERROR: {
    NOT_FOUND: 'Category not found',
    CANNOT_DELETE_SYSTEM: 'System categories cannot be deleted',
    CANNOT_MODIFY_SYSTEM: 'System categories cannot be modified',
    NAME_ALREADY_EXISTS: 'A category with this name already exists',
    IN_USE: 'Category is in use and cannot be deleted',
    UNAUTHORIZED: 'You are not authorized to access this category'
  },

  // Success messages specific to categories
  SUCCESS: {
    CREATED: 'Category created successfully',
    UPDATED: 'Category updated successfully',
    DELETED: 'Category deleted successfully',
    RETRIEVED: 'Category retrieved successfully',
    LIST_RETRIEVED: 'Categories retrieved successfully'
  }
};
