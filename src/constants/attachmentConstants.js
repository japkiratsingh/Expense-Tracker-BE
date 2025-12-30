/**
 * Attachment Constants
 * Configuration for file attachments and uploads
 */

module.exports = {
  // Allowed file types
  ALLOWED_MIME_TYPES: {
    IMAGES: [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/webp'
    ],
    DOCUMENTS: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/plain',
      'text/csv'
    ]
  },

  // File size limits (in bytes)
  FILE_SIZE: {
    MAX_IMAGE: 5 * 1024 * 1024,      // 5MB
    MAX_DOCUMENT: 10 * 1024 * 1024,  // 10MB
    MAX_FILE: 10 * 1024 * 1024       // 10MB default
  },

  // Thumbnail settings
  THUMBNAIL: {
    WIDTH: 200,
    HEIGHT: 200,
    QUALITY: 80,
    FORMAT: 'jpeg'
  },

  // Upload paths
  PATHS: {
    UPLOADS: 'uploads',
    RECEIPTS: 'uploads/receipts',
    THUMBNAILS: 'uploads/thumbnails',
    TEMP: 'uploads/temp'
  },

  // File categories
  CATEGORIES: {
    RECEIPT: 'receipt',
    INVOICE: 'invoice',
    DOCUMENT: 'document',
    IMAGE: 'image',
    OTHER: 'other'
  },

  // Limits
  LIMITS: {
    MAX_FILES_PER_EXPENSE: 10,
    FILENAME_MAX_LENGTH: 255
  }
};
