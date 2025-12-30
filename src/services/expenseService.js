const expenseRepository = require('../repositories/ExpenseRepository');
const Expense = require('../models/Expense');
const AppError = require('../utils/AppError');
const {
  ERROR_MESSAGES,
  HTTP_STATUS,
  EXPENSE_CONSTANTS
} = require('../constants');

class ExpenseService {
  async createExpense(userId, expenseData) {
    const { amount, description, date, categoryId, tags, paymentMethod, notes } = expenseData;

    // Create expense
    const expense = new Expense({
      userId,
      amount: parseFloat(amount),
      description: description.trim(),
      date: date || new Date().toISOString().split('T')[0],
      categoryId,
      tags: tags || [],
      paymentMethod: paymentMethod || EXPENSE_CONSTANTS.PAYMENT_METHODS.CASH,
      notes: notes || ''
    });

    // Validate expense
    const validation = expense.validate();
    if (!validation.isValid) {
      throw new AppError(
        validation.errors.join(', '),
        HTTP_STATUS.BAD_REQUEST
      );
    }

    const createdExpense = await expenseRepository.create(expense);
    return new Expense(createdExpense).toJSON();
  }

  async getAllExpenses(userId, queryParams) {
    const {
      page = EXPENSE_CONSTANTS.PAGINATION.DEFAULT_PAGE,
      limit = EXPENSE_CONSTANTS.PAGINATION.DEFAULT_LIMIT,
      sortBy = EXPENSE_CONSTANTS.SORT_FIELDS.DATE,
      sortOrder = EXPENSE_CONSTANTS.SORT_ORDERS.DESC,
      categoryId,
      tags,
      startDate,
      endDate,
      minAmount,
      maxAmount,
      paymentMethod,
      search
    } = queryParams;

    const filters = {};
    if (categoryId) filters.categoryId = categoryId;
    if (tags) filters.tags = Array.isArray(tags) ? tags : [tags];
    if (startDate) filters.startDate = startDate;
    if (endDate) filters.endDate = endDate;
    if (minAmount) filters.minAmount = minAmount;
    if (maxAmount) filters.maxAmount = maxAmount;
    if (paymentMethod) filters.paymentMethod = paymentMethod;
    if (search) filters.search = search;

    const result = await expenseRepository.findByUserId(userId, {
      filters,
      sort: { field: sortBy, order: sortOrder },
      pagination: { page: parseInt(page), limit: parseInt(limit) }
    });

    return {
      expenses: result.expenses.map(e => new Expense(e).toJSON()),
      pagination: result.pagination
    };
  }

  async getExpenseById(userId, expenseId) {
    const expense = await expenseRepository.findByUserIdAndId(userId, expenseId);
    if (!expense) {
      throw new AppError(
        ERROR_MESSAGES.EXPENSE.NOT_FOUND,
        HTTP_STATUS.NOT_FOUND
      );
    }
    return new Expense(expense).toJSON();
  }

  async updateExpense(userId, expenseId, updates) {
    const expense = await expenseRepository.findByUserIdAndId(userId, expenseId);
    if (!expense) {
      throw new AppError(
        ERROR_MESSAGES.EXPENSE.NOT_FOUND,
        HTTP_STATUS.NOT_FOUND
      );
    }

    // Prepare updates
    const updateData = {};
    if (updates.amount !== undefined) updateData.amount = parseFloat(updates.amount);
    if (updates.description !== undefined) updateData.description = updates.description.trim();
    if (updates.date !== undefined) updateData.date = updates.date;
    if (updates.categoryId !== undefined) updateData.categoryId = updates.categoryId;
    if (updates.tags !== undefined) updateData.tags = updates.tags;
    if (updates.paymentMethod !== undefined) updateData.paymentMethod = updates.paymentMethod;
    if (updates.notes !== undefined) updateData.notes = updates.notes;

    // Validate updates
    const updatedExpense = new Expense({ ...expense, ...updateData });
    const validation = updatedExpense.validate();
    if (!validation.isValid) {
      throw new AppError(
        validation.errors.join(', '),
        HTTP_STATUS.BAD_REQUEST
      );
    }

    const result = await expenseRepository.updateByUserIdAndId(
      userId,
      expenseId,
      updateData
    );
    return new Expense(result).toJSON();
  }

