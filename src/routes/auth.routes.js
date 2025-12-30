const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { validate } = require('../middleware/validation');
const { authenticate } = require('../middleware/auth');
const {
  registerValidator,
  loginValidator,
  refreshTokenValidator
} = require('../validators/authValidator');

// Debug endpoint to test body parsing
router.post('/test', (req, res) => {
  res.json({
    success: true,
    body: req.body,
    headers: req.headers
  });
});

// Public routes
router.post('/register', registerValidator, validate, authController.register);
router.post('/login', loginValidator, validate, authController.login);
router.post('/refresh', refreshTokenValidator, validate, authController.refreshToken);

// Protected routes
router.get('/me', authenticate, authController.getCurrentUser);
router.post('/logout', authenticate, authController.logout);

module.exports = router;
