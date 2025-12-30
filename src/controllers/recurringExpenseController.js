const recurringExpenseService = require('../services/recurringExpenseService');
const {
  HTTP_STATUS,
  RESPONSE_MESSAGES,
  COMMON_CONSTANTS
} = require('../constants');

class RecurringExpenseController {
  async createRecurring(req, res, next) {
    try {
      const userId = req.user.userId;
      const recurring = await recurringExpenseService.createRecurring(userId, req.body);
      res.status(HTTP_STATUS.CREATED).json({
        success: COMMON_CONSTANTS.RESPONSE_STATUS.SUCCESS,
        message: RESPONSE_MESSAGES.RECURRING.CREATED,
        data: { recurring }
      });
    } catch (error) {
      next(error);
    }
  }

  async getAllRecurring(req, res, next) {
    try {
      const userId = req.user.userId;
      const recurring = await recurringExpenseService.getAllRecurring(userId);
      res.status(HTTP_STATUS.OK).json({
        success: COMMON_CONSTANTS.RESPONSE_STATUS.SUCCESS,
        message: RESPONSE_MESSAGES.RECURRING.LIST_FETCHED,
        data: { recurring, count: recurring.length }
      });
    } catch (error) {
      next(error);
    }
  }

  async getRecurringById(req, res, next) {
    try {
      const userId = req.user.userId;
      const recurringId = req.params.id;
      const recurring = await recurringExpenseService.getRecurringById(userId, recurringId);
      res.status(HTTP_STATUS.OK).json({
        success: COMMON_CONSTANTS.RESPONSE_STATUS.SUCCESS,
        message: RESPONSE_MESSAGES.RECURRING.FETCHED,
        data: { recurring }
      });
    } catch (error) {
      next(error);
    }
  }

  async updateRecurring(req, res, next) {
    try {
      const userId = req.user.userId;
      const recurringId = req.params.id;
      const recurring = await recurringExpenseService.updateRecurring(userId, recurringId, req.body);
      res.status(HTTP_STATUS.OK).json({
        success: COMMON_CONSTANTS.RESPONSE_STATUS.SUCCESS,
        message: RESPONSE_MESSAGES.RECURRING.UPDATED,
        data: { recurring }
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteRecurring(req, res, next) {
    try {
      const userId = req.user.userId;
      const recurringId = req.params.id;
      const recurring = await recurringExpenseService.deleteRecurring(userId, recurringId);
      res.status(HTTP_STATUS.OK).json({
        success: COMMON_CONSTANTS.RESPONSE_STATUS.SUCCESS,
        message: RESPONSE_MESSAGES.RECURRING.DELETED,
        data: { recurring }
      });
    } catch (error) {
      next(error);
    }
  }

  async pauseRecurring(req, res, next) {
    try {
      const userId = req.user.userId;
      const recurringId = req.params.id;
      const recurring = await recurringExpenseService.pauseRecurring(userId, recurringId);
      res.status(HTTP_STATUS.OK).json({
        success: COMMON_CONSTANTS.RESPONSE_STATUS.SUCCESS,
        message: RESPONSE_MESSAGES.RECURRING.PAUSED,
        data: { recurring }
      });
    } catch (error) {
      next(error);
    }
  }

  async resumeRecurring(req, res, next) {
    try {
      const userId = req.user.userId;
      const recurringId = req.params.id;
      const recurring = await recurringExpenseService.resumeRecurring(userId, recurringId);
      res.status(HTTP_STATUS.OK).json({
        success: COMMON_CONSTANTS.RESPONSE_STATUS.SUCCESS,
        message: RESPONSE_MESSAGES.RECURRING.RESUMED,
        data: { recurring }
      });
    } catch (error) {
      next(error);
    }
  }

  async generateExpense(req, res, next) {
    try {
      const userId = req.user.userId;
      const recurringId = req.params.id;
      const result = await recurringExpenseService.generateExpense(userId, recurringId);
      res.status(HTTP_STATUS.CREATED).json({
        success: COMMON_CONSTANTS.RESPONSE_STATUS.SUCCESS,
        message: RESPONSE_MESSAGES.RECURRING.GENERATED,
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  async getGeneratedHistory(req, res, next) {
    try {
      const userId = req.user.userId;
      const recurringId = req.params.id;
      const history = await recurringExpenseService.getGeneratedHistory(userId, recurringId);
      res.status(HTTP_STATUS.OK).json({
        success: COMMON_CONSTANTS.RESPONSE_STATUS.SUCCESS,
        message: RESPONSE_MESSAGES.RECURRING.HISTORY_FETCHED,
        data: { expenses: history, count: history.length }
      });
    } catch (error) {
      next(error);
    }
  }

  async getUpcoming(req, res, next) {
    try {
      const userId = req.user.userId;
      const days = parseInt(req.query.days) || 30;
      const upcoming = await recurringExpenseService.getUpcoming(userId, days);
      res.status(HTTP_STATUS.OK).json({
        success: COMMON_CONSTANTS.RESPONSE_STATUS.SUCCESS,
        message: RESPONSE_MESSAGES.RECURRING.UPCOMING_FETCHED,
        data: { recurring: upcoming, count: upcoming.length }
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new RecurringExpenseController();