  async deleteExpense(userId, expenseId) {
    const expense = await expenseRepository.findByUserIdAndId(userId, expenseId);
    if (!expense) {
      throw new AppError(
        ERROR_MESSAGES.EXPENSE.NOT_FOUND,
        HTTP_STATUS.NOT_FOUND
      );
    }

    const deleted = await expenseRepository.deleteByUserIdAndId(userId, expenseId);
    return new Expense(deleted).toJSON();
  }

  // Statistics methods
  async getSummaryStats(userId, filters = {}) {
    const stats = await expenseRepository.getStatsByUserId(userId, filters);
    return stats;
  }

  async getCategoryStats(userId, filters = {}) {
    const stats = await expenseRepository.getStatsByCategory(userId, filters);
    return stats;
  }

  async getTagStats(userId, filters = {}) {
    const stats = await expenseRepository.getStatsByTag(userId, filters);
    return stats;
  }

  async getMonthlyStats(userId, filters = {}) {
    const stats = await expenseRepository.getStatsByMonth(userId, filters);
    return stats;
  }

  async getTrends(userId, filters = {}) {
    const trends = await expenseRepository.getTrends(userId, filters);
    return trends;
  }

  // Export functionality
  async exportExpenses(userId, options) {
    const { format, startDate, endDate } = options;

    const filters = {};
    if (startDate) filters.startDate = startDate;
    if (endDate) filters.endDate = endDate;

    const result = await expenseRepository.findByUserId(userId, {
      filters,
      sort: { field: 'date', order: 'desc' },
      pagination: { page: 1, limit: 10000 } // Get all expenses
    });

    const expenses = result.expenses.map(e => new Expense(e).toJSON());

    if (format === EXPENSE_CONSTANTS.EXPORT_FORMATS.JSON) {
      return {
        format: 'json',
        data: expenses,
        count: expenses.length
      };
    } else if (format === EXPENSE_CONSTANTS.EXPORT_FORMATS.CSV) {
      const csv = this.convertToCSV(expenses);
      return {
        format: 'csv',
        data: csv,
        count: expenses.length
      };
    }

    throw new AppError(
      ERROR_MESSAGES.EXPENSE.INVALID_EXPORT_FORMAT,
      HTTP_STATUS.BAD_REQUEST
    );
  }

  convertToCSV(expenses) {
    if (expenses.length === 0) {
      return 'No expenses to export';
    }

    // CSV headers
    const headers = ['Date', 'Description', 'Amount', 'Category ID', 'Tags', 'Payment Method', 'Notes'];
    const csvRows = [headers.join(',')];

    // Add data rows
    expenses.forEach(expense => {
      const row = [
        expense.date,
        `"${expense.description.replace(/"/g, '""')}"`, // Escape quotes
        expense.amount,
        expense.categoryId || '',
        `"${(expense.tags || []).join(';')}"`,
        expense.paymentMethod,
        `"${(expense.notes || '').replace(/"/g, '""')}"`
      ];
      csvRows.push(row.join(','));
    });

    return csvRows.join('\n');
  }

  // Import functionality
  async importExpenses(userId, expensesData) {
    const imported = [];
    const errors = [];

    for (let i = 0; i < expensesData.length; i++) {
      try {
        const expenseData = expensesData[i];
        const expense = await this.createExpense(userId, expenseData);
        imported.push(expense);
      } catch (error) {
        errors.push({
          index: i,
          data: expensesData[i],
          error: error.message
        });
      }
    }

    return {
      imported: imported.length,
      failed: errors.length,
      total: expensesData.length,
      expenses: imported,
      errors
    };
  }

  // Search functionality
  async searchExpenses(userId, searchParams) {
    const {
      query,
      categoryId,
      tags,
      startDate,
      endDate,
      minAmount,
      maxAmount,
      page = 1,
      limit = 50
    } = searchParams;

    const filters = {
      search: query
    };
    if (categoryId) filters.categoryId = categoryId;
    if (tags) filters.tags = Array.isArray(tags) ? tags : [tags];
    if (startDate) filters.startDate = startDate;
    if (endDate) filters.endDate = endDate;
    if (minAmount) filters.minAmount = minAmount;
    if (maxAmount) filters.maxAmount = maxAmount;

    const result = await expenseRepository.findByUserId(userId, {
      filters,
      sort: { field: 'date', order: 'desc' },
      pagination: { page: parseInt(page), limit: parseInt(limit) }
    });

    return {
      expenses: result.expenses.map(e => new Expense(e).toJSON()),
      pagination: result.pagination
    };
  }
}

module.exports = new ExpenseService();
