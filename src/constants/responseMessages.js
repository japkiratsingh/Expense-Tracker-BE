/**
 * Response Messages
 * Success messages for API responses
 */

module.exports = {
  // Authentication
  AUTH: {
    REGISTRATION_SUCCESS: 'User registered successfully',
    LOGIN_SUCCESS: 'Login successful',
    LOGOUT_SUCCESS: 'Logout successful',
    TOKEN_REFRESHED: 'Token refreshed successfully'
  },

  // General
  GENERAL: {
    SUCCESS: 'Operation completed successfully',
    API_RUNNING: 'API is running'
  },

  // User
  USER: {
    UPDATED: 'User updated successfully',
    DELETED: 'User deleted successfully',
    PASSWORD_CHANGED: 'Password changed successfully'
  },

  // Expense
  EXPENSE: {
    CREATED: 'Expense created successfully',
    UPDATED: 'Expense updated successfully',
    DELETED: 'Expense deleted successfully',
    FETCHED: 'Expense fetched successfully',
    LIST_FETCHED: 'Expenses list fetched successfully',
    EXPORTED: 'Expenses exported successfully',
    IMPORTED: 'Expenses imported successfully',
    STATS_FETCHED: 'Statistics fetched successfully'
  },

  // Category (for future use)
  CATEGORY: {
    CREATED: 'Category created successfully',
    UPDATED: 'Category updated successfully',
    DELETED: 'Category deleted successfully'
  },

  // Tag (for future use)
  TAG: {
    CREATED: 'Tag created successfully',
    UPDATED: 'Tag updated successfully',
    DELETED: 'Tag deleted successfully'
  }
};
