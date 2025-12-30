class Tag {
  constructor(data = {}) {
    this._id = data._id || null;
    this.userId = data.userId || null;
    this.name = data.name || '';
    this.color = data.color || '#808080'; // Default gray color
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }

  toJSON() {
    return { ...this };
  }

  static fromJSON(json) {
    return new Tag(json);
  }

  validate() {
    const errors = [];

    if (!this.userId) {
      errors.push('User ID is required');
    }

    if (!this.name || this.name.trim().length === 0) {
      errors.push('Tag name is required');
    }

    if (this.name && this.name.length > 50) {
      errors.push('Tag name must not exceed 50 characters');
    }

    // Validate color format (hex color)
    if (this.color && !/^#[0-9A-Fa-f]{6}$/.test(this.color)) {
      errors.push('Color must be a valid hex color (e.g., #FF5733)');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

module.exports = Tag;
