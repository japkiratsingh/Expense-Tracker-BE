const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const config = require('./config');
const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler');
const AppError = require('./utils/AppError');
const { COMMON_CONSTANTS, RESPONSE_MESSAGES, ERROR_MESSAGES } = require('./constants');
const { getConnectionStatus } = require('./config/database');

const app = express();

// Security middleware
app.use(helmet());

// CORS
app.use(cors({
  origin: config.CORS_ORIGIN,
  credentials: true
}));

// Logging
if (config.NODE_ENV === COMMON_CONSTANTS.ENVIRONMENTS.DEVELOPMENT) {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Body parsing
app.use(express.json({ limit: config.BODY_PARSER_JSON_LIMIT }));
app.use(express.urlencoded({ extended: true, limit: config.BODY_PARSER_URLENCODED_LIMIT }));

// Static files (for serving uploaded files)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Health check
app.get('/health', (req, res) => {
  const dbConnected = getConnectionStatus();
  res.json({
    status: dbConnected ? 'ok' : 'degraded',
    message: RESPONSE_MESSAGES.GENERAL.API_RUNNING,
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: {
      connected: dbConnected,
      status: dbConnected ? 'connected' : 'disconnected'
    }
  });
});

// API routes
app.use('/api', routes);

// 404 handler
app.use((req, res, next) => {
  const message = ERROR_MESSAGES.GENERAL.ROUTE_NOT_FOUND.replace('{{route}}', req.originalUrl);
  next(new AppError(message, 404));
});

// Global error handler
app.use(errorHandler);

module.exports = app;
