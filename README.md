# Expense Tracker Backend API

A comprehensive multi-user expense tracking system with JWT authentication, category management, tagging, recurring expenses, and file attachments.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Authentication](#authentication)
- [Data Models](#data-models)
- [Error Handling](#error-handling)
- [Development](#development)

## Overview

The Expense Tracker Backend is a RESTful API built with Node.js and Express.js that provides comprehensive expense management capabilities. The system uses file-based JSON storage for simplicity and includes features like automated recurring expenses, file attachments with thumbnail generation, and detailed expense analytics.

## Features

### ✅ Implemented Features

1. **User Authentication**
   - JWT-based authentication
   - User registration and login
   - Token refresh mechanism
   - Secure password hashing with bcrypt

2. **Category Management**
   - Default system categories
   - Custom user categories
   - Category-based expense filtering
   - Budget tracking per category
   - Color-coded categories

3. **Tag Management**
   - Create, update, delete tags
   - Tag-based expense filtering
   - Tag merging functionality
   - Color-coded tags
   - Maximum 100 tags per user

4. **Expense Management**
   - Full CRUD operations
   - Advanced filtering (date range, amount, category, tags, payment method)
   - Sorting and pagination
   - Search functionality
   - Statistics and analytics
   - CSV and JSON export
   - Bulk import with error handling

5. **Recurring Expenses**
   - Automated expense generation (daily at midnight)
   - Multiple frequencies (daily, weekly, monthly, yearly)
   - Flexible scheduling (interval, day of month, day of week)
   - Pause and resume functionality
   - Manual generation
   - History tracking
   - End date support

6. **File Attachments**
   - Multiple file upload per expense
   - Image and document support
   - Automatic thumbnail generation for images
   - File type validation
   - Size restrictions
   - Secure file serving
   - Storage statistics

## Tech Stack

- **Runtime:** Node.js v20+
- **Framework:** Express.js v5
- **Authentication:** JWT (jsonwebtoken)
- **Password Hashing:** bcrypt
- **File Upload:** multer
- **Image Processing:** sharp
- **Validation:** express-validator
- **Scheduling:** node-cron
- **Security:** helmet, cors
- **Logging:** morgan

## Getting Started

### Prerequisites

- Node.js 20.x or higher
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Expense-Tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Start the production server**
   ```bash
   npm start
   ```

The server will start on `http://localhost:3000` by default.

### Testing the API

You can test the API using:
- **curl** - Command-line HTTP client
- **Postman** - API development platform
- **Insomnia** - REST API client

Example test:
```bash
curl http://localhost:3000/health
```

## Project Structure

```
Expense-Tracker/
├── data/                          # JSON data files
│   ├── users.json
│   ├── categories.json
│   ├── tags.json
│   ├── expenses.json
│   ├── recurring-expenses.json
│   └── attachments.json
├── uploads/                       # Uploaded files
│   ├── receipts/                 # Receipt images and documents
│   └── thumbnails/               # Generated thumbnails
├── src/
│   ├── config/                   # Configuration files
│   │   └── index.js
│   ├── constants/                # Application constants
│   │   ├── index.js
│   │   ├── httpStatus.js
│   │   ├── errorMessages.js
│   │   ├── responseMessages.js
│   │   ├── validationMessages.js
│   │   ├── authConstants.js
│   │   ├── categoryConstants.js
│   │   ├── tagConstants.js
│   │   ├── expenseConstants.js
│   │   ├── recurringConstants.js
│   │   └── attachmentConstants.js
│   ├── controllers/              # Request handlers
│   │   ├── authController.js
│   │   ├── categoryController.js
│   │   ├── tagController.js
│   │   ├── expenseController.js
│   │   ├── recurringExpenseController.js
│   │   └── attachmentController.js
│   ├── middleware/               # Express middleware
│   │   ├── auth.js              # JWT authentication
│   │   ├── validation.js        # Input validation
│   │   ├── errorHandler.js      # Global error handler
│   │   └── upload.js            # File upload handling
│   ├── models/                   # Data models
│   │   ├── User.js
│   │   ├── Category.js
│   │   ├── Tag.js
│   │   ├── Expense.js
│   │   ├── RecurringExpense.js
│   │   └── Attachment.js
│   ├── repositories/             # Data access layer
│   │   ├── BaseRepository.js
│   │   ├── UserRepository.js
│   │   ├── CategoryRepository.js
│   │   ├── TagRepository.js
│   │   ├── ExpenseRepository.js
│   │   ├── RecurringExpenseRepository.js
│   │   └── AttachmentRepository.js
│   ├── routes/                   # API routes
│   │   ├── index.js
│   │   ├── auth.routes.js
│   │   ├── category.routes.js
│   │   ├── tag.routes.js
│   │   ├── expense.routes.js
│   │   ├── recurring.routes.js
│   │   └── attachment.routes.js
│   ├── services/                 # Business logic
│   │   ├── categoryService.js
│   │   ├── tagService.js
│   │   ├── expenseService.js
│   │   ├── recurringExpenseService.js
│   │   ├── attachmentService.js
│   │   └── schedulerService.js
│   ├── utils/                    # Utility functions
│   │   └── AppError.js
│   ├── validators/               # Input validators
│   │   ├── authValidator.js
│   │   ├── categoryValidator.js
│   │   ├── tagValidator.js
│   │   ├── expenseValidator.js
│   │   ├── recurringExpenseValidator.js
│   │   └── attachmentValidator.js
│   └── app.js                    # Express app configuration
├── server.js                     # Server entry point
├── package.json
├── .env.example
└── README.md
```

## Environment Variables

Create a `.env` file in the root directory:

```env
# Server Configuration
NODE_ENV=development
PORT=3000

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=1h
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this
JWT_REFRESH_EXPIRES_IN=7d

# CORS Configuration
CORS_ORIGIN=*

# File Upload Configuration
MAX_FILE_SIZE=10485760  # 10MB in bytes

# Body Parser Limits
BODY_PARSER_JSON_LIMIT=10mb
BODY_PARSER_URLENCODED_LIMIT=10mb
```

### Environment Variables Description

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Application environment | `development` |
| `PORT` | Server port | `3000` |
| `JWT_SECRET` | Secret key for JWT access tokens | Required |
| `JWT_EXPIRES_IN` | Access token expiration | `1h` |
| `JWT_REFRESH_SECRET` | Secret key for refresh tokens | Required |
| `JWT_REFRESH_EXPIRES_IN` | Refresh token expiration | `7d` |
| `CORS_ORIGIN` | Allowed CORS origins | `*` |
| `MAX_FILE_SIZE` | Maximum file upload size | `10485760` |

## API Endpoints

### Base URL

```
http://localhost:3000/api
```

### Endpoint Summary

| Module | Endpoints | Description |
|--------|-----------|-------------|
| **Auth** | 5 | User registration, login, token management |
| **Categories** | 11 | Category CRUD, statistics, expense listing |
| **Tags** | 7 | Tag CRUD, merging, expense filtering |
| **Expenses** | 14 | Full expense management, stats, import/export |
| **Recurring** | 10 | Recurring expense automation |
| **Attachments** | 7 | File upload, download, thumbnail generation |

**Total: 54 API endpoints**

For detailed API documentation, see [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

## Authentication

The API uses JWT (JSON Web Tokens) for authentication.

### Authentication Flow

1. **Register** or **Login** to get access and refresh tokens
2. **Include access token** in Authorization header for protected routes
3. **Refresh token** when access token expires

### Using Authentication

Include the JWT token in the Authorization header:

```http
Authorization: Bearer <your-access-token>
```

### Token Expiration

- **Access Token:** 1 hour (default)
- **Refresh Token:** 7 days (default)

For detailed authentication guide, see [AUTHENTICATION.md](./AUTHENTICATION.md)

## Data Models

### User
- Email, password, name
- Profile picture URL
- Default currency
- Preferences (theme, date format, notifications)

### Category
- Name, description, color, icon
- Budget and type (income/expense)
- Default or user-created

### Tag
- Name and hex color
- Maximum 100 tags per user

### Expense
- Amount, description, date
- Category and tags references
- Payment method and notes
- Attachments array

### Recurring Expense
- All expense fields
- Frequency (daily/weekly/monthly/yearly)
- Start date, end date, next occurrence
- Scheduling options (interval, day of month/week)

### Attachment
- File metadata (name, size, type)
- File path and thumbnail path
- Category (receipt, invoice, document, image)

## Error Handling

The API uses consistent error responses:

```json
{
  "success": false,
  "error": {
    "message": "Error description",
    "statusCode": 400,
    "errors": [
      {
        "field": "email",
        "message": "Email is required"
      }
    ]
  }
}
```

### HTTP Status Codes

- `200` - OK
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `500` - Internal Server Error

For detailed error handling, see [ERROR_HANDLING.md](./ERROR_HANDLING.md)

## Development

### Available Scripts

```bash
# Start development server with auto-reload
npm run dev

# Start production server
npm start

# Run tests (when implemented)
npm test
```

### Adding New Features

1. Create model in `src/models/`
2. Create repository in `src/repositories/`
3. Create service in `src/services/`
4. Create validator in `src/validators/`
5. Create controller in `src/controllers/`
6. Create routes in `src/routes/`
7. Mount routes in `src/routes/index.js`

### Code Style

- Use ES6+ features
- Follow consistent naming conventions
- Add JSDoc comments for functions
- Use async/await for asynchronous operations
- Handle errors properly with try-catch

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Create a pull request

## License

MIT

## Support

For questions or issues, please create an issue in the repository.
