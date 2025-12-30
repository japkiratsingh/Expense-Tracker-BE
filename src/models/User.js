const { USER_CONSTANTS, AUTH_CONSTANTS } = require('../constants');

class User {
  constructor(data = {}) {
    this._id = data._id || null;
    this.email = data.email || '';
    this.password = data.password || ''; // Hashed
    this.firstName = data.firstName || '';
    this.lastName = data.lastName || '';
    this.profilePicture = data.profilePicture || null;
    this.defaultCurrency = data.defaultCurrency || USER_CONSTANTS.DEFAULTS.CURRENCY;
    this.preferences = data.preferences || this._getDefaultPreferences();
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
    this.isActive = data.isActive !== undefined ? data.isActive : AUTH_CONSTANTS.USER_STATUS.ACTIVE;
    this.lastLogin = data.lastLogin || null;
  }

  _getDefaultPreferences() {
    return {
      dateFormat: USER_CONSTANTS.DEFAULTS.DATE_FORMAT,
      theme: USER_CONSTANTS.DEFAULTS.THEME,
      notifications: {
        email: USER_CONSTANTS.NOTIFICATIONS.EMAIL.DEFAULT,
        recurringReminders: USER_CONSTANTS.NOTIFICATIONS.RECURRING_REMINDERS.DEFAULT
      }
    };
  }

  toJSON() {
    const obj = { ...this };
    delete obj.password; // Never expose password
    return obj;
  }

  static fromJSON(json) {
    return new User(json);
  }
}

module.exports = User;
