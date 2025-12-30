const expenseService = require('../services/expenseService');
const {
  HTTP_STATUS,
  RESPONSE_MESSAGES,
  COMMON_CONSTANTS
} = require('../constants');

class ExpenseController {
  async createExpense(req, res, next) {
    try {
      const userId = req.user.userId;
      const expense = await expenseService.createExpense(userId, req.body);
      res.status(HTTP_STATUS.CREATED).json({
        success: COMMON_CONSTANTS.RESPONSE_STATUS.SUCCESS,
        message: RESPONSE_MESSAGES.EXPENSE.CREATED,
        data: { expense }
      });
    } catch (error) {
      next(error);
    }
  }

  async getAllExpenses(req, res, next) {
    try {
      const userId = req.user.userId;
      const result = await expenseService.getAllExpenses(userId, req.query);
      res.status(HTTP_STATUS.OK).json({
        success: COMMON_CONSTANTS.RESPONSE_STATUS.SUCCESS,
        message: RESPONSE_MESSAGES.EXPENSE.LIST_FETCHED,
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  async getExpenseById(req, res, next) {
    try {
      const userId = req.user.userId;
      const expenseId = req.params.id;
      const expense = await expenseService.getExpenseById(userId, expenseId);
      res.status(HTTP_STATUS.OK).json({
        success: COMMON_CONSTANTS.RESPONSE_STATUS.SUCCESS,
        message: RESPONSE_MESSAGES.EXPENSE.FETCHED,
        data: { expense }
      });
    } catch (error) {
      next(error);
    }
  }

  async updateExpense(req, res, next) {
    try {
      const userId = req.user.userId;
      const expenseId = req.params.id;
      const expense = await expenseService.updateExpense(userId, expenseId, req.body);
      res.status(HTTP_STATUS.OK).json({
        success: COMMON_CONSTANTS.RESPONSE_STATUS.SUCCESS,
        message: RESPONSE_MESSAGES.EXPENSE.UPDATED,
        data: { expense }
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteExpense(req, res, next) {
    try {
      const userId = req.user.userId;
      const expenseId = req.params.id;
      const expense = await expenseService.deleteExpense(userId, expenseId);
      res.status(HTTP_STATUS.OK).json({
        success: COMMON_CONSTANTS.RESPONSE_STATUS.SUCCESS,
        message: RESPONSE_MESSAGES.EXPENSE.DELETED,
        data: { expense }
      });
    } catch (error) {
      next(error);
    }
  }

  // Statistics endpoints
  async getSummaryStats(req, res, next) {
    try {
      const userId = req.user.userId;
      const filters = ExpenseController.extractFilters(req.query);
      const stats = await expenseService.getSummaryStats(userId, filters);
      res.status(HTTP_STATUS.OK).json({
        success: COMMON_CONSTANTS.RESPONSE_STATUS.SUCCESS,
        message: RESPONSE_MESSAGES.EXPENSE.STATS_FETCHED,
        data: { stats }
      });
    } catch (error) {
      next(error);
    }
  }

  async getCategoryStats(req, res, next) {
    try {
      const userId = req.user.userId;
      const filters = ExpenseController.extractFilters(req.query);
      const stats = await expenseService.getCategoryStats(userId, filters);
      res.status(HTTP_STATUS.OK).json({
        success: COMMON_CONSTANTS.RESPONSE_STATUS.SUCCESS,
        message: RESPONSE_MESSAGES.EXPENSE.STATS_FETCHED,
        data: { stats }
      });
    } catch (error) {
      next(error);
    }
  }

  async getTagStats(req, res, next) {
    try {
      const userId = req.user.userId;
      const filters = ExpenseController.extractFilters(req.query);
      const stats = await expenseService.getTagStats(userId, filters);
      res.status(HTTP_STATUS.OK).json({
        success: COMMON_CONSTANTS.RESPONSE_STATUS.SUCCESS,
        message: RESPONSE_MESSAGES.EXPENSE.STATS_FETCHED,
        data: { stats }
      });
    } catch (error) {
      next(error);
    }
  }

  async getMonthlyStats(req, res, next) {
    try {
      const userId = req.user.userId;
      const filters = ExpenseController.extractFilters(req.query);
      const stats = await expenseService.getMonthlyStats(userId, filters);
      res.status(HTTP_STATUS.OK).json({
        success: COMMON_CONSTANTS.RESPONSE_STATUS.SUCCESS,
        message: RESPONSE_MESSAGES.EXPENSE.STATS_FETCHED,
        data: { stats }
      });
    } catch (error) {
      next(error);
    }
  }

  async getTrends(req, res, next) {
    try {
      const userId = req.user.userId;
      const filters = ExpenseController.extractFilters(req.query);
      const trends = await expenseService.getTrends(userId, filters);
      res.status(HTTP_STATUS.OK).json({
        success: COMMON_CONSTANTS.RESPONSE_STATUS.SUCCESS,
        message: RESPONSE_MESSAGES.EXPENSE.STATS_FETCHED,
        data: trends
      });
    } catch (error) {
      next(error);
    }
  }

  // Export endpoint
  async exportExpenses(req, res, next) {
    try {
      const userId = req.user.userId;
      const result = await expenseService.exportExpenses(userId, req.body);

      if (result.format === 'csv') {
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename=expenses-${Date.now()}.csv`);
        res.status(HTTP_STATUS.OK).send(result.data);
      } else {
        res.status(HTTP_STATUS.OK).json({
          success: COMMON_CONSTANTS.RESPONSE_STATUS.SUCCESS,
          message: RESPONSE_MESSAGES.EXPENSE.EXPORTED,
          data: result
        });
      }
    } catch (error) {
      next(error);
    }
  }

  // Import endpoint
  async importExpenses(req, res, next) {
    try {
      const userId = req.user.userId;
      const result = await expenseService.importExpenses(userId, req.body.expenses);
      res.status(HTTP_STATUS.CREATED).json({
        success: COMMON_CONSTANTS.RESPONSE_STATUS.SUCCESS,
        message: RESPONSE_MESSAGES.EXPENSE.IMPORTED,
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  // Search endpoint
  async searchExpenses(req, res, next) {
    try {
      const userId = req.user.userId;
      const result = await expenseService.searchExpenses(userId, req.query);
      res.status(HTTP_STATUS.OK).json({
        success: COMMON_CONSTANTS.RESPONSE_STATUS.SUCCESS,
        message: RESPONSE_MESSAGES.EXPENSE.LIST_FETCHED,
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  // Helper method to extract filters from query params
  static extractFilters(query) {
    const filters = {};
    if (query.categoryId) filters.categoryId = query.categoryId;
    if (query.tags) filters.tags = Array.isArray(query.tags) ? query.tags : [query.tags];
    if (query.startDate) filters.startDate = query.startDate;
    if (query.endDate) filters.endDate = query.endDate;
    if (query.minAmount) filters.minAmount = query.minAmount;
    if (query.maxAmount) filters.maxAmount = query.maxAmount;
    if (query.paymentMethod) filters.paymentMethod = query.paymentMethod;
    return filters;
  }
}

module.exports = new ExpenseController();
