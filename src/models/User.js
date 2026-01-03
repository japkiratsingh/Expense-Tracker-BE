const mongoose = require('mongoose');
const { USER_CONSTANTS, AUTH_CONSTANTS } = require('../constants');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  profilePicture: {
    type: String,
    default: null
  },
  defaultCurrency: {
    type: String,
    default: USER_CONSTANTS.DEFAULTS.CURRENCY
  },
  preferences: {
    dateFormat: {
      type: String,
      default: USER_CONSTANTS.DEFAULTS.DATE_FORMAT
    },
    theme: {
      type: String,
      default: USER_CONSTANTS.DEFAULTS.THEME
    },
    notifications: {
      email: {
        type: Boolean,
        default: USER_CONSTANTS.NOTIFICATIONS.EMAIL.DEFAULT
      },
      recurringReminders: {
        type: Boolean,
        default: USER_CONSTANTS.NOTIFICATIONS.RECURRING_REMINDERS.DEFAULT
      }
    }
  },
  isActive: {
    type: Boolean,
    default: AUTH_CONSTANTS.USER_STATUS.ACTIVE
  },
  lastLogin: {
    type: Date,
    default: null
  }
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      ret._id = ret._id.toString();
      delete ret.password; // Never expose password
      delete ret.__v;
      return ret;
    }
  }
});

// Add index on email for faster lookups
userSchema.index({ email: 1 });

const User = mongoose.model('User', userSchema);

module.exports = User;
