const fs = require('fs').promises;
const path = require('path');
const sharp = require('sharp');
const attachmentRepository = require('../repositories/AttachmentRepository');
const Attachment = require('../models/Attachment');
const AppError = require('../utils/AppError');
const {
  ERROR_MESSAGES,
  HTTP_STATUS,
  ATTACHMENT_CONSTANTS
} = require('../constants');

class AttachmentService {
  /**
   * Upload attachment for an expense
   */
  async uploadAttachment(userId, expenseId, file, description = '') {
    // Check if expense already has too many attachments
    const count = await attachmentRepository.countByExpenseId(expenseId);
    if (count >= ATTACHMENT_CONSTANTS.LIMITS.MAX_FILES_PER_EXPENSE) {
      // Delete the uploaded file
      await this.deleteFile(file.path);
      throw new AppError(
        ERROR_MESSAGES.ATTACHMENT.MAX_FILES_EXCEEDED,
        HTTP_STATUS.BAD_REQUEST
      );
    }

    // Determine category based on MIME type
    let category = ATTACHMENT_CONSTANTS.CATEGORIES.OTHER;
    if (ATTACHMENT_CONSTANTS.ALLOWED_MIME_TYPES.IMAGES.includes(file.mimetype)) {
      category = ATTACHMENT_CONSTANTS.CATEGORIES.IMAGE;
    } else if (file.mimetype === 'application/pdf') {
      category = ATTACHMENT_CONSTANTS.CATEGORIES.RECEIPT;
    } else if (ATTACHMENT_CONSTANTS.ALLOWED_MIME_TYPES.DOCUMENTS.includes(file.mimetype)) {
      category = ATTACHMENT_CONSTANTS.CATEGORIES.DOCUMENT;
    }

    // Create attachment record
    const attachment = new Attachment({
      userId,
      expenseId,
      originalName: file.originalname,
      filename: file.filename,
      mimeType: file.mimetype,
      size: file.size,
      path: file.path,
      category,
      description
    });

    // Generate thumbnail for images
    if (attachment.isImage()) {
      try {
        const thumbnailPath = await this.generateThumbnail(file.path, file.filename);
        attachment.thumbnailPath = thumbnailPath;
      } catch (error) {
        console.error('Thumbnail generation failed:', error);
        // Don't fail the upload if thumbnail generation fails
      }
    }

    // Validate
    const validation = attachment.validate();
    if (!validation.isValid) {
      // Delete uploaded file on validation failure
      await this.deleteFile(file.path);
      if (attachment.thumbnailPath) {
        await this.deleteFile(attachment.thumbnailPath);
      }
      throw new AppError(
        validation.errors.join(', '),
        HTTP_STATUS.BAD_REQUEST
      );
    }

    const created = await attachmentRepository.create(attachment);
    return new Attachment(created).toJSON();
  }

  /**
   * Get all attachments for an expense
   */
  async getExpenseAttachments(userId, expenseId) {
    const attachments = await attachmentRepository.findByUserIdAndExpenseId(userId, expenseId);
    return attachments.map(a => new Attachment(a).toJSON());
  }

  /**
   * Get attachment by ID
   */
  async getAttachmentById(userId, attachmentId) {
    const attachment = await attachmentRepository.findByUserIdAndId(userId, attachmentId);
    if (!attachment) {
      throw new AppError(
        ERROR_MESSAGES.ATTACHMENT.NOT_FOUND,
        HTTP_STATUS.NOT_FOUND
      );
    }
    return new Attachment(attachment).toJSON();
  }

  /**
   * Delete attachment
   */
  async deleteAttachment(userId, attachmentId) {
    const attachment = await attachmentRepository.findByUserIdAndId(userId, attachmentId);
    if (!attachment) {
      throw new AppError(
        ERROR_MESSAGES.ATTACHMENT.NOT_FOUND,
        HTTP_STATUS.NOT_FOUND
      );
    }

    // Delete physical files
    try {
      await this.deleteFile(attachment.path);
      if (attachment.thumbnailPath) {
        await this.deleteFile(attachment.thumbnailPath);
      }
    } catch (error) {
      console.error('Error deleting files:', error);
      // Continue with database deletion even if file deletion fails
    }

    // Delete from database
    const deleted = await attachmentRepository.deleteByUserIdAndId(userId, attachmentId);
    return new Attachment(deleted).toJSON();
  }

