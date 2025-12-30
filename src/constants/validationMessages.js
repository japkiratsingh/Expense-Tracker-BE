/**
 * Validation Messages
 * Centralized validation messages for input validation
 */

module.exports = {
  // Email Validation
  EMAIL: {
    REQUIRED: 'Email is required',
    INVALID: 'Please provide a valid email'
  },

  // Password Validation
  PASSWORD: {
    REQUIRED: 'Password is required',
    MIN_LENGTH: 'Password must be at least {{min}} characters long',
    MAX_LENGTH: 'Password must not exceed {{max}} characters'
  },

  // Name Validation
  FIRST_NAME: {
    REQUIRED: 'First name is required',
    EMPTY: 'First name cannot be empty',
    TOO_LONG: 'First name is too long'
  },

  LAST_NAME: {
    REQUIRED: 'Last name is required',
    EMPTY: 'Last name cannot be empty',
    TOO_LONG: 'Last name is too long'
  },

  // Token Validation
  TOKEN: {
    REQUIRED: 'Token is required',
    REFRESH_REQUIRED: 'Refresh token is required'
  },

  // Expense Validation (for future use)
  EXPENSE: {
    AMOUNT: {
      REQUIRED: 'Amount is required',
      POSITIVE: 'Amount must be a positive number'
    },
    DESCRIPTION: {
      REQUIRED: 'Description is required',
      TOO_LONG: 'Description is too long'
    },
    DATE: {
      INVALID: 'Invalid date format'
    }
  },

  // Tag Validation
  TAG: {
    NAME: {
      REQUIRED: 'Tag name is required',
      EMPTY: 'Tag name cannot be empty',
      TOO_LONG: 'Tag name must not exceed {{max}} characters',
      TOO_SHORT: 'Tag name must be at least {{min}} character'
    },
    COLOR: {
      INVALID: 'Color must be a valid hex color (e.g., #FF5733)'
    },
    ID: {
      REQUIRED: 'Tag ID is required',
      INVALID: 'Invalid tag ID format'
    },
    TARGET_TAG_ID: {
      REQUIRED: 'Target tag ID is required for merge operation'
    }
  }
};
