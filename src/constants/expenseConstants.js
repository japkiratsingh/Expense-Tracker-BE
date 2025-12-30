/**
 * Expense Constants
 * Constants specific to expense management
 */

module.exports = {
  FIELD_LENGTHS: {
    DESCRIPTION_MAX: 500,
    DESCRIPTION_MIN: 1,
    NOTES_MAX: 1000
  },

  AMOUNT: {
    MIN: 0.01,
    MAX: 999999999.99
  },

  PAYMENT_METHODS: {
    CASH: 'cash',
    CREDIT: 'credit',
    DEBIT: 'debit',
    ONLINE: 'online',
    CHECK: 'check',
    OTHER: 'other'
  },

  SORT_FIELDS: {
    DATE: 'date',
    AMOUNT: 'amount',
    DESCRIPTION: 'description',
    CREATED_AT: 'createdAt'
  },

  SORT_ORDERS: {
    ASC: 'asc',
    DESC: 'desc'
  },

  PAGINATION: {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 50,
    MAX_LIMIT: 100
  },

  EXPORT_FORMATS: {
    JSON: 'json',
    CSV: 'csv'
  }
};