  /**
   * Get file path for download
   */
  async getFilePath(userId, attachmentId) {
    const attachment = await attachmentRepository.findByUserIdAndId(userId, attachmentId);
    if (!attachment) {
      throw new AppError(
        ERROR_MESSAGES.ATTACHMENT.NOT_FOUND,
        HTTP_STATUS.NOT_FOUND
      );
    }

    // Check if file exists
    try {
      await fs.access(attachment.path);
    } catch (error) {
      throw new AppError(
        ERROR_MESSAGES.ATTACHMENT.FILE_NOT_FOUND,
        HTTP_STATUS.NOT_FOUND
      );
    }

    return {
      filePath: attachment.path,
      originalName: attachment.originalName,
      mimeType: attachment.mimeType
    };
  }

  /**
   * Get thumbnail path
   */
  async getThumbnailPath(userId, attachmentId) {
    const attachment = await attachmentRepository.findByUserIdAndId(userId, attachmentId);
    if (!attachment) {
      throw new AppError(
        ERROR_MESSAGES.ATTACHMENT.NOT_FOUND,
        HTTP_STATUS.NOT_FOUND
      );
    }

    if (!attachment.thumbnailPath) {
      throw new AppError(
        'Thumbnail not available for this attachment',
        HTTP_STATUS.NOT_FOUND
      );
    }

    // Check if thumbnail exists
    try {
      await fs.access(attachment.thumbnailPath);
    } catch (error) {
      throw new AppError(
        ERROR_MESSAGES.ATTACHMENT.FILE_NOT_FOUND,
        HTTP_STATUS.NOT_FOUND
      );
    }

    return {
      filePath: attachment.thumbnailPath,
      mimeType: 'image/jpeg'
    };
  }

  /**
   * Generate thumbnail for an image
   */
  async generateThumbnail(imagePath, filename) {
    const thumbnailFilename = `thumb_${filename}`;
    const thumbnailPath = path.join(
      ATTACHMENT_CONSTANTS.PATHS.THUMBNAILS,
      thumbnailFilename
    );

    await sharp(imagePath)
      .resize(
        ATTACHMENT_CONSTANTS.THUMBNAIL.WIDTH,
        ATTACHMENT_CONSTANTS.THUMBNAIL.HEIGHT,
        {
          fit: 'cover',
          position: 'center'
        }
      )
      .jpeg({
        quality: ATTACHMENT_CONSTANTS.THUMBNAIL.QUALITY
      })
      .toFile(thumbnailPath);

    return thumbnailPath;
  }

  /**
   * Delete a file from filesystem
   */
  async deleteFile(filePath) {
    try {
      await fs.unlink(filePath);
    } catch (error) {
      if (error.code !== 'ENOENT') {
        // Ignore file not found errors
        throw error;
      }
    }
  }

  /**
   * Delete all attachments for an expense
   */
  async deleteExpenseAttachments(expenseId) {
    const attachments = await attachmentRepository.findByExpenseId(expenseId);

    for (const attachment of attachments) {
      try {
        await this.deleteFile(attachment.path);
        if (attachment.thumbnailPath) {
          await this.deleteFile(attachment.thumbnailPath);
        }
      } catch (error) {
        console.error('Error deleting file:', error);
      }
    }

    await attachmentRepository.deleteByExpenseId(expenseId);
  }

  /**
   * Get storage statistics for a user
   */
  async getUserStorageStats(userId) {
    const totalBytes = await attachmentRepository.getTotalStorageByUserId(userId);
    const attachments = await attachmentRepository.findByUserId(userId);

    return {
      totalFiles: attachments.length,
      totalBytes,
      totalMB: (totalBytes / (1024 * 1024)).toFixed(2),
      byCategory: this.groupByCategory(attachments)
    };
  }

  /**
   * Group attachments by category
   */
  groupByCategory(attachments) {
    const grouped = {};

    attachments.forEach(attachment => {
      const category = attachment.category || ATTACHMENT_CONSTANTS.CATEGORIES.OTHER;
      if (!grouped[category]) {
        grouped[category] = {
          count: 0,
          totalSize: 0
        };
      }
      grouped[category].count++;
      grouped[category].totalSize += attachment.size || 0;
    });

    return grouped;
  }
}

module.exports = new AttachmentService();
