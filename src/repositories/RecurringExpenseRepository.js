const RecurringExpense = require('../models/RecurringExpense');

class RecurringExpenseRepository {
  async findById(id) {
    return await RecurringExpense.findById(id).lean();
  }

  async find(query = {}) {
    return await RecurringExpense.find(query).lean();
  }

  async findOne(query) {
    return await RecurringExpense.findOne(query).lean();
  }

  async create(data) {
    const recurringExpense = new RecurringExpense(data);
    await recurringExpense.save();
    return recurringExpense.toJSON();
  }

  async updateById(id, updates) {
    const recurringExpense = await RecurringExpense.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    ).lean();
    return recurringExpense;
  }

  async deleteById(id) {
    const result = await RecurringExpense.findByIdAndDelete(id);
    return !!result;
  }

  async count(query = {}) {
    return await RecurringExpense.countDocuments(query);
  }

  async findByUserId(userId) {
    return await this.find({ userId });
  }

  async findActiveByUserId(userId) {
    return await RecurringExpense.find({ userId, isActive: true }).lean();
  }

  async findByUserIdAndId(userId, recurringId) {
    return await RecurringExpense.findOne({ _id: recurringId, userId }).lean();
  }

  async deleteByUserIdAndId(userId, recurringId) {
    const result = await RecurringExpense.findOneAndDelete({ _id: recurringId, userId });
    return !!result;
  }

  async updateByUserIdAndId(userId, recurringId, updates) {
    return await RecurringExpense.findOneAndUpdate(
      { _id: recurringId, userId },
      { $set: updates },
      { new: true, runValidators: true }
    ).lean();
  }

  /**
   * Find all recurring expenses that should generate today
   */
  async findDueForGeneration() {
    const today = new Date().toISOString().split('T')[0];

    return await RecurringExpense.find({
      isActive: true,
      nextOccurrence: today,
      lastGenerated: { $ne: today },
      $or: [
        { endDate: null },
        { endDate: { $gte: today } }
      ]
    }).lean();
  }

  /**
   * Get upcoming recurring expenses (next 30 days)
   */
  async findUpcoming(userId, days = 30) {
    const today = new Date();
    const futureDate = new Date();
    futureDate.setDate(today.getDate() + days);

    const todayStr = today.toISOString().split('T')[0];
    const futureStr = futureDate.toISOString().split('T')[0];

    return await RecurringExpense.find({
      userId,
      isActive: true,
      nextOccurrence: {
        $gte: todayStr,
        $lte: futureStr
      }
    }).sort({ nextOccurrence: 1 }).lean();
  }
}

module.exports = new RecurringExpenseRepository();
