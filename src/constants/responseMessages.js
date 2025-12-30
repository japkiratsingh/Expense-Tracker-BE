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

  // Expense (for future use)
  EXPENSE: {
    CREATED: 'Expense created successfully',
    UPDATED: 'Expense updated successfully',
    DELETED: 'Expense deleted successfully'
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
  },

  // Recurring Expense
  RECURRING: {
    CREATED: 'Recurring expense created successfully',
    UPDATED: 'Recurring expense updated successfully',
    DELETED: 'Recurring expense deleted successfully',
    FETCHED: 'Recurring expense fetched successfully',
    LIST_FETCHED: 'Recurring expenses list fetched successfully',
    PAUSED: 'Recurring expense paused successfully',
    RESUMED: 'Recurring expense resumed successfully',
    GENERATED: 'Expense generated successfully from recurring template',
    HISTORY_FETCHED: 'Generated expenses history fetched successfully',
    UPCOMING_FETCHED: 'Upcoming recurring expenses fetched successfully'
  }
};
