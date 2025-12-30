/**
 * Common Constants
 * Shared constants used across the application
 */

module.exports = {
  // File Upload
  FILE_UPLOAD: {
    MAX_SIZE: 5 * 1024 * 1024, // 5MB in bytes
    ALLOWED_MIME_TYPES: [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'application/pdf'
    ]
  },

  // Body Parser Limits
  BODY_PARSER: {
    JSON_LIMIT: '10mb',
    URLENCODED_LIMIT: '10mb'
  },

  // Rate Limiting
  RATE_LIMIT: {
    WINDOW_MS: 15 * 60 * 1000, // 15 minutes in milliseconds
    MAX_REQUESTS: 100,
    AUTH_MAX_REQUESTS: 5
  },

  // Pagination
  PAGINATION: {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 20,
    MAX_LIMIT: 100
  },

  // Response Status
  RESPONSE_STATUS: {
    SUCCESS: true,
    FAILURE: false
  },

  // Error Status Types
  ERROR_STATUS: {
    FAIL: 'fail',
    ERROR: 'error'
  },

  // Environment
  ENVIRONMENTS: {
    DEVELOPMENT: 'development',
    PRODUCTION: 'production',
    TEST: 'test'
  }
};
