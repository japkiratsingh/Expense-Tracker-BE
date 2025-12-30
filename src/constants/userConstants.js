/**
 * User Constants
 * Constants related to user management
 */

module.exports = {
  // Field Lengths
  FIELD_LENGTHS: {
    FIRST_NAME_MAX: 50,
    LAST_NAME_MAX: 50,
    EMAIL_MAX: 255
  },

  // Default Values
  DEFAULTS: {
    CURRENCY: 'USD',
    DATE_FORMAT: 'YYYY-MM-DD',
    THEME: 'light'
  },

  // Preferences
  PREFERENCES: {
    THEMES: {
      LIGHT: 'light',
      DARK: 'dark'
    },
    DATE_FORMATS: {
      ISO: 'YYYY-MM-DD',
      US: 'MM/DD/YYYY',
      EU: 'DD/MM/YYYY'
    }
  },

  // Notification Settings
  NOTIFICATIONS: {
    EMAIL: {
      DEFAULT: true
    },
    RECURRING_REMINDERS: {
      DEFAULT: true
    }
  }
};
