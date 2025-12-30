const path = require('path');
const BaseRepository = require('./BaseRepository');

class ExpenseRepository extends BaseRepository {
  constructor() {
    super(path.join(__dirname, '../../data/expenses.json'));
  }

  async findByUserId(userId, options = {}) {
    const { filters = {}, sort = {}, pagination = {} } = options;

    // Get all expenses for the user
    let expenses = await this.find({ userId });

    // Apply filters
    expenses = this.applyFilters(expenses, filters);

    // Apply sorting
    expenses = this.applySort(expenses, sort);

    // Calculate total before pagination
    const total = expenses.length;

    // Apply pagination
    const { page = 1, limit = 50 } = pagination;
    const skip = (page - 1) * limit;
    expenses = expenses.slice(skip, skip + limit);

    return {
      expenses,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  applyFilters(expenses, filters) {
    let filtered = [...expenses];

    // Filter by category
    if (filters.categoryId) {
      filtered = filtered.filter(e => e.categoryId === filters.categoryId);
    }

    // Filter by tags (expenses that have ANY of the specified tags)
    if (filters.tags && filters.tags.length > 0) {
      filtered = filtered.filter(e =>
        e.tags && e.tags.some(tag => filters.tags.includes(tag))
      );
    }

    // Filter by date range
    if (filters.startDate) {
      filtered = filtered.filter(e => e.date >= filters.startDate);
    }
    if (filters.endDate) {
      filtered = filtered.filter(e => e.date <= filters.endDate);
    }

    // Filter by amount range
    if (filters.minAmount !== undefined) {
      filtered = filtered.filter(e => e.amount >= parseFloat(filters.minAmount));
    }
    if (filters.maxAmount !== undefined) {
      filtered = filtered.filter(e => e.amount <= parseFloat(filters.maxAmount));
    }

    // Filter by payment method
    if (filters.paymentMethod) {
      filtered = filtered.filter(e => e.paymentMethod === filters.paymentMethod);
    }

    // Search in description and notes
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(e =>
        (e.description && e.description.toLowerCase().includes(searchLower)) ||
        (e.notes && e.notes.toLowerCase().includes(searchLower))
      );
    }

    return filtered;
  }

  applySort(expenses, sort) {
    const { field = 'date', order = 'desc' } = sort;

    return expenses.sort((a, b) => {
      let aVal = a[field];
      let bVal = b[field];

      // Handle string comparison
      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }

      if (order === 'asc') {
        return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
      } else {
        return aVal < bVal ? 1 : aVal > bVal ? -1 : 0;
      }
    });
  }

  async findByUserIdAndId(userId, expenseId) {
    const expense = await this.findById(expenseId);
    if (!expense || expense.userId !== userId) {
      return null;
    }
    return expense;
  }

  async deleteByUserIdAndId(userId, expenseId) {
    const expense = await this.findByUserIdAndId(userId, expenseId);
    if (!expense) {
      return null;
    }
    return this.deleteById(expenseId);
  }

  async updateByUserIdAndId(userId, expenseId, updates) {
    const expense = await this.findByUserIdAndId(userId, expenseId);
    if (!expense) {
      return null;
    }
    return this.updateById(expenseId, updates);
  }

  // Statistics methods
  async getStatsByUserId(userId, filters = {}) {
    let expenses = await this.find({ userId });
    expenses = this.applyFilters(expenses, filters);

    const total = expenses.reduce((sum, e) => sum + e.amount, 0);
    const count = expenses.length;
    const average = count > 0 ? total / count : 0;

    // Find min and max
    const amounts = expenses.map(e => e.amount);
    const min = amounts.length > 0 ? Math.min(...amounts) : 0;
    const max = amounts.length > 0 ? Math.max(...amounts) : 0;

    return {
      total,
      count,
      average,
      min,
      max
    };
  }

  async getStatsByCategory(userId, filters = {}) {
    let expenses = await this.find({ userId });
    expenses = this.applyFilters(expenses, filters);

    const categoryStats = {};

    expenses.forEach(expense => {
      const categoryId = expense.categoryId || 'uncategorized';
      if (!categoryStats[categoryId]) {
        categoryStats[categoryId] = {
          categoryId,
          total: 0,
          count: 0,
          expenses: []
        };
      }
      categoryStats[categoryId].total += expense.amount;
      categoryStats[categoryId].count += 1;
      categoryStats[categoryId].expenses.push(expense._id);
    });

    // Calculate averages and percentages
    const grandTotal = Object.values(categoryStats).reduce((sum, cat) => sum + cat.total, 0);
    Object.values(categoryStats).forEach(cat => {
      cat.average = cat.total / cat.count;
      cat.percentage = grandTotal > 0 ? (cat.total / grandTotal) * 100 : 0;
    });

    return Object.values(categoryStats);
  }

  async getStatsByTag(userId, filters = {}) {
    let expenses = await this.find({ userId });
    expenses = this.applyFilters(expenses, filters);

    const tagStats = {};

    expenses.forEach(expense => {
      if (expense.tags && expense.tags.length > 0) {
        expense.tags.forEach(tagId => {
          if (!tagStats[tagId]) {
            tagStats[tagId] = {
              tagId,
              total: 0,
              count: 0,
              expenses: []
            };
          }
          tagStats[tagId].total += expense.amount;
          tagStats[tagId].count += 1;
          tagStats[tagId].expenses.push(expense._id);
        });
      }
    });

    // Calculate averages
    Object.values(tagStats).forEach(tag => {
      tag.average = tag.total / tag.count;
    });

    return Object.values(tagStats);
  }

  async getStatsByMonth(userId, filters = {}) {
    let expenses = await this.find({ userId });
    expenses = this.applyFilters(expenses, filters);

    const monthStats = {};

    expenses.forEach(expense => {
      // Extract YYYY-MM from date
      const month = expense.date.substring(0, 7);
      if (!monthStats[month]) {
        monthStats[month] = {
          month,
          total: 0,
          count: 0,
          expenses: []
        };
      }
      monthStats[month].total += expense.amount;
      monthStats[month].count += 1;
      monthStats[month].expenses.push(expense._id);
    });

    // Calculate averages
    Object.values(monthStats).forEach(month => {
      month.average = month.total / month.count;
    });

    // Sort by month
    return Object.values(monthStats).sort((a, b) => a.month.localeCompare(b.month));
  }

  async getTrends(userId, filters = {}) {
    const monthlyStats = await this.getStatsByMonth(userId, filters);

    if (monthlyStats.length < 2) {
      return {
        trend: 'insufficient_data',
        monthlyStats
      };
    }

    // Calculate trend (simple moving average)
    const totals = monthlyStats.map(m => m.total);
    const recent = totals.slice(-3); // Last 3 months
    const previous = totals.slice(-6, -3); // Previous 3 months

    const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
    const previousAvg = previous.length > 0
      ? previous.reduce((a, b) => a + b, 0) / previous.length
      : recentAvg;

    let trend = 'stable';
    const percentChange = previousAvg > 0
      ? ((recentAvg - previousAvg) / previousAvg) * 100
      : 0;

    if (percentChange > 10) {
      trend = 'increasing';
    } else if (percentChange < -10) {
      trend = 'decreasing';
    }

    return {
      trend,
      percentChange: parseFloat(percentChange.toFixed(2)),
      recentAverage: parseFloat(recentAvg.toFixed(2)),
      previousAverage: parseFloat(previousAvg.toFixed(2)),
      monthlyStats
    };
  }
}

module.exports = new ExpenseRepository();
