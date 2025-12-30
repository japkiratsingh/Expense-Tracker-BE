const path = require('path');
const BaseRepository = require('./BaseRepository');

class RecurringExpenseRepository extends BaseRepository {
  constructor() {
    super(path.join(__dirname, '../../data/recurring-expenses.json'));
  }

  async findByUserId(userId) {
    return this.find({ userId });
  }

  async findActiveByUserId(userId) {
    const recurring = await this.findByUserId(userId);
    return recurring.filter(r => r.isActive);
  }

  async findByUserIdAndId(userId, recurringId) {
    const recurring = await this.findById(recurringId);
    if (!recurring || recurring.userId !== userId) {
      return null;
    }
    return recurring;
  }

  async deleteByUserIdAndId(userId, recurringId) {
    const recurring = await this.findByUserIdAndId(userId, recurringId);
    if (!recurring) {
      return null;
    }
    return this.deleteById(recurringId);
  }

  async updateByUserIdAndId(userId, recurringId, updates) {
    const recurring = await this.findByUserIdAndId(userId, recurringId);
    if (!recurring) {
      return null;
    }
    return this.updateById(recurringId, updates);
  }

  /**
   * Find all recurring expenses that should generate today
   */
  async findDueForGeneration() {
    await this.ensureLoaded();
    const today = new Date().toISOString().split('T')[0];

    return this.data.filter(recurring => {
      if (!recurring.isActive) return false;
      if (recurring.nextOccurrence !== today) return false;
      if (recurring.lastGenerated === today) return false;
      if (recurring.endDate && today > recurring.endDate) return false;
      return true;
    });
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

    const recurring = await this.findActiveByUserId(userId);

    return recurring.filter(r => {
      return r.nextOccurrence >= todayStr && r.nextOccurrence <= futureStr;
    }).sort((a, b) => a.nextOccurrence.localeCompare(b.nextOccurrence));
  }
}

module.exports = new RecurringExpenseRepository();
