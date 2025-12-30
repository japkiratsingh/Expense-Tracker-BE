const { v4: uuidv4 } = require('uuid');
const { ATTACHMENT_CONSTANTS } = require('../constants');

class Attachment {
  constructor(data = {}) {
    this._id = data._id || uuidv4();
    this.userId = data.userId || null;
    this.expenseId = data.expenseId || null;
    this.originalName = data.originalName || '';
    this.filename = data.filename || '';
    this.mimeType = data.mimeType || '';
    this.size = data.size || 0;
    this.path = data.path || '';
    this.category = data.category || ATTACHMENT_CONSTANTS.CATEGORIES.OTHER;
    this.thumbnailPath = data.thumbnailPath || null;
    this.description = data.description || '';
    this.uploadedAt = data.uploadedAt || new Date().toISOString();
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }

  /**
   * Validate attachment data
   */
  validate() {
    const errors = [];

    // Required fields
    if (!this.userId) {
      errors.push('User ID is required');
    }

    if (!this.expenseId) {
      errors.push('Expense ID is required');
    }

    if (!this.originalName) {
      errors.push('Original filename is required');
    }

    if (!this.filename) {
      errors.push('Filename is required');
    }

    if (!this.mimeType) {
      errors.push('MIME type is required');
    }

    if (!this.path) {
      errors.push('File path is required');
    }

    // Validate size
    if (this.size <= 0) {
      errors.push('File size must be greater than 0');
    }

    if (this.size > ATTACHMENT_CONSTANTS.FILE_SIZE.MAX_FILE) {
      errors.push('File size exceeds maximum limit');
    }

    // Validate MIME type
    const allAllowedTypes = [
      ...ATTACHMENT_CONSTANTS.ALLOWED_MIME_TYPES.IMAGES,
      ...ATTACHMENT_CONSTANTS.ALLOWED_MIME_TYPES.DOCUMENTS
    ];

    if (!allAllowedTypes.includes(this.mimeType)) {
      errors.push('Invalid file type');
    }

    // Validate category
    const validCategories = Object.values(ATTACHMENT_CONSTANTS.CATEGORIES);
    if (!validCategories.includes(this.category)) {
      errors.push('Invalid attachment category');
    }

    // Validate filename length
    if (this.originalName.length > ATTACHMENT_CONSTANTS.LIMITS.FILENAME_MAX_LENGTH) {
      errors.push('Filename is too long');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Check if attachment is an image
   */
  isImage() {
    return ATTACHMENT_CONSTANTS.ALLOWED_MIME_TYPES.IMAGES.includes(this.mimeType);
  }

  /**
   * Check if attachment is a document
   */
  isDocument() {
    return ATTACHMENT_CONSTANTS.ALLOWED_MIME_TYPES.DOCUMENTS.includes(this.mimeType);
  }

  /**
   * Get file extension
   */
  getExtension() {
    const parts = this.originalName.split('.');
    return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : '';
  }

  /**
   * Get readable file size
   */
  getReadableSize() {
    const bytes = this.size;
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  }

  /**
   * Convert to JSON (safe for API responses)
   */
  toJSON() {
    return {
      _id: this._id,
      userId: this.userId,
      expenseId: this.expenseId,
      originalName: this.originalName,
      filename: this.filename,
      mimeType: this.mimeType,
      size: this.size,
      readableSize: this.getReadableSize(),
      path: this.path,
      category: this.category,
      thumbnailPath: this.thumbnailPath,
      description: this.description,
      isImage: this.isImage(),
      isDocument: this.isDocument(),
      extension: this.getExtension(),
      uploadedAt: this.uploadedAt,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

module.exports = Attachment;
