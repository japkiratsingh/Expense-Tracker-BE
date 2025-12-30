/**
 * Authentication Constants
 * Constants related to authentication and authorization
 */

module.exports = {
  // Password
  PASSWORD: {
    MIN_LENGTH: 6,
    MAX_LENGTH: 128,
    BCRYPT_ROUNDS: 12
  },

  // JWT
  JWT: {
    ALGORITHM: 'HS256',
    DEFAULT_EXPIRY: '1h',
    DEFAULT_REFRESH_EXPIRY: '7d',
    BEARER_PREFIX: 'Bearer ',
    BEARER_PREFIX_LENGTH: 7
  },

  // User Status
  USER_STATUS: {
    ACTIVE: true,
    INACTIVE: false
  },

  // Token Types
  TOKEN_TYPES: {
    ACCESS: 'access',
    REFRESH: 'refresh'
  }
};
