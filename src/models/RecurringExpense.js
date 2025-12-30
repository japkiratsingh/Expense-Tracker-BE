class RecurringExpense {
  constructor(data = {}) {
    this._id = data._id || null;
    this.userId = data.userId || null;
    this.amount = data.amount || 0;
    this.description = data.description || '';
    this.categoryId = data.categoryId || null;
    this.tags = data.tags || [];
    this.paymentMethod = data.paymentMethod || 'cash';
    this.notes = data.notes || '';

    // Recurring specific fields
    this.frequency = data.frequency || 'monthly'; // daily, weekly, monthly, yearly
    this.startDate = data.startDate || new Date().toISOString().split('T')[0];
    this.endDate = data.endDate || null; // null means no end date
    this.nextOccurrence = data.nextOccurrence || this.startDate;
    this.lastGenerated = data.lastGenerated || null;
    this.isActive = data.isActive !== undefined ? data.isActive : true;

    // Additional recurring options
    this.dayOfMonth = data.dayOfMonth || null; // For monthly (1-31)
    this.dayOfWeek = data.dayOfWeek || null; // For weekly (0-6, 0=Sunday)
    this.intervalCount = data.intervalCount || 1; // Every X days/weeks/months/years

    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }

  toJSON() {
    return { ...this };
  }

  static fromJSON(json) {
    return new RecurringExpense(json);
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

    // Validate frequency
    const validFrequencies = ['daily', 'weekly', 'monthly', 'yearly'];
    if (!validFrequencies.includes(this.frequency)) {
      errors.push('Frequency must be one of: daily, weekly, monthly, yearly');
    }

    // Validate startDate format (YYYY-MM-DD)
    if (!this.startDate || !/^\d{4}-\d{2}-\d{2}$/.test(this.startDate)) {
      errors.push('Start date must be in YYYY-MM-DD format');
    }

    // Validate endDate format if provided
    if (this.endDate && !/^\d{4}-\d{2}-\d{2}$/.test(this.endDate)) {
      errors.push('End date must be in YYYY-MM-DD format');
    }

    // Validate that endDate is after startDate
    if (this.endDate && this.startDate && this.endDate <= this.startDate) {
      errors.push('End date must be after start date');
    }

    // Validate dayOfMonth for monthly frequency
    if (this.frequency === 'monthly' && this.dayOfMonth) {
      if (this.dayOfMonth < 1 || this.dayOfMonth > 31) {
        errors.push('Day of month must be between 1 and 31');
      }
    }

    // Validate dayOfWeek for weekly frequency
    if (this.frequency === 'weekly' && this.dayOfWeek !== null) {
      if (this.dayOfWeek < 0 || this.dayOfWeek > 6) {
        errors.push('Day of week must be between 0 (Sunday) and 6 (Saturday)');
      }
    }

    // Validate intervalCount
    if (this.intervalCount < 1 || this.intervalCount > 365) {
      errors.push('Interval count must be between 1 and 365');
    }

    if (this.notes && this.notes.length > 1000) {
      errors.push('Notes must not exceed 1000 characters');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Calculate the next occurrence date based on frequency and current nextOccurrence
   */
  calculateNextOccurrence() {
    const current = new Date(this.nextOccurrence);
    let next;

    switch (this.frequency) {
      case 'daily':
        next = new Date(current);
        next.setDate(current.getDate() + this.intervalCount);
        break;

      case 'weekly':
        next = new Date(current);
        next.setDate(current.getDate() + (7 * this.intervalCount));
        break;

      case 'monthly':
        next = new Date(current);
        next.setMonth(current.getMonth() + this.intervalCount);
        // If dayOfMonth is specified, use it
        if (this.dayOfMonth) {
          next.setDate(this.dayOfMonth);
        }
        break;

      case 'yearly':
        next = new Date(current);
        next.setFullYear(current.getFullYear() + this.intervalCount);
        break;

      default:
        next = current;
    }

    return next.toISOString().split('T')[0];
  }

  /**
   * Check if this recurring expense should generate an expense today
   */
  shouldGenerateToday() {
    if (!this.isActive) {
      return false;
    }

    const today = new Date().toISOString().split('T')[0];

    // Check if today is the next occurrence
    if (this.nextOccurrence !== today) {
      return false;
    }

    // Check if we've already generated today
    if (this.lastGenerated === today) {
      return false;
    }

    // Check if we're past the end date
    if (this.endDate && today > this.endDate) {
      return false;
    }

    return true;
  }
}

module.exports = RecurringExpense;
