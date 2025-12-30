const app = require('./src/app');
const config = require('./src/config');
const schedulerService = require('./src/services/schedulerService');
const fs = require('fs').promises;
const path = require('path');

// Ensure required directories exist
async function ensureDirectories() {
  const dirs = [
    path.join(__dirname, 'data'),
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

// Ensure data files exist
async function ensureDataFiles() {
  const dataDir = path.join(__dirname, 'data');
  const files = [
    'users.json',
    'expenses.json',
    'categories.json',
    'tags.json',
    'recurring-expenses.json',
    'attachments.json'
  ];

  for (const file of files) {
    const filePath = path.join(dataDir, file);
    try {
      await fs.access(filePath);
    } catch {
      await fs.writeFile(filePath, '[]', 'utf8');
      console.log(`Created data file: ${file}`);
    }
  }
}

async function startServer() {
  try {
    // Setup
    await ensureDirectories();
    await ensureDataFiles();

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
Scheduler: ${schedulerService.getStatus().isRunning ? 'Running' : 'Stopped'}
      `);
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
      console.log('SIGTERM received, shutting down gracefully...');
      schedulerService.stop();
      server.close(() => {
        console.log('Server closed');
        process.exit(0);
      });
    });

    process.on('SIGINT', () => {
      console.log('SIGINT received, shutting down gracefully...');
      schedulerService.stop();
      server.close(() => {
        console.log('Server closed');
        process.exit(0);
      });
    });

  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
