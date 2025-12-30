const attachmentService = require('../services/attachmentService');
const AppError = require('../utils/AppError');
const {
  HTTP_STATUS,
  RESPONSE_MESSAGES,
  ERROR_MESSAGES
} = require('../constants');

class AttachmentController {
  /**
   * Upload attachment to an expense
   */
  async uploadAttachment(req, res, next) {
    try {
      const userId = req.user.userId;
      const expenseId = req.params.expenseId;
      const description = req.body.description || '';

      if (!req.file) {
        throw new AppError(
          'No file uploaded',
          HTTP_STATUS.BAD_REQUEST
        );
      }

      const attachment = await attachmentService.uploadAttachment(
        userId,
        expenseId,
        req.file,
        description
      );

      res.status(HTTP_STATUS.CREATED).json({
        success: true,
        message: RESPONSE_MESSAGES.ATTACHMENT.UPLOADED,
        data: { attachment }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get all attachments for an expense
   */
  async getExpenseAttachments(req, res, next) {
    try {
      const userId = req.user.userId;
      const expenseId = req.params.expenseId;

      const attachments = await attachmentService.getExpenseAttachments(userId, expenseId);

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: RESPONSE_MESSAGES.ATTACHMENT.LIST_FETCHED,
        data: { attachments, count: attachments.length }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get attachment by ID
   */
  async getAttachmentById(req, res, next) {
    try {
      const userId = req.user.userId;
      const attachmentId = req.params.id;

      const attachment = await attachmentService.getAttachmentById(userId, attachmentId);

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: RESPONSE_MESSAGES.ATTACHMENT.FETCHED,
        data: { attachment }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete attachment
   */
  async deleteAttachment(req, res, next) {
    try {
      const userId = req.user.userId;
      const attachmentId = req.params.id;

      const attachment = await attachmentService.deleteAttachment(userId, attachmentId);

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: RESPONSE_MESSAGES.ATTACHMENT.DELETED,
        data: { attachment }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Download attachment file
   */
  async downloadAttachment(req, res, next) {
    try {
      const userId = req.user.userId;
      const attachmentId = req.params.id;

      const { filePath, originalName, mimeType } = await attachmentService.getFilePath(
        userId,
        attachmentId
      );

      res.setHeader('Content-Type', mimeType);
      res.setHeader('Content-Disposition', `attachment; filename="${originalName}"`);
      res.sendFile(filePath, { root: '.' }, (err) => {
        if (err) {
          next(new AppError(
            ERROR_MESSAGES.ATTACHMENT.FILE_NOT_FOUND,
            HTTP_STATUS.NOT_FOUND
          ));
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get attachment thumbnail
   */
  async getThumbnail(req, res, next) {
    try {
      const userId = req.user.userId;
      const attachmentId = req.params.id;

      const { filePath, mimeType } = await attachmentService.getThumbnailPath(
        userId,
        attachmentId
      );

      res.setHeader('Content-Type', mimeType);
      res.sendFile(filePath, { root: '.' }, (err) => {
        if (err) {
          next(new AppError(
            ERROR_MESSAGES.ATTACHMENT.FILE_NOT_FOUND,
            HTTP_STATUS.NOT_FOUND
          ));
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get user storage statistics
   */
  async getStorageStats(req, res, next) {
    try {
      const userId = req.user.userId;

      const stats = await attachmentService.getUserStorageStats(userId);

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: 'Storage statistics fetched successfully',
        data: { stats }
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AttachmentController();
