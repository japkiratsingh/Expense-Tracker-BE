class Expense {
  constructor(data = {}) {
    this._id = data._id || null;
    this.userId = data.userId || null;
    this.amount = data.amount || 0;
    this.description = data.description || '';
    this.date = data.date || new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
    this.categoryId = data.categoryId || null;
    this.tags = data.tags || []; // Array of tag IDs
    this.paymentMethod = data.paymentMethod || 'cash'; // cash, credit, debit, online, etc.
    this.notes = data.notes || '';
    this.attachments = data.attachments || []; // Array of attachment IDs (for future use)
    this.isRecurring = data.isRecurring || false;
    this.recurringExpenseId = data.recurringExpenseId || null;
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }

  toJSON() {
    return { ...this };
  }

  static fromJSON(json) {
    return new Expense(json);
  }

  validate() {
    const errors = [];

    if (!this.userId) {
      errors.push('User ID is required');
    }

    if (!this.amount || this.amount <= 0) {
      errors.push('Amount must be a positive number');
    }

    if (this.amount && this.amount > 999999999.99) {
      errors.push('Amount is too large');
    }

    if (!this.description || this.description.trim().length === 0) {
      errors.push('Description is required');
    }

    if (this.description && this.description.length > 500) {
      errors.push('Description must not exceed 500 characters');
    }

    if (!this.date) {
      errors.push('Date is required');
    }

    // Validate date format (YYYY-MM-DD)
    if (this.date && !/^\d{4}-\d{2}-\d{2}$/.test(this.date)) {
      errors.push('Date must be in YYYY-MM-DD format');
    }

    // Validate that tags is an array
    if (this.tags && !Array.isArray(this.tags)) {
      errors.push('Tags must be an array');
    }

    // Validate payment method
    const validPaymentMethods = ['cash', 'credit', 'debit', 'online', 'check', 'other'];
    if (this.paymentMethod && !validPaymentMethods.includes(this.paymentMethod)) {
      errors.push(`Payment method must be one of: ${validPaymentMethods.join(', ')}`);
    }

    if (this.notes && this.notes.length > 1000) {
      errors.push('Notes must not exceed 1000 characters');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

module.exports = Expense;
