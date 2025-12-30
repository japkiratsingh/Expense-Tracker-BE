/**
 * Error Messages
 * Centralized error messages for consistent error handling
 */

module.exports = {
  // Authentication Errors
  AUTH: {
    EMAIL_ALREADY_REGISTERED: 'Email already registered',
    INVALID_CREDENTIALS: 'Invalid credentials',
    ACCOUNT_DEACTIVATED: 'Account is deactivated',
    NO_TOKEN_PROVIDED: 'No token provided',
    INVALID_TOKEN: 'Invalid token',
    TOKEN_EXPIRED: 'Token expired',
    INVALID_REFRESH_TOKEN: 'Invalid or expired refresh token',
    USER_NOT_FOUND: 'User not found'
  },

  // Validation Errors
  VALIDATION: {
    FAILED: 'Validation failed'
  },

  // General Errors
  GENERAL: {
    ROUTE_NOT_FOUND: 'Route {{route}} not found',
    INTERNAL_SERVER_ERROR: 'Internal Server Error'
  },

  // Expense Errors (for future use)
  EXPENSE: {
    NOT_FOUND: 'Expense not found',
    UNAUTHORIZED_ACCESS: 'Unauthorized to access this expense',
    CATEGORY_NOT_FOUND: 'Category not found',
    INVALID_CATEGORY: 'Invalid category',
    INVALID_TAG: 'Invalid tag',
    TAG_NOT_FOUND: 'Tag not found'
  },

  // Tag Errors
  TAG: {
    NOT_FOUND: 'Tag not found',
    UNAUTHORIZED_ACCESS: 'Unauthorized to access this tag',
    NAME_ALREADY_EXISTS: 'A tag with this name already exists',
    MAX_TAGS_REACHED: 'Maximum number of tags reached',
    INVALID_COLOR: 'Invalid color format',
    CANNOT_DELETE_IN_USE: 'Cannot delete tag that is in use by expenses',
    MERGE_TARGET_NOT_FOUND: 'Target tag for merge not found',
    CANNOT_MERGE_SAME_TAG: 'Cannot merge a tag with itself'
  }
};
