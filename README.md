# Expense Tracker Backend

A multi-user expense tracker backend built with Express.js, JWT authentication, and local file storage (designed for easy MongoDB migration).

## Features

- JWT-based authentication with access and refresh tokens
- Multi-user support with user isolation
- Expense CRUD operations with categories and tags
- Recurring expenses with automatic generation
- File attachments for receipts
- Statistics and reporting

## Tech Stack

- **Node.js** & **Express.js** - Server framework
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Express-validator** - Input validation
- **Multer** - File uploads
- **Node-cron** - Recurring expense scheduler

## Project Structure

```
Expense-Tracker/
├── src/
│   ├── config/              # Configuration files
│   ├── models/              # Data models (User, Expense, Category, Tag, etc.)
│   ├── repositories/        # Data access layer (MongoDB-like API on JSON files)
│   ├── services/            # Business logic
│   ├── controllers/         # Request handlers
│   ├── routes/              # API routes
│   ├── middleware/          # Auth, validation, error handling
│   ├── validators/          # Input validation rules
│   ├── utils/               # Helper functions
│   └── app.js               # Express app setup
├── data/                    # JSON storage files
├── uploads/receipts/        # Receipt file storage
└── server.js                # Entry point
```

## Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
```bash
cp .env.example .env
# Edit .env and set your JWT_SECRET and other configurations
```

3. Start the server:
```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/me` - Get current user (protected)
- `POST /api/auth/logout` - Logout user (protected)

### Expenses (Coming soon)
- `POST /api/expenses` - Create expense
- `GET /api/expenses` - List expenses with filters
- `GET /api/expenses/:id` - Get expense by ID
- `PUT /api/expenses/:id` - Update expense
- `DELETE /api/expenses/:id` - Delete expense
- `GET /api/expenses/stats/summary` - Get statistics

### Categories (Coming soon)
- Full CRUD operations for expense categories

### Tags (Coming soon)
- Full CRUD operations for expense tags

### Recurring Expenses (Coming soon)
- Manage and auto-generate recurring expenses

## Development

The project uses a Repository pattern that provides MongoDB-like query operations on JSON files. This makes it easy to migrate to MongoDB in the future by simply:

1. Installing mongoose
2. Creating Mongoose schemas
3. Updating repositories to use Mongoose (same method signatures)
4. Running a data migration script

## Security Features

- Password hashing with bcrypt (12 rounds)
- JWT tokens with configurable expiration
- Input validation on all endpoints
- Helmet.js for HTTP headers security
- CORS configuration
- Rate limiting
- File upload restrictions

## License

MIT
