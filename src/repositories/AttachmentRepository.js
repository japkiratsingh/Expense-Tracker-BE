const path = require('path');
const BaseRepository = require('./BaseRepository');

class AttachmentRepository extends BaseRepository {
  constructor() {
    super(path.join(__dirname, '../../data/attachments.json'));
  }

  /**
   * Find all attachments for a user
   */
  async findByUserId(userId) {
    return this.find({ userId });
  }

  /**
   * Find all attachments for an expense
   */
  async findByExpenseId(expenseId) {
    return this.find({ expenseId });
  }

  /**
   * Find attachments by user and expense
   */
  async findByUserIdAndExpenseId(userId, expenseId) {
    return this.find({ userId, expenseId });
  }

  /**
   * Find attachment by ID and user ID (for authorization)
   */
  async findByUserIdAndId(userId, attachmentId) {
    const attachment = await this.findById(attachmentId);
    if (!attachment || attachment.userId !== userId) {
      return null;
    }
    return attachment;
  }

  /**
   * Delete attachment by ID and user ID (for authorization)
   */
  async deleteByUserIdAndId(userId, attachmentId) {
    const attachment = await this.findByUserIdAndId(userId, attachmentId);
    if (!attachment) {
      return null;
    }
    return this.deleteById(attachmentId);
  }

  /**
   * Delete all attachments for an expense
   */
  async deleteByExpenseId(expenseId) {
    await this.ensureLoaded();
    const attachments = this.data.filter(a => a.expenseId === expenseId);

    for (const attachment of attachments) {
      await this.deleteById(attachment._id);
    }

    return attachments;
  }

  /**
   * Count attachments for an expense
   */
  async countByExpenseId(expenseId) {
    const attachments = await this.findByExpenseId(expenseId);
    return attachments.length;
  }

  /**
   * Get total storage size for a user
   */
  async getTotalStorageByUserId(userId) {
    const attachments = await this.findByUserId(userId);
    return attachments.reduce((total, attachment) => total + (attachment.size || 0), 0);
  }

  /**
   * Find attachments by category
   */
  async findByCategory(userId, category) {
    const attachments = await this.findByUserId(userId);
    return attachments.filter(a => a.category === category);
  }
}

module.exports = new AttachmentRepository();
