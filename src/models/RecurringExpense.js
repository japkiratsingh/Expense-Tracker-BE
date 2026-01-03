const mongoose = require('mongoose');

const recurringExpenseSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  amount: {
    type: Number,
    required: true,
    min: [0.01, 'Amount must be a positive number'],
    max: [999999999.99, 'Amount is too large']
  },
  currency: {
    type: String,
    default: 'USD',
    uppercase: true
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: [500, 'Description must not exceed 500 characters']
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    default: null
  },
  frequency: {
    type: String,
    enum: ['DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY'],
    required: true,
    uppercase: true
  },
  nextOccurrence: {
    type: String,
    required: true,
    match: [/^\d{4}-\d{2}-\d{2}$/, 'Next occurrence must be in YYYY-MM-DD format']
  },
  lastGenerated: {
    type: String,
    default: null,
    match: [/^\d{4}-\d{2}-\d{2}$/, 'Last generated must be in YYYY-MM-DD format']
  },
  endDate: {
    type: String,
    default: null,
    match: [/^\d{4}-\d{2}-\d{2}$/, 'End date must be in YYYY-MM-DD format']
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      ret._id = ret._id.toString();
      if (ret.userId) ret.userId = ret.userId.toString();
      if (ret.categoryId) ret.categoryId = ret.categoryId.toString();
      delete ret.__v;
      return ret;
    }
  }
});

// Add indexes for efficient queries
recurringExpenseSchema.index({ userId: 1, isActive: 1 });
recurringExpenseSchema.index({ nextOccurrence: 1, isActive: 1 });

const RecurringExpense = mongoose.model('RecurringExpense', recurringExpenseSchema);

module.exports = RecurringExpense;
