const app = require('./src/app');
const config = require('./src/config');
const { connectDB, disconnectDB } = require('./src/config/database');
const schedulerService = require('./src/services/schedulerService');
const fs = require('fs').promises;
const path = require('path');

// Ensure required directories exist (for file uploads)
async function ensureDirectories() {
  const dirs = [
    path.join(__dirname, 'uploads'),
    path.join(__dirname, 'uploads/receipts')
  ];

  for (const dir of dirs) {
    try {
      await fs.access(dir);
    } catch {
      await fs.mkdir(dir, { recursive: true });
      console.log(`Created directory: ${dir}`);
    }
  }
}

async function startServer() {
  try {
    // Connect to MongoDB
    await connectDB();

    // Setup directories for file uploads
    await ensureDirectories();

    // Start recurring expense scheduler
    schedulerService.start();
    console.log('Recurring expense scheduler initialized');

    // Start server
    const server = app.listen(config.PORT, () => {
      console.log(`
╔═══════════════════════════════════════════╗
║   Expense Tracker API Server Started     ║
╚═══════════════════════════════════════════╝

Environment: ${config.NODE_ENV}
Port: ${config.PORT}
Time: ${new Date().toISOString()}

API Base: http://localhost:${config.PORT}/api
Health Check: http://localhost:${config.PORT}/health
Database: MongoDB (Connected)
Scheduler: ${schedulerService.getStatus().isRunning ? 'Running' : 'Stopped'}
      `);
    });

    // Graceful shutdown
    const gracefulShutdown = async (signal) => {
      console.log(`${signal} received, shutting down gracefully...`);
      schedulerService.stop();

      server.close(async () => {
        console.log('Server closed');
        await disconnectDB();
        console.log('Database connection closed');
        process.exit(0);
      });

      // Force shutdown after 10 seconds
      setTimeout(() => {
        console.error('Forcing shutdown after timeout');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
