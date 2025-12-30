const cron = require('node-cron');
const recurringExpenseService = require('./recurringExpenseService');

class SchedulerService {
  constructor() {
    this.job = null;
    this.isRunning = false;
  }

  /**
   * Start the scheduler - runs every day at midnight
   */
  start() {
    if (this.isRunning) {
      console.log('Scheduler is already running');
      return;
    }

    // Run every day at midnight (00:00)
    // Cron format: second minute hour day month dayOfWeek
    this.job = cron.schedule('0 0 * * *', async () => {
      console.log('Running recurring expense generation:', new Date().toISOString());
      try {
        const results = await recurringExpenseService.processAllDueRecurring();
        console.log('Recurring expense generation complete:', results);
      } catch (error) {
        console.error('Error in recurring expense generation:', error);
      }
    });

    this.isRunning = true;
    console.log('Recurring expense scheduler started - will run daily at midnight');
  }

  /**
   * Stop the scheduler
   */
  stop() {
    if (this.job) {
      this.job.stop();
      this.isRunning = false;
      console.log('Recurring expense scheduler stopped');
    }
  }

  /**
   * Manually trigger the recurring expense generation
   * Useful for testing
   */
  async triggerManually() {
    console.log('Manually triggering recurring expense generation');
    try {
      const results = await recurringExpenseService.processAllDueRecurring();
      console.log('Manual generation complete:', results);
      return results;
    } catch (error) {
      console.error('Error in manual generation:', error);
      throw error;
    }
  }

  /**
   * Get scheduler status
   */
  getStatus() {
    return {
      isRunning: this.isRunning,
      schedule: 'Daily at midnight (00:00)'
    };
  }
}

module.exports = new SchedulerService();
