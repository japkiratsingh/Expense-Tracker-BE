const mongoose = require('mongoose');
const { ATTACHMENT_CONSTANTS } = require('../constants');

const attachmentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  expenseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Expense',
    required: true,
    index: true
  },
  originalName: {
    type: String,
    required: true,
    maxlength: [ATTACHMENT_CONSTANTS.LIMITS.FILENAME_MAX_LENGTH, 'Filename is too long']
  },
  filename: {
    type: String,
    required: true
  },
  mimeType: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        const allAllowedTypes = [
          ...ATTACHMENT_CONSTANTS.ALLOWED_MIME_TYPES.IMAGES,
          ...ATTACHMENT_CONSTANTS.ALLOWED_MIME_TYPES.DOCUMENTS
        ];
        return allAllowedTypes.includes(v);
      },
      message: 'Invalid file type'
    }
  },
  size: {
    type: Number,
    required: true,
    min: [1, 'File size must be greater than 0'],
    max: [ATTACHMENT_CONSTANTS.FILE_SIZE.MAX_FILE, 'File size exceeds maximum limit']
  },
  path: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: Object.values(ATTACHMENT_CONSTANTS.CATEGORIES),
    default: ATTACHMENT_CONSTANTS.CATEGORIES.OTHER
  },
  thumbnailPath: {
    type: String,
    default: null
  },
  description: {
    type: String,
    default: ''
  },
  uploadedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      ret._id = ret._id.toString();
      if (ret.userId) ret.userId = ret.userId.toString();
      if (ret.expenseId) ret.expenseId = ret.expenseId.toString();
      delete ret.__v;
      return ret;
    }
  }
});

// Add compound index for efficient queries
attachmentSchema.index({ userId: 1, expenseId: 1 });
attachmentSchema.index({ userId: 1, category: 1 });

// Instance methods
attachmentSchema.methods.isImage = function() {
  return ATTACHMENT_CONSTANTS.ALLOWED_MIME_TYPES.IMAGES.includes(this.mimeType);
};

attachmentSchema.methods.isDocument = function() {
  return ATTACHMENT_CONSTANTS.ALLOWED_MIME_TYPES.DOCUMENTS.includes(this.mimeType);
};

attachmentSchema.methods.getExtension = function() {
  const parts = this.originalName.split('.');
  return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : '';
};

attachmentSchema.methods.getReadableSize = function() {
  const bytes = this.size;
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};

const Attachment = mongoose.model('Attachment', attachmentSchema);

module.exports = Attachment;
