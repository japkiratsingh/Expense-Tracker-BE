const express = require('express');
const router = express.Router();

// Import route modules
const authRoutes = require('./auth.routes');
// const userRoutes = require('./user.routes');
// const expenseRoutes = require('./expense.routes');
// const categoryRoutes = require('./category.routes');
// const tagRoutes = require('./tag.routes');
// const recurringRoutes = require('./recurring.routes');

// Mount routes
router.use('/auth', authRoutes);
// router.use('/users', userRoutes);
// router.use('/expenses', expenseRoutes);
// router.use('/categories', categoryRoutes);
// router.use('/tags', tagRoutes);
// router.use('/recurring', recurringRoutes);

// Health check for API
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
