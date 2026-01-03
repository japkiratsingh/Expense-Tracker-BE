const Attachment = require('../models/Attachment');

class AttachmentRepository {
  async findById(id) {
    return await Attachment.findById(id).lean();
  }

  async find(query = {}) {
    return await Attachment.find(query).lean();
  }

  async findOne(query) {
    return await Attachment.findOne(query).lean();
  }

  async create(data) {
    const attachment = new Attachment(data);
    await attachment.save();
    return attachment.toJSON();
  }

  async updateById(id, updates) {
    const attachment = await Attachment.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    ).lean();
    return attachment;
  }

  async deleteById(id) {
    const result = await Attachment.findByIdAndDelete(id);
    return !!result;
  }

  async count(query = {}) {
    return await Attachment.countDocuments(query);
  }

  /**
   * Find all attachments for a user
   */
  async findByUserId(userId) {
    return await this.find({ userId });
  }

  /**
   * Find all attachments for an expense
   */
  async findByExpenseId(expenseId) {
    return await this.find({ expenseId });
  }

  /**
   * Find attachments by user and expense
   */
  async findByUserIdAndExpenseId(userId, expenseId) {
    return await this.find({ userId, expenseId });
  }

  /**
   * Find attachment by ID and user ID (for authorization)
   */
  async findByUserIdAndId(userId, attachmentId) {
    return await Attachment.findOne({ _id: attachmentId, userId }).lean();
  }

  /**
   * Delete attachment by ID and user ID (for authorization)
   */
  async deleteByUserIdAndId(userId, attachmentId) {
    const result = await Attachment.findOneAndDelete({ _id: attachmentId, userId });
    return !!result;
  }

  /**
   * Delete all attachments for an expense
   */
  async deleteByExpenseId(expenseId) {
    const attachments = await this.findByExpenseId(expenseId);
    await Attachment.deleteMany({ expenseId });
    return attachments;
  }

  /**
   * Count attachments for an expense
   */
  async countByExpenseId(expenseId) {
    return await this.count({ expenseId });
  }

  /**
   * Get total storage size for a user
   */
  async getTotalStorageByUserId(userId) {
    const result = await Attachment.aggregate([
      { $match: { userId } },
      { $group: { _id: null, totalSize: { $sum: '$size' } } }
    ]);

    return result.length > 0 ? result[0].totalSize : 0;
  }

  /**
   * Find attachments by category
   */
  async findByCategory(userId, category) {
    return await Attachment.find({ userId, category }).lean();
  }
}

module.exports = new AttachmentRepository();
