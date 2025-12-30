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
    },
    CATEGORY: {
      INVALID: 'Category ID must be a valid UUID'
    },
    TAGS: {
      INVALID: 'Tags must be an array'
    }
  },

  // Recurring Expense Validation
  RECURRING: {
    FREQUENCY: {
      REQUIRED: 'Frequency is required',
      INVALID: 'Frequency must be one of: daily, weekly, monthly, yearly'
    },
    START_DATE: {
      REQUIRED: 'Start date is required',
      INVALID: 'Start date must be in YYYY-MM-DD format'
    },
    END_DATE: {
      INVALID: 'End date must be in YYYY-MM-DD format',
      BEFORE_START: 'End date must be after start date'
    },
    INTERVAL: {
      INVALID: 'Interval count must be between {{min}} and {{max}}'
    },
    DAY_OF_MONTH: {
      INVALID: 'Day of month must be between 1 and 31'
    },
    DAY_OF_WEEK: {
      INVALID: 'Day of week must be between 0 (Sunday) and 6 (Saturday)'
    }
  }
};
