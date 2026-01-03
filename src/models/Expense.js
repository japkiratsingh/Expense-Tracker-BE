const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
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
  date: {
    type: String,
    required: true,
    match: [/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format']
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    default: null
  },
  tags: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tag'
  }],
  paymentMethod: {
    type: String,
    enum: ['cash', 'credit', 'debit', 'online', 'check', 'other'],
    default: 'cash'
  },
  notes: {
    type: String,
    default: '',
    maxlength: [1000, 'Notes must not exceed 1000 characters']
  },
  hasAttachments: {
    type: Boolean,
    default: false
  },
  isRecurring: {
    type: Boolean,
    default: false
  },
  recurringExpenseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'RecurringExpense',
    default: null
  }
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      ret._id = ret._id.toString();
      if (ret.userId) ret.userId = ret.userId.toString();
      if (ret.categoryId) ret.categoryId = ret.categoryId.toString();
      if (ret.recurringExpenseId) ret.recurringExpenseId = ret.recurringExpenseId.toString();
      if (ret.tags) ret.tags = ret.tags.map(tag => typeof tag === 'object' ? tag._id.toString() : tag.toString());
      delete ret.__v;
      return ret;
    }
  }
});

// Add compound index for efficient queries
expenseSchema.index({ userId: 1, date: -1 });
expenseSchema.index({ userId: 1, categoryId: 1 });

const Expense = mongoose.model('Expense', expenseSchema);

module.exports = Expense;
