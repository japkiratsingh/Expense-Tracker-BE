const Expense = require('../models/Expense');

class ExpenseRepository {
  async findById(id) {
    return await Expense.findById(id).lean();
  }

  async find(query = {}) {
    return await Expense.find(query).lean();
  }

  async findOne(query) {
    return await Expense.findOne(query).lean();
  }

  async create(data) {
    const expense = new Expense(data);
    await expense.save();
    return expense.toJSON();
  }

  async updateById(id, updates) {
    const expense = await Expense.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    ).lean();
    return expense;
  }

  async deleteById(id) {
    const result = await Expense.findByIdAndDelete(id);
    return !!result;
  }

  async count(query = {}) {
    return await Expense.countDocuments(query);
  }

  async findByUserId(userId, options = {}) {
    const { filters = {}, sort = {}, pagination = {} } = options;

    // Build MongoDB query
    const query = { userId };

    // Apply filters
    if (filters.categoryId) {
      query.categoryId = filters.categoryId;
    }

    if (filters.tags && filters.tags.length > 0) {
      query.tags = { $in: filters.tags };
    }

    if (filters.startDate || filters.endDate) {
      query.date = {};
      if (filters.startDate) query.date.$gte = filters.startDate;
      if (filters.endDate) query.date.$lte = filters.endDate;
    }

    if (filters.minAmount !== undefined || filters.maxAmount !== undefined) {
      query.amount = {};
      if (filters.minAmount !== undefined) query.amount.$gte = parseFloat(filters.minAmount);
      if (filters.maxAmount !== undefined) query.amount.$lte = parseFloat(filters.maxAmount);
    }

    if (filters.paymentMethod) {
      query.paymentMethod = filters.paymentMethod;
    }

    if (filters.search) {
      query.$or = [
        { description: { $regex: filters.search, $options: 'i' } },
        { notes: { $regex: filters.search, $options: 'i' } }
      ];
    }

    // Get total count for pagination
    const total = await Expense.countDocuments(query);

    // Apply sorting
    const { field = 'date', order = 'desc' } = sort;
    const sortObj = { [field]: order === 'asc' ? 1 : -1 };

    // Apply pagination
    const { page = 1, limit = 50 } = pagination;
    const skip = (page - 1) * limit;

    const expenses = await Expense.find(query)
      .sort(sortObj)
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

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

  async findByUserIdAndId(userId, expenseId) {
    return await Expense.findOne({ _id: expenseId, userId }).lean();
  }

  async deleteByUserIdAndId(userId, expenseId) {
    const result = await Expense.findOneAndDelete({ _id: expenseId, userId });
    return !!result;
  }

  async updateByUserIdAndId(userId, expenseId, updates) {
    return await Expense.findOneAndUpdate(
      { _id: expenseId, userId },
      { $set: updates },
      { new: true, runValidators: true }
    ).lean();
  }

  // Statistics methods
  async getStatsByUserId(userId, filters = {}) {
    // Build query
    const query = { userId };
    this.applyFiltersToQuery(query, filters);

    const result = await Expense.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' },
          count: { $sum: 1 },
          average: { $avg: '$amount' },
          min: { $min: '$amount' },
          max: { $max: '$amount' }
        }
      }
    ]);

    if (result.length === 0) {
      return { total: 0, count: 0, average: 0, min: 0, max: 0 };
    }

    return result[0];
  }

  async getStatsByCategory(userId, filters = {}) {
    const query = { userId };
    this.applyFiltersToQuery(query, filters);

    const result = await Expense.aggregate([
      { $match: query },
      {
        $group: {
          _id: { $ifNull: ['$categoryId', 'uncategorized'] },
          total: { $sum: '$amount' },
          count: { $sum: 1 },
          expenses: { $push: '$_id' }
        }
      },
      {
        $project: {
          categoryId: '$_id',
          total: 1,
          count: 1,
          average: { $divide: ['$total', '$count'] },
          expenses: 1,
          _id: 0
        }
      }
    ]);

    // Calculate grand total and percentages
    const grandTotal = result.reduce((sum, cat) => sum + cat.total, 0);
    result.forEach(cat => {
      cat.percentage = grandTotal > 0 ? (cat.total / grandTotal) * 100 : 0;
    });

    return result;
  }

  async getStatsByTag(userId, filters = {}) {
    const query = { userId };
    this.applyFiltersToQuery(query, filters);

    const result = await Expense.aggregate([
      { $match: query },
      { $unwind: '$tags' },
      {
        $group: {
          _id: '$tags',
          total: { $sum: '$amount' },
          count: { $sum: 1 },
          expenses: { $push: '$_id' }
        }
      },
      {
        $project: {
          tagId: '$_id',
          total: 1,
          count: 1,
          average: { $divide: ['$total', '$count'] },
          expenses: 1,
          _id: 0
        }
      }
    ]);

    return result;
  }

  async getStatsByMonth(userId, filters = {}) {
    const query = { userId };
    this.applyFiltersToQuery(query, filters);

    const result = await Expense.aggregate([
      { $match: query },
      {
        $group: {
          _id: { $substr: ['$date', 0, 7] },
          total: { $sum: '$amount' },
          count: { $sum: 1 },
          expenses: { $push: '$_id' }
        }
      },
      {
        $project: {
          month: '$_id',
          total: 1,
          count: 1,
          average: { $divide: ['$total', '$count'] },
          expenses: 1,
          _id: 0
        }
      },
      { $sort: { month: 1 } }
    ]);

    return result;
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

  // Helper method to apply filters to MongoDB query
  applyFiltersToQuery(query, filters) {
    if (filters.categoryId) {
      query.categoryId = filters.categoryId;
    }

    if (filters.tags && filters.tags.length > 0) {
      query.tags = { $in: filters.tags };
    }

    if (filters.startDate || filters.endDate) {
      query.date = {};
      if (filters.startDate) query.date.$gte = filters.startDate;
      if (filters.endDate) query.date.$lte = filters.endDate;
    }

    if (filters.minAmount !== undefined || filters.maxAmount !== undefined) {
      query.amount = {};
      if (filters.minAmount !== undefined) query.amount.$gte = parseFloat(filters.minAmount);
      if (filters.maxAmount !== undefined) query.amount.$lte = parseFloat(filters.maxAmount);
    }

    if (filters.paymentMethod) {
      query.paymentMethod = filters.paymentMethod;
    }

    if (filters.search) {
      query.$or = [
        { description: { $regex: filters.search, $options: 'i' } },
        { notes: { $regex: filters.search, $options: 'i' } }
      ];
    }
  }
}

module.exports = new ExpenseRepository();
