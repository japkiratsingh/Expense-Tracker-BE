const mongoose = require('mongoose');

const tagSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: [50, 'Tag name must not exceed 50 characters']
  },
  color: {
    type: String,
    default: '#808080', // Default gray color
    validate: {
      validator: function(v) {
        return /^#[0-9A-Fa-f]{6}$/.test(v);
      },
      message: 'Color must be a valid hex color (e.g., #FF5733)'
    }
  },
  description: {
    type: String,
    default: null
  }
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      ret._id = ret._id.toString();
      if (ret.userId) ret.userId = ret.userId.toString();
      delete ret.__v;
      return ret;
    }
  }
});

// Add compound index for unique tag names per user
tagSchema.index({ userId: 1, name: 1 }, { unique: true });

const Tag = mongoose.model('Tag', tagSchema);

module.exports = Tag;
