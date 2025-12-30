# API Testing Guide

## Starting the Server

### Development Mode (with auto-reload)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on `http://localhost:3000`

## Testing Endpoints

### 1. Health Check
```bash
curl http://localhost:3000/health
```

Expected Response:
```json
{
  "status": "ok",
  "timestamp": "2025-12-30T08:00:00.000Z",
  "uptime": 123.456
}
```

### 2. Register a New User
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

Expected Response:
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "_id": "uuid-here",
      "email": "john.doe@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "defaultCurrency": "USD",
      "preferences": {...},
      "createdAt": "2025-12-30T08:00:00.000Z",
      "updatedAt": "2025-12-30T08:00:00.000Z",
      "isActive": true,
      "lastLogin": null
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 3. Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "password": "password123"
  }'
```

### 4. Get Current User (Protected Route)
```bash
# Save the access token from login/register
TOKEN="your-access-token-here"

curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer $TOKEN"
```

### 5. Refresh Access Token
```bash
curl -X POST http://localhost:3000/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "your-refresh-token-here"
  }'
```

### 6. Logout
```bash
curl -X POST http://localhost:3000/api/auth/logout \
  -H "Authorization: Bearer $TOKEN"
```

## Using Postman or Insomnia

1. Import the following base URL: `http://localhost:3000/api`
2. Create requests for each endpoint above
3. For protected routes, add header:
   - Key: `Authorization`
   - Value: `Bearer your-access-token-here`

## Data Storage

All data is stored in JSON files in the `data/` directory:
- `data/users.json` - User accounts
- `data/expenses.json` - Expenses (coming soon)
- `data/categories.json` - Categories (coming soon)
- `data/tags.json` - Tags (coming soon)
- `data/recurring-expenses.json` - Recurring expenses (coming soon)
- `data/attachments.json` - File metadata (coming soon)

## Common Errors

### 400 - Validation Failed
The request body didn't pass validation. Check the error details for which fields failed.

### 401 - Unauthorized
- Token is missing, expired, or invalid
- Get a new token by logging in again

### 404 - Not Found
The endpoint doesn't exist. Check the URL path.

### 500 - Internal Server Error
Something went wrong on the server. Check server logs.

## Next Steps

The following features are ready to be implemented:
1. Expense CRUD operations
2. Categories management
3. Tags management
4. Recurring expenses
5. File attachments for receipts
6. Statistics and reporting

All models, repositories, and infrastructure are in place for easy expansion!
