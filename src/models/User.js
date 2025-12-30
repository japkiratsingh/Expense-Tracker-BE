class User {
  constructor(data = {}) {
    this._id = data._id || null;
    this.email = data.email || '';
    this.password = data.password || ''; // Hashed
    this.firstName = data.firstName || '';
    this.lastName = data.lastName || '';
    this.profilePicture = data.profilePicture || null;
    this.defaultCurrency = data.defaultCurrency || 'USD';
    this.preferences = data.preferences || {
      dateFormat: 'YYYY-MM-DD',
      theme: 'light',
      notifications: {
        email: true,
        recurringReminders: true
      }
    };
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
    this.isActive = data.isActive !== undefined ? data.isActive : true;
    this.lastLogin = data.lastLogin || null;
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
