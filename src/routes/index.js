const express = require('express');
const router = express.Router();
const { COMMON_CONSTANTS, RESPONSE_MESSAGES } = require('../constants');

// Import route modules
const authRoutes = require('./auth.routes');
const categoryRoutes = require('./category.routes');
const tagRoutes = require('./tag.routes');
const expenseRoutes = require('./expense.routes');
// const userRoutes = require('./user.routes');
// const recurringRoutes = require('./recurring.routes');

// Mount routes
router.use('/auth', authRoutes);
router.use('/categories', categoryRoutes);
router.use('/tags', tagRoutes);
router.use('/expenses', expenseRoutes);
// router.use('/users', userRoutes);
// router.use('/recurring', recurringRoutes);

// Health check for API
router.get('/health', (req, res) => {
  res.json({
    success: COMMON_CONSTANTS.RESPONSE_STATUS.SUCCESS,
    message: RESPONSE_MESSAGES.GENERAL.API_RUNNING,
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
