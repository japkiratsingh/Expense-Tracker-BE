/**
 * Recurring Expense Constants
 */

module.exports = {
  FREQUENCIES: {
    DAILY: 'daily',
    WEEKLY: 'weekly',
    MONTHLY: 'monthly',
    YEARLY: 'yearly'
  },

  DAYS_OF_WEEK: {
    SUNDAY: 0,
    MONDAY: 1,
    TUESDAY: 2,
    WEDNESDAY: 3,
    THURSDAY: 4,
    FRIDAY: 5,
    SATURDAY: 6
  },

  FIELD_LENGTHS: {
    DESCRIPTION_MAX: 500,
    DESCRIPTION_MIN: 1,
    NOTES_MAX: 1000
  },

  LIMITS: {
    INTERVAL_MIN: 1,
    INTERVAL_MAX: 365
  }
};
