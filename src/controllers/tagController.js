const tagService = require('../services/tagService');
const {
  HTTP_STATUS,
  RESPONSE_MESSAGES,
  COMMON_CONSTANTS
} = require('../constants');

class TagController {
  async createTag(req, res, next) {
    try {
      const userId = req.user.userId;
      const tag = await tagService.createTag(userId, req.body);
      res.status(HTTP_STATUS.CREATED).json({
        success: COMMON_CONSTANTS.RESPONSE_STATUS.SUCCESS,
        message: RESPONSE_MESSAGES.TAG.CREATED,
        data: { tag }
      });
    } catch (error) {
      next(error);
    }
  }

  async getAllTags(req, res, next) {
    try {
      const userId = req.user.userId;
      const tags = await tagService.getAllTags(userId);
      res.status(HTTP_STATUS.OK).json({
        success: COMMON_CONSTANTS.RESPONSE_STATUS.SUCCESS,
        message: RESPONSE_MESSAGES.TAG.LIST_FETCHED,
        data: { tags, count: tags.length }
      });
    } catch (error) {
      next(error);
    }
  }

  async getTagById(req, res, next) {
    try {
      const userId = req.user.userId;
      const tagId = req.params.id;
      const tag = await tagService.getTagById(userId, tagId);
      res.status(HTTP_STATUS.OK).json({
        success: COMMON_CONSTANTS.RESPONSE_STATUS.SUCCESS,
        message: RESPONSE_MESSAGES.TAG.FETCHED,
        data: { tag }
      });
    } catch (error) {
      next(error);
    }
  }

  async updateTag(req, res, next) {
    try {
      const userId = req.user.userId;
      const tagId = req.params.id;
      const tag = await tagService.updateTag(userId, tagId, req.body);
      res.status(HTTP_STATUS.OK).json({
        success: COMMON_CONSTANTS.RESPONSE_STATUS.SUCCESS,
        message: RESPONSE_MESSAGES.TAG.UPDATED,
        data: { tag }
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteTag(req, res, next) {
    try {
      const userId = req.user.userId;
      const tagId = req.params.id;
      const tag = await tagService.deleteTag(userId, tagId);
      res.status(HTTP_STATUS.OK).json({
        success: COMMON_CONSTANTS.RESPONSE_STATUS.SUCCESS,
        message: RESPONSE_MESSAGES.TAG.DELETED,
        data: { tag }
      });
    } catch (error) {
      next(error);
    }
  }

  async getExpensesByTag(req, res, next) {
    try {
      const userId = req.user.userId;
      const tagId = req.params.id;
      const expenses = await tagService.getExpensesByTag(userId, tagId);
      res.status(HTTP_STATUS.OK).json({
        success: COMMON_CONSTANTS.RESPONSE_STATUS.SUCCESS,
        data: { expenses, count: expenses.length }
      });
    } catch (error) {
      next(error);
    }
  }

  async mergeTags(req, res, next) {
    try {
      const userId = req.user.userId;
      const sourceTagId = req.params.id;
      const { targetTagId } = req.body;
      const result = await tagService.mergeTags(userId, sourceTagId, targetTagId);
      res.status(HTTP_STATUS.OK).json({
        success: COMMON_CONSTANTS.RESPONSE_STATUS.SUCCESS,
        message: RESPONSE_MESSAGES.TAG.MERGED,
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  async getTagStatistics(req, res, next) {
    try {
      const userId = req.user.userId;
      const tagId = req.params.id;
      const statistics = await tagService.getTagStatistics(userId, tagId);
      res.status(HTTP_STATUS.OK).json({
        success: COMMON_CONSTANTS.RESPONSE_STATUS.SUCCESS,
        data: statistics
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new TagController();
