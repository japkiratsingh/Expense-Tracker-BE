# API Documentation

Complete API reference for the Expense Tracker Backend. This documentation is designed for frontend developers to integrate with the backend API.

## Table of Contents

- [Base URL](#base-url)
- [Authentication](#authentication)
- [Response Format](#response-format)
- [Error Handling](#error-handling)
- [API Endpoints](#api-endpoints)
  - [Authentication](#authentication-endpoints)
  - [Categories](#category-endpoints)
  - [Tags](#tag-endpoints)
  - [Expenses](#expense-endpoints)
  - [Recurring Expenses](#recurring-expense-endpoints)
  - [Attachments](#attachment-endpoints)

---

## Base URL

```
http://localhost:3000/api
```

All API endpoints are prefixed with `/api`.

---

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Protected endpoints require an `Authorization` header with a valid access token.

### Header Format

```http
Authorization: Bearer <your-access-token>
```

### Token Types

- **Access Token**: Short-lived (1 hour default), used for API requests
- **Refresh Token**: Long-lived (7 days default), used to obtain new access tokens

### Authentication Flow

1. Register or login to obtain tokens
2. Include access token in Authorization header for protected routes
3. Use refresh token to get a new access token when it expires

---

## Response Format

### Success Response

```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {
    // Response data
  }
}
```

### Error Response

```json
{
  "success": false,
  "error": {
    "message": "Error description",
    "statusCode": 400,
    "errors": [
      {
        "field": "fieldName",
        "message": "Validation error message"
      }
    ]
  }
}
```

---

## Error Handling

### HTTP Status Codes

| Code | Meaning | Description |
|------|---------|-------------|
| 200 | OK | Request successful |
| 201 | Created | Resource created successfully |
| 400 | Bad Request | Invalid request parameters |
| 401 | Unauthorized | Missing or invalid authentication |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource not found |
| 409 | Conflict | Resource conflict (e.g., duplicate) |
| 500 | Internal Server Error | Server error |

---

## API Endpoints

## Authentication Endpoints

### 1. Register User

Create a new user account.

**Endpoint:** `POST /api/auth/register`

**Authentication:** Not required

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "SecurePass123",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Validation Rules:**

- `email`: Required, valid email format
- `password`: Required, minimum 8 characters
- `firstName`: Required, non-empty, max 50 characters
- `lastName`: Required, non-empty, max 50 characters

**Success Response (201):**

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "_id": "71b57f26-a550-4de6-b5aa-ddb61f9151ba",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "createdAt": "2025-12-30T10:00:00.000Z"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Response (400):**

```json
{
  "success": false,
  "error": {
    "message": "Validation failed",
    "statusCode": 400,
    "errors": [
      {
        "field": "email",
        "message": "Please provide a valid email"
      }
    ]
  }
}
```

**Error Response (409):**

```json
{
  "success": false,
  "error": {
    "message": "Email already registered",
    "statusCode": 409
  }
}
```

**Example Request (cURL):**

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

**Example Request (JavaScript):**

```javascript
const response = await fetch('http://localhost:3000/api/auth/register', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'SecurePass123',
    firstName: 'John',
    lastName: 'Doe'
  })
});

const data = await response.json();
```

---

### 2. Login

Authenticate a user and obtain access/refresh tokens.

**Endpoint:** `POST /api/auth/login`

**Authentication:** Not required

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "SecurePass123"
}
```

**Validation Rules:**

- `email`: Required, valid email format
- `password`: Required

**Success Response (200):**

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "_id": "71b57f26-a550-4de6-b5aa-ddb61f9151ba",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Response (401):**

```json
{
  "success": false,
  "error": {
    "message": "Invalid credentials",
    "statusCode": 401
  }
}
```

**Example Request (cURL):**

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123"
  }'
```

**Example Request (JavaScript):**

```javascript
const response = await fetch('http://localhost:3000/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'SecurePass123'
  })
});

const data = await response.json();
// Store tokens
localStorage.setItem('accessToken', data.data.accessToken);
localStorage.setItem('refreshToken', data.data.refreshToken);
```

---

### 3. Refresh Token

Obtain a new access token using a refresh token.

**Endpoint:** `POST /api/auth/refresh`

**Authentication:** Not required

**Request Body:**

```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Validation Rules:**

- `refreshToken`: Required

**Success Response (200):**

```json
{
  "success": true,
  "message": "Token refreshed successfully",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Response (401):**

```json
{
  "success": false,
  "error": {
    "message": "Invalid or expired refresh token",
    "statusCode": 401
  }
}
```

**Example Request (JavaScript):**

```javascript
const refreshToken = localStorage.getItem('refreshToken');

const response = await fetch('http://localhost:3000/api/auth/refresh', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ refreshToken })
});

const data = await response.json();
localStorage.setItem('accessToken', data.data.accessToken);
localStorage.setItem('refreshToken', data.data.refreshToken);
```

---

### 4. Get Current User

Get the authenticated user's profile information.

**Endpoint:** `GET /api/auth/me`

**Authentication:** Required

**Success Response (200):**

```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "71b57f26-a550-4de6-b5aa-ddb61f9151ba",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "createdAt": "2025-12-30T10:00:00.000Z",
      "updatedAt": "2025-12-30T10:00:00.000Z"
    }
  }
}
```

**Error Response (401):**

```json
{
  "success": false,
  "error": {
    "message": "Invalid token",
    "statusCode": 401
  }
}
```

**Example Request (JavaScript):**

```javascript
const accessToken = localStorage.getItem('accessToken');

const response = await fetch('http://localhost:3000/api/auth/me', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${accessToken}`
  }
});

const data = await response.json();
```

---

### 5. Logout

Invalidate the current refresh token.

**Endpoint:** `POST /api/auth/logout`

**Authentication:** Required

**Request Body:** None required (uses Authorization header)

**Success Response (200):**

```json
{
  "success": true,
  "message": "Logout successful"
}
```

**Example Request (JavaScript):**

```javascript
const accessToken = localStorage.getItem('accessToken');

await fetch('http://localhost:3000/api/auth/logout', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${accessToken}`
  }
});

// Clear tokens
localStorage.removeItem('accessToken');
localStorage.removeItem('refreshToken');
```

---

## Category Endpoints

### 1. Get All Categories

Retrieve all categories (system defaults + user's custom categories).

**Endpoint:** `GET /api/categories`

**Authentication:** Required

**Query Parameters:**

- `type` (optional): Filter by type - `system`, `user`, or `all` (default: all)
- `includeInactive` (optional): Include inactive categories - `true` or `false` (default: false)

**Success Response (200):**

```json
{
  "success": true,
  "data": {
    "categories": [
      {
        "_id": "cat-001",
        "name": "Food & Dining",
        "description": "Restaurants, groceries, and food delivery",
        "color": "#FF6B6B",
        "icon": "restaurant",
        "type": "system",
        "isActive": true,
        "budget": null,
        "createdAt": "2025-12-30T10:00:00.000Z"
      },
      {
        "_id": "user-cat-001",
        "userId": "71b57f26-a550-4de6-b5aa-ddb61f9151ba",
        "name": "Freelance Work",
        "description": "Income from freelance projects",
        "color": "#4A90E2",
        "icon": "work",
        "type": "user",
        "isActive": true,
        "budget": 5000,
        "createdAt": "2025-12-30T11:00:00.000Z"
      }
    ],
    "count": 2
  }
}
```

**Example Request (JavaScript):**

```javascript
const accessToken = localStorage.getItem('accessToken');

const response = await fetch('http://localhost:3000/api/categories?type=all', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${accessToken}`
  }
});

const data = await response.json();
```

---

### 2. Get Category by ID

Retrieve a specific category by its ID.

**Endpoint:** `GET /api/categories/:id`

**Authentication:** Required

**Path Parameters:**

- `id`: Category UUID

**Success Response (200):**

```json
{
  "success": true,
  "data": {
    "category": {
      "_id": "user-cat-001",
      "userId": "71b57f26-a550-4de6-b5aa-ddb61f9151ba",
      "name": "Freelance Work",
      "description": "Income from freelance projects",
      "color": "#4A90E2",
      "icon": "work",
      "type": "user",
      "isActive": true,
      "budget": 5000,
      "createdAt": "2025-12-30T11:00:00.000Z",
      "updatedAt": "2025-12-30T11:00:00.000Z"
    }
  }
}
```

**Error Response (404):**

```json
{
  "success": false,
  "error": {
    "message": "Category not found",
    "statusCode": 404
  }
}
```

**Example Request (JavaScript):**

```javascript
const accessToken = localStorage.getItem('accessToken');
const categoryId = 'user-cat-001';

const response = await fetch(`http://localhost:3000/api/categories/${categoryId}`, {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${accessToken}`
  }
});

const data = await response.json();
```

---

### 3. Create Category

Create a new custom category.

**Endpoint:** `POST /api/categories`

**Authentication:** Required

**Request Body:**

```json
{
  "name": "Freelance Work",
  "description": "Income from freelance projects",
  "color": "#4A90E2",
  "icon": "work",
  "budget": 5000
}
```

**Validation Rules:**

- `name`: Required, 2-50 characters
- `description`: Optional, max 200 characters
- `color`: Optional, valid hex color (e.g., #FF5733), default: #808080
- `icon`: Optional, max 50 characters, default: 'category'
- `budget`: Optional, 0 to 999999999.99

**Success Response (201):**

```json
{
  "success": true,
  "message": "Category created successfully",
  "data": {
    "category": {
      "_id": "user-cat-001",
      "userId": "71b57f26-a550-4de6-b5aa-ddb61f9151ba",
      "name": "Freelance Work",
      "description": "Income from freelance projects",
      "color": "#4A90E2",
      "icon": "work",
      "type": "user",
      "isActive": true,
      "budget": 5000,
      "createdAt": "2025-12-30T11:00:00.000Z",
      "updatedAt": "2025-12-30T11:00:00.000Z"
    }
  }
}
```

**Error Response (400):**

```json
{
  "success": false,
  "error": {
    "message": "Validation failed",
    "statusCode": 400,
    "errors": [
      {
        "field": "name",
        "message": "Category name is required"
      }
    ]
  }
}
```

**Example Request (JavaScript):**

```javascript
const accessToken = localStorage.getItem('accessToken');

const response = await fetch('http://localhost:3000/api/categories', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'Freelance Work',
    description: 'Income from freelance projects',
    color: '#4A90E2',
    icon: 'work',
    budget: 5000
  })
});

const data = await response.json();
```

---

### 4. Update Category

Update an existing user category.

**Endpoint:** `PUT /api/categories/:id`

**Authentication:** Required

**Path Parameters:**

- `id`: Category UUID

**Request Body:** (all fields optional)

```json
{
  "name": "Freelance Income",
  "description": "Updated description",
  "color": "#5B9BD5",
  "icon": "laptop",
  "budget": 6000,
  "isActive": true
}
```

**Validation Rules:**

- Same as create, but all fields are optional
- Cannot update system categories

**Success Response (200):**

```json
{
  "success": true,
  "message": "Category updated successfully",
  "data": {
    "category": {
      "_id": "user-cat-001",
      "userId": "71b57f26-a550-4de6-b5aa-ddb61f9151ba",
      "name": "Freelance Income",
      "description": "Updated description",
      "color": "#5B9BD5",
      "icon": "laptop",
      "type": "user",
      "isActive": true,
      "budget": 6000,
      "createdAt": "2025-12-30T11:00:00.000Z",
      "updatedAt": "2025-12-30T12:00:00.000Z"
    }
  }
}
```

**Error Response (403):**

```json
{
  "success": false,
  "error": {
    "message": "Unauthorized to access this category",
    "statusCode": 403
  }
}
```

**Example Request (JavaScript):**

```javascript
const accessToken = localStorage.getItem('accessToken');
const categoryId = 'user-cat-001';

const response = await fetch(`http://localhost:3000/api/categories/${categoryId}`, {
  method: 'PUT',
  headers: {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'Freelance Income',
    budget: 6000
  })
});

const data = await response.json();
```

---

### 5. Delete Category

Delete a user category.

**Endpoint:** `DELETE /api/categories/:id`

**Authentication:** Required

**Path Parameters:**

- `id`: Category UUID

**Success Response (200):**

```json
{
  "success": true,
  "message": "Category deleted successfully"
}
```

**Error Response (403):**

```json
{
  "success": false,
  "error": {
    "message": "Unauthorized to access this category",
    "statusCode": 403
  }
}
```

**Error Response (404):**

```json
{
  "success": false,
  "error": {
    "message": "Category not found",
    "statusCode": 404
  }
}
```

**Example Request (JavaScript):**

```javascript
const accessToken = localStorage.getItem('accessToken');
const categoryId = 'user-cat-001';

const response = await fetch(`http://localhost:3000/api/categories/${categoryId}`, {
  method: 'DELETE',
  headers: {
    'Authorization': `Bearer ${accessToken}`
  }
});

const data = await response.json();
```

---

### 6. Get Category Expenses

Get all expenses in a specific category.

**Endpoint:** `GET /api/categories/:id/expenses`

**Authentication:** Required

**Path Parameters:**

- `id`: Category UUID

**Query Parameters:**

- `startDate` (optional): Filter start date (YYYY-MM-DD)
- `endDate` (optional): Filter end date (YYYY-MM-DD)
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 50, max: 100)

**Success Response (200):**

```json
{
  "success": true,
  "data": {
    "expenses": [
      {
        "_id": "exp-001",
        "userId": "71b57f26-a550-4de6-b5aa-ddb61f9151ba",
        "amount": 1500.00,
        "description": "Website development",
        "date": "2025-12-30",
        "categoryId": "user-cat-001",
        "tags": ["tag-001"],
        "paymentMethod": "online",
        "createdAt": "2025-12-30T10:00:00.000Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 1,
      "totalItems": 1,
      "itemsPerPage": 50,
      "hasNextPage": false,
      "hasPrevPage": false
    }
  }
}
```

**Example Request (JavaScript):**

```javascript
const accessToken = localStorage.getItem('accessToken');
const categoryId = 'user-cat-001';

const response = await fetch(`http://localhost:3000/api/categories/${categoryId}/expenses?page=1&limit=50`, {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${accessToken}`
  }
});

const data = await response.json();
```

---

### 7. Get Category Statistics

Get statistics for a specific category.

**Endpoint:** `GET /api/categories/:id/stats`

**Authentication:** Required

**Path Parameters:**

- `id`: Category UUID

**Success Response (200):**

```json
{
  "success": true,
  "data": {
    "statistics": {
      "categoryId": "user-cat-001",
      "categoryName": "Freelance Work",
      "totalExpenses": 5,
      "totalAmount": 7500.00,
      "averageAmount": 1500.00,
      "budget": 5000,
      "budgetUsed": 7500.00,
      "budgetRemaining": -2500.00,
      "budgetPercentage": 150,
      "isOverBudget": true,
      "period": "all-time"
    }
  }
}
```

**Example Request (JavaScript):**

```javascript
const accessToken = localStorage.getItem('accessToken');
const categoryId = 'user-cat-001';

const response = await fetch(`http://localhost:3000/api/categories/${categoryId}/stats`, {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${accessToken}`
  }
});

const data = await response.json();
```

---

### 8. Get Category Overview

Get an overview of all categories with expense counts and totals.

**Endpoint:** `GET /api/categories/overview`

**Authentication:** Required

**Success Response (200):**

```json
{
  "success": true,
  "data": {
    "overview": [
      {
        "categoryId": "cat-001",
        "categoryName": "Food & Dining",
        "type": "system",
        "expenseCount": 15,
        "totalAmount": 450.75,
        "budget": null
      },
      {
        "categoryId": "user-cat-001",
        "categoryName": "Freelance Work",
        "type": "user",
        "expenseCount": 5,
        "totalAmount": 7500.00,
        "budget": 5000,
        "budgetPercentage": 150,
        "isOverBudget": true
      }
    ],
    "totalCategories": 2,
    "totalExpenses": 20,
    "grandTotal": 7950.75
  }
}
```

**Example Request (JavaScript):**

```javascript
const accessToken = localStorage.getItem('accessToken');

const response = await fetch('http://localhost:3000/api/categories/overview', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${accessToken}`
  }
});

const data = await response.json();
```

---

## Tag Endpoints

### 1. Get All Tags

Retrieve all tags for the authenticated user.

**Endpoint:** `GET /api/tags`

**Authentication:** Required

**Success Response (200):**

```json
{
  "success": true,
  "message": "Tags list fetched successfully",
  "data": {
    "tags": [
      {
        "_id": "tag-001",
        "userId": "71b57f26-a550-4de6-b5aa-ddb61f9151ba",
        "name": "urgent",
        "color": "#FF0000",
        "createdAt": "2025-12-30T10:00:00.000Z",
        "updatedAt": "2025-12-30T10:00:00.000Z"
      },
      {
        "_id": "tag-002",
        "userId": "71b57f26-a550-4de6-b5aa-ddb61f9151ba",
        "name": "personal",
        "color": "#00FF00",
        "createdAt": "2025-12-30T10:00:00.000Z",
        "updatedAt": "2025-12-30T10:00:00.000Z"
      }
    ],
    "count": 2
  }
}
```

**Example Request (JavaScript):**

```javascript
const accessToken = localStorage.getItem('accessToken');

const response = await fetch('http://localhost:3000/api/tags', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${accessToken}`
  }
});

const data = await response.json();
```

---

### 2. Get Tag by ID

Retrieve a specific tag by its ID.

**Endpoint:** `GET /api/tags/:id`

**Authentication:** Required

**Path Parameters:**

- `id`: Tag UUID

**Success Response (200):**

```json
{
  "success": true,
  "message": "Tag fetched successfully",
  "data": {
    "tag": {
      "_id": "tag-001",
      "userId": "71b57f26-a550-4de6-b5aa-ddb61f9151ba",
      "name": "urgent",
      "color": "#FF0000",
      "createdAt": "2025-12-30T10:00:00.000Z",
      "updatedAt": "2025-12-30T10:00:00.000Z"
    }
  }
}
```

**Error Response (404):**

```json
{
  "success": false,
  "error": {
    "message": "Tag not found",
    "statusCode": 404
  }
}
```

**Example Request (JavaScript):**

```javascript
const accessToken = localStorage.getItem('accessToken');
const tagId = 'tag-001';

const response = await fetch(`http://localhost:3000/api/tags/${tagId}`, {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${accessToken}`
  }
});

const data = await response.json();
```

---

### 3. Create Tag

Create a new tag.

**Endpoint:** `POST /api/tags`

**Authentication:** Required

**Request Body:**

```json
{
  "name": "urgent",
  "color": "#FF0000"
}
```

**Validation Rules:**

- `name`: Required, 1-30 characters, unique per user
- `color`: Optional, valid hex color (e.g., #FF5733), default: random color
- Maximum 100 tags per user

**Success Response (201):**

```json
{
  "success": true,
  "message": "Tag created successfully",
  "data": {
    "tag": {
      "_id": "tag-001",
      "userId": "71b57f26-a550-4de6-b5aa-ddb61f9151ba",
      "name": "urgent",
      "color": "#FF0000",
      "createdAt": "2025-12-30T10:00:00.000Z",
      "updatedAt": "2025-12-30T10:00:00.000Z"
    }
  }
}
```

**Error Response (400):**

```json
{
  "success": false,
  "error": {
    "message": "Validation failed",
    "statusCode": 400,
    "errors": [
      {
        "field": "name",
        "message": "Tag name is required"
      }
    ]
  }
}
```

**Error Response (409):**

```json
{
  "success": false,
  "error": {
    "message": "A tag with this name already exists",
    "statusCode": 409
  }
}
```

**Example Request (JavaScript):**

```javascript
const accessToken = localStorage.getItem('accessToken');

const response = await fetch('http://localhost:3000/api/tags', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'urgent',
    color: '#FF0000'
  })
});

const data = await response.json();
```

---

### 4. Update Tag

Update an existing tag.

**Endpoint:** `PUT /api/tags/:id`

**Authentication:** Required

**Path Parameters:**

- `id`: Tag UUID

**Request Body:** (all fields optional)

```json
{
  "name": "high-priority",
  "color": "#FF5733"
}
```

**Validation Rules:**

- Same as create, but all fields are optional
- Name must be unique per user if changed

**Success Response (200):**

```json
{
  "success": true,
  "message": "Tag updated successfully",
  "data": {
    "tag": {
      "_id": "tag-001",
      "userId": "71b57f26-a550-4de6-b5aa-ddb61f9151ba",
      "name": "high-priority",
      "color": "#FF5733",
      "createdAt": "2025-12-30T10:00:00.000Z",
      "updatedAt": "2025-12-30T12:00:00.000Z"
    }
  }
}
```

**Example Request (JavaScript):**

```javascript
const accessToken = localStorage.getItem('accessToken');
const tagId = 'tag-001';

const response = await fetch(`http://localhost:3000/api/tags/${tagId}`, {
  method: 'PUT',
  headers: {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'high-priority',
    color: '#FF5733'
  })
});

const data = await response.json();
```

---

### 5. Delete Tag

Delete a tag.

**Endpoint:** `DELETE /api/tags/:id`

**Authentication:** Required

**Path Parameters:**

- `id`: Tag UUID

**Success Response (200):**

```json
{
  "success": true,
  "message": "Tag deleted successfully"
}
```

**Error Response (400):**

```json
{
  "success": false,
  "error": {
    "message": "Cannot delete tag that is in use by expenses",
    "statusCode": 400
  }
}
```

**Example Request (JavaScript):**

```javascript
const accessToken = localStorage.getItem('accessToken');
const tagId = 'tag-001';

const response = await fetch(`http://localhost:3000/api/tags/${tagId}`, {
  method: 'DELETE',
  headers: {
    'Authorization': `Bearer ${accessToken}`
  }
});

const data = await response.json();
```

---

### 6. Get Expenses by Tag

Get all expenses with a specific tag.

**Endpoint:** `GET /api/tags/:id/expenses`

**Authentication:** Required

**Path Parameters:**

- `id`: Tag UUID

**Success Response (200):**

```json
{
  "success": true,
  "data": {
    "expenses": [
      {
        "_id": "exp-001",
        "userId": "71b57f26-a550-4de6-b5aa-ddb61f9151ba",
        "amount": 50.00,
        "description": "Urgent medical supplies",
        "date": "2025-12-30",
        "categoryId": "cat-006",
        "tags": ["tag-001"],
        "paymentMethod": "credit",
        "createdAt": "2025-12-30T10:00:00.000Z"
      }
    ],
    "count": 1,
    "tag": {
      "_id": "tag-001",
      "name": "urgent",
      "color": "#FF0000"
    }
  }
}
```

**Example Request (JavaScript):**

```javascript
const accessToken = localStorage.getItem('accessToken');
const tagId = 'tag-001';

const response = await fetch(`http://localhost:3000/api/tags/${tagId}/expenses`, {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${accessToken}`
  }
});

const data = await response.json();
```

---

### 7. Merge Tags

Merge one tag into another (all expenses with source tag will be updated to target tag).

**Endpoint:** `PATCH /api/tags/:id/merge`

**Authentication:** Required

**Path Parameters:**

- `id`: Source tag UUID (will be deleted after merge)

**Request Body:**

```json
{
  "targetTagId": "tag-002"
}
```

**Validation Rules:**

- `targetTagId`: Required, valid tag UUID, must exist and belong to user
- Cannot merge a tag with itself

**Success Response (200):**

```json
{
  "success": true,
  "message": "Tags merged successfully",
  "data": {
    "mergedCount": 5,
    "sourceTag": {
      "_id": "tag-001",
      "name": "urgent"
    },
    "targetTag": {
      "_id": "tag-002",
      "name": "high-priority"
    }
  }
}
```

**Error Response (400):**

```json
{
  "success": false,
  "error": {
    "message": "Cannot merge a tag with itself",
    "statusCode": 400
  }
}
```

**Example Request (JavaScript):**

```javascript
const accessToken = localStorage.getItem('accessToken');
const sourceTagId = 'tag-001';
const targetTagId = 'tag-002';

const response = await fetch(`http://localhost:3000/api/tags/${sourceTagId}/merge`, {
  method: 'PATCH',
  headers: {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    targetTagId: targetTagId
  })
});

const data = await response.json();
```

---

## Expense Endpoints

### 1. Create Expense

Create a new expense.

**Endpoint:** `POST /api/expenses`

**Authentication:** Required

**Request Body:**

```json
{
  "amount": 45.99,
  "description": "Lunch at restaurant",
  "date": "2025-12-30",
  "categoryId": "cat-001",
  "tags": ["tag-001", "tag-002"],
  "paymentMethod": "credit",
  "notes": "Business lunch with client"
}
```

**Validation Rules:**

- `amount`: Required, 0.01 to 999999999.99
- `description`: Required, 1-500 characters
- `date`: Optional, YYYY-MM-DD format (default: today)
- `categoryId`: Optional, valid category UUID
- `tags`: Optional, array of valid tag UUIDs
- `paymentMethod`: Optional, one of: `cash`, `credit`, `debit`, `online`, `check`, `other`
- `notes`: Optional, max 1000 characters

**Success Response (201):**

```json
{
  "success": true,
  "message": "Expense created successfully",
  "data": {
    "expense": {
      "_id": "exp-001",
      "userId": "71b57f26-a550-4de6-b5aa-ddb61f9151ba",
      "amount": 45.99,
      "description": "Lunch at restaurant",
      "date": "2025-12-30",
      "categoryId": "cat-001",
      "tags": ["tag-001", "tag-002"],
      "paymentMethod": "credit",
      "notes": "Business lunch with client",
      "attachments": [],
      "createdAt": "2025-12-30T10:00:00.000Z",
      "updatedAt": "2025-12-30T10:00:00.000Z"
    }
  }
}
```

**Error Response (400):**

```json
{
  "success": false,
  "error": {
    "message": "Validation failed",
    "statusCode": 400,
    "errors": [
      {
        "field": "amount",
        "message": "Amount is required"
      },
      {
        "field": "description",
        "message": "Description is required"
      }
    ]
  }
}
```

**Example Request (JavaScript):**

```javascript
const accessToken = localStorage.getItem('accessToken');

const response = await fetch('http://localhost:3000/api/expenses', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    amount: 45.99,
    description: 'Lunch at restaurant',
    date: '2025-12-30',
    categoryId: 'cat-001',
    tags: ['tag-001', 'tag-002'],
    paymentMethod: 'credit',
    notes: 'Business lunch with client'
  })
});

const data = await response.json();
```

---

### 2. Get All Expenses

Retrieve all expenses with filtering, sorting, and pagination.

**Endpoint:** `GET /api/expenses`

**Authentication:** Required

**Query Parameters:**

- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 50, max: 100)
- `sortBy` (optional): Sort field - `date`, `amount`, `description`, `createdAt` (default: date)
- `sortOrder` (optional): Sort order - `asc` or `desc` (default: desc)
- `categoryId` (optional): Filter by category UUID
- `startDate` (optional): Filter start date (YYYY-MM-DD)
- `endDate` (optional): Filter end date (YYYY-MM-DD)
- `minAmount` (optional): Minimum amount
- `maxAmount` (optional): Maximum amount
- `paymentMethod` (optional): Filter by payment method

**Success Response (200):**

```json
{
  "success": true,
  "message": "Expenses list fetched successfully",
  "data": {
    "expenses": [
      {
        "_id": "exp-001",
        "userId": "71b57f26-a550-4de6-b5aa-ddb61f9151ba",
        "amount": 45.99,
        "description": "Lunch at restaurant",
        "date": "2025-12-30",
        "categoryId": "cat-001",
        "tags": ["tag-001"],
        "paymentMethod": "credit",
        "notes": "Business lunch",
        "attachments": [],
        "createdAt": "2025-12-30T10:00:00.000Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 10,
      "totalItems": 500,
      "itemsPerPage": 50,
      "hasNextPage": true,
      "hasPrevPage": false
    }
  }
}
```

**Example Request (JavaScript):**

```javascript
const accessToken = localStorage.getItem('accessToken');

// Build query parameters
const params = new URLSearchParams({
  page: '1',
  limit: '50',
  sortBy: 'date',
  sortOrder: 'desc',
  startDate: '2025-12-01',
  endDate: '2025-12-31',
  categoryId: 'cat-001'
});

const response = await fetch(`http://localhost:3000/api/expenses?${params}`, {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${accessToken}`
  }
});

const data = await response.json();
```

---

### 3. Search Expenses

Search expenses by description.

**Endpoint:** `GET /api/expenses/search`

**Authentication:** Required

**Query Parameters:**

- `q` (optional): Search query (searches in description and notes)
- All parameters from "Get All Expenses" are also supported

**Success Response (200):**

```json
{
  "success": true,
  "message": "Expenses list fetched successfully",
  "data": {
    "expenses": [
      {
        "_id": "exp-001",
        "amount": 45.99,
        "description": "Lunch at Italian restaurant",
        "date": "2025-12-30",
        "categoryId": "cat-001",
        "tags": ["tag-001"],
        "paymentMethod": "credit"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 1,
      "totalItems": 1,
      "itemsPerPage": 50,
      "hasNextPage": false,
      "hasPrevPage": false
    }
  }
}
```

**Example Request (JavaScript):**

```javascript
const accessToken = localStorage.getItem('accessToken');
const searchQuery = 'restaurant';

const params = new URLSearchParams({
  q: searchQuery,
  page: '1',
  limit: '50'
});

const response = await fetch(`http://localhost:3000/api/expenses/search?${params}`, {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${accessToken}`
  }
});

const data = await response.json();
```

---

### 4. Get Expense by ID

Retrieve a specific expense by its ID.

**Endpoint:** `GET /api/expenses/:id`

**Authentication:** Required

**Path Parameters:**

- `id`: Expense UUID

**Success Response (200):**

```json
{
  "success": true,
  "message": "Expense fetched successfully",
  "data": {
    "expense": {
      "_id": "exp-001",
      "userId": "71b57f26-a550-4de6-b5aa-ddb61f9151ba",
      "amount": 45.99,
      "description": "Lunch at restaurant",
      "date": "2025-12-30",
      "categoryId": "cat-001",
      "tags": ["tag-001", "tag-002"],
      "paymentMethod": "credit",
      "notes": "Business lunch with client",
      "attachments": [
        {
          "_id": "att-001",
          "filename": "receipt.jpg",
          "mimeType": "image/jpeg",
          "size": 245678
        }
      ],
      "createdAt": "2025-12-30T10:00:00.000Z",
      "updatedAt": "2025-12-30T10:00:00.000Z"
    }
  }
}
```

**Error Response (404):**

```json
{
  "success": false,
  "error": {
    "message": "Expense not found",
    "statusCode": 404
  }
}
```

**Example Request (JavaScript):**

```javascript
const accessToken = localStorage.getItem('accessToken');
const expenseId = 'exp-001';

const response = await fetch(`http://localhost:3000/api/expenses/${expenseId}`, {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${accessToken}`
  }
});

const data = await response.json();
```

---

### 5. Update Expense

Update an existing expense.

**Endpoint:** `PUT /api/expenses/:id` or `PATCH /api/expenses/:id`

**Authentication:** Required

**Path Parameters:**

- `id`: Expense UUID

**Request Body:** (all fields optional)

```json
{
  "amount": 55.99,
  "description": "Updated description",
  "date": "2025-12-29",
  "categoryId": "cat-002",
  "tags": ["tag-003"],
  "paymentMethod": "debit",
  "notes": "Updated notes"
}
```

**Validation Rules:**

- Same as create, but all fields are optional

**Success Response (200):**

```json
{
  "success": true,
  "message": "Expense updated successfully",
  "data": {
    "expense": {
      "_id": "exp-001",
      "userId": "71b57f26-a550-4de6-b5aa-ddb61f9151ba",
      "amount": 55.99,
      "description": "Updated description",
      "date": "2025-12-29",
      "categoryId": "cat-002",
      "tags": ["tag-003"],
      "paymentMethod": "debit",
      "notes": "Updated notes",
      "attachments": [],
      "createdAt": "2025-12-30T10:00:00.000Z",
      "updatedAt": "2025-12-30T12:00:00.000Z"
    }
  }
}
```

**Example Request (JavaScript):**

```javascript
const accessToken = localStorage.getItem('accessToken');
const expenseId = 'exp-001';

const response = await fetch(`http://localhost:3000/api/expenses/${expenseId}`, {
  method: 'PUT',
  headers: {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    amount: 55.99,
    description: 'Updated description'
  })
});

const data = await response.json();
```

---

### 6. Delete Expense

Delete an expense.

**Endpoint:** `DELETE /api/expenses/:id`

**Authentication:** Required

**Path Parameters:**

- `id`: Expense UUID

**Success Response (200):**

```json
{
  "success": true,
  "message": "Expense deleted successfully"
}
```

**Error Response (404):**

```json
{
  "success": false,
  "error": {
    "message": "Expense not found",
    "statusCode": 404
  }
}
```

**Example Request (JavaScript):**

```javascript
const accessToken = localStorage.getItem('accessToken');
const expenseId = 'exp-001';

const response = await fetch(`http://localhost:3000/api/expenses/${expenseId}`, {
  method: 'DELETE',
  headers: {
    'Authorization': `Bearer ${accessToken}`
  }
});

const data = await response.json();
```

---

### 7. Get Summary Statistics

Get overall expense statistics for the user.

**Endpoint:** `GET /api/expenses/stats/summary`

**Authentication:** Required

**Query Parameters:**

- `startDate` (optional): Filter start date (YYYY-MM-DD)
- `endDate` (optional): Filter end date (YYYY-MM-DD)

**Success Response (200):**

```json
{
  "success": true,
  "message": "Statistics fetched successfully",
  "data": {
    "summary": {
      "totalExpenses": 150,
      "totalAmount": 5432.50,
      "averageExpense": 36.22,
      "highestExpense": 500.00,
      "lowestExpense": 5.50,
      "period": {
        "startDate": "2025-12-01",
        "endDate": "2025-12-31"
      }
    }
  }
}
```

**Example Request (JavaScript):**

```javascript
const accessToken = localStorage.getItem('accessToken');

const params = new URLSearchParams({
  startDate: '2025-12-01',
  endDate: '2025-12-31'
});

const response = await fetch(`http://localhost:3000/api/expenses/stats/summary?${params}`, {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${accessToken}`
  }
});

const data = await response.json();
```

---

### 8. Get Category Statistics

Get expense breakdown by category.

**Endpoint:** `GET /api/expenses/stats/by-category`

**Authentication:** Required

**Query Parameters:**

- `startDate` (optional): Filter start date (YYYY-MM-DD)
- `endDate` (optional): Filter end date (YYYY-MM-DD)

**Success Response (200):**

```json
{
  "success": true,
  "message": "Statistics fetched successfully",
  "data": {
    "categories": [
      {
        "categoryId": "cat-001",
        "categoryName": "Food & Dining",
        "count": 45,
        "totalAmount": 1234.50,
        "percentage": 22.7,
        "averageAmount": 27.43
      },
      {
        "categoryId": "cat-002",
        "categoryName": "Transportation",
        "count": 30,
        "totalAmount": 890.25,
        "percentage": 16.4,
        "averageAmount": 29.68
      }
    ],
    "totalAmount": 5432.50,
    "totalCount": 150
  }
}
```

**Example Request (JavaScript):**

```javascript
const accessToken = localStorage.getItem('accessToken');

const response = await fetch('http://localhost:3000/api/expenses/stats/by-category', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${accessToken}`
  }
});

const data = await response.json();
```

---

### 9. Get Tag Statistics

Get expense breakdown by tag.

**Endpoint:** `GET /api/expenses/stats/by-tag`

**Authentication:** Required

**Query Parameters:**

- `startDate` (optional): Filter start date (YYYY-MM-DD)
- `endDate` (optional): Filter end date (YYYY-MM-DD)

**Success Response (200):**

```json
{
  "success": true,
  "message": "Statistics fetched successfully",
  "data": {
    "tags": [
      {
        "tagId": "tag-001",
        "tagName": "urgent",
        "count": 12,
        "totalAmount": 567.80,
        "percentage": 10.4,
        "averageAmount": 47.32
      },
      {
        "tagId": "tag-002",
        "tagName": "personal",
        "count": 25,
        "totalAmount": 1234.00,
        "percentage": 22.7,
        "averageAmount": 49.36
      }
    ],
    "totalAmount": 5432.50,
    "totalCount": 150
  }
}
```

**Example Request (JavaScript):**

```javascript
const accessToken = localStorage.getItem('accessToken');

const response = await fetch('http://localhost:3000/api/expenses/stats/by-tag', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${accessToken}`
  }
});

const data = await response.json();
```

---

### 10. Get Monthly Statistics

Get expense breakdown by month.

**Endpoint:** `GET /api/expenses/stats/by-month`

**Authentication:** Required

**Query Parameters:**

- `year` (optional): Year to get stats for (default: current year)
- `months` (optional): Number of months to include (default: 12)

**Success Response (200):**

```json
{
  "success": true,
  "message": "Statistics fetched successfully",
  "data": {
    "months": [
      {
        "month": "2025-01",
        "monthName": "January 2025",
        "count": 45,
        "totalAmount": 1234.50,
        "averageAmount": 27.43
      },
      {
        "month": "2025-02",
        "monthName": "February 2025",
        "count": 38,
        "totalAmount": 987.25,
        "averageAmount": 25.98
      }
    ],
    "totalAmount": 5432.50,
    "totalCount": 150,
    "period": "2025"
  }
}
```

**Example Request (JavaScript):**

```javascript
const accessToken = localStorage.getItem('accessToken');

const params = new URLSearchParams({
  year: '2025',
  months: '12'
});

const response = await fetch(`http://localhost:3000/api/expenses/stats/by-month?${params}`, {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${accessToken}`
  }
});

const data = await response.json();
```

---

### 11. Get Spending Trends

Get spending trends over time.

**Endpoint:** `GET /api/expenses/stats/trends`

**Authentication:** Required

**Query Parameters:**

- `period` (optional): `week`, `month`, `quarter`, or `year` (default: month)
- `count` (optional): Number of periods to include (default: 6)

**Success Response (200):**

```json
{
  "success": true,
  "message": "Statistics fetched successfully",
  "data": {
    "trends": [
      {
        "period": "2025-12",
        "periodLabel": "December 2025",
        "totalAmount": 1234.50,
        "count": 45,
        "averageAmount": 27.43,
        "trend": "up",
        "percentageChange": 15.5
      },
      {
        "period": "2025-11",
        "periodLabel": "November 2025",
        "totalAmount": 1067.34,
        "count": 42,
        "averageAmount": 25.41,
        "trend": "down",
        "percentageChange": -5.2
      }
    ],
    "overallTrend": "up",
    "averageMonthlySpending": 1150.92
  }
}
```

**Example Request (JavaScript):**

```javascript
const accessToken = localStorage.getItem('accessToken');

const params = new URLSearchParams({
  period: 'month',
  count: '6'
});

const response = await fetch(`http://localhost:3000/api/expenses/stats/trends?${params}`, {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${accessToken}`
  }
});

const data = await response.json();
```

---

### 12. Export Expenses

Export expenses to JSON or CSV format.

**Endpoint:** `POST /api/expenses/export`

**Authentication:** Required

**Request Body:**

```json
{
  "format": "csv",
  "startDate": "2025-12-01",
  "endDate": "2025-12-31"
}
```

**Validation Rules:**

- `format`: Required, `json` or `csv`
- `startDate`: Optional, YYYY-MM-DD format
- `endDate`: Optional, YYYY-MM-DD format

**Success Response (200):**

For JSON format:
```json
{
  "success": true,
  "message": "Expenses exported successfully",
  "data": {
    "format": "json",
    "count": 150,
    "expenses": [
      {
        "_id": "exp-001",
        "amount": 45.99,
        "description": "Lunch at restaurant",
        "date": "2025-12-30",
        "categoryId": "cat-001",
        "categoryName": "Food & Dining",
        "tags": ["urgent", "personal"],
        "paymentMethod": "credit",
        "createdAt": "2025-12-30T10:00:00.000Z"
      }
    ]
  }
}
```

For CSV format (returns CSV string):
```
Content-Type: text/csv
Content-Disposition: attachment; filename="expenses_2025-12-01_to_2025-12-31.csv"

Date,Amount,Description,Category,Payment Method,Tags,Notes
2025-12-30,45.99,"Lunch at restaurant","Food & Dining",credit,"urgent,personal","Business lunch"
```

**Example Request (JavaScript):**

```javascript
const accessToken = localStorage.getItem('accessToken');

// For JSON export
const response = await fetch('http://localhost:3000/api/expenses/export', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    format: 'json',
    startDate: '2025-12-01',
    endDate: '2025-12-31'
  })
});

const data = await response.json();

// For CSV export
const csvResponse = await fetch('http://localhost:3000/api/expenses/export', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    format: 'csv',
    startDate: '2025-12-01',
    endDate: '2025-12-31'
  })
});

const csvText = await csvResponse.text();
// Download CSV file
const blob = new Blob([csvText], { type: 'text/csv' });
const url = window.URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = 'expenses.csv';
a.click();
```

---

### 13. Import Expenses

Bulk import expenses from an array.

**Endpoint:** `POST /api/expenses/import`

**Authentication:** Required

**Request Body:**

```json
{
  "expenses": [
    {
      "amount": 45.99,
      "description": "Lunch",
      "date": "2025-12-30",
      "categoryId": "cat-001",
      "paymentMethod": "credit"
    },
    {
      "amount": 120.50,
      "description": "Gas",
      "date": "2025-12-29",
      "categoryId": "cat-002",
      "paymentMethod": "debit"
    }
  ]
}
```

**Validation Rules:**

- `expenses`: Required, array of expense objects
- Each expense object follows the same validation as create expense
- `amount` and `description` are required for each expense

**Success Response (201):**

```json
{
  "success": true,
  "message": "Expenses imported successfully",
  "data": {
    "imported": 2,
    "failed": 0,
    "errors": [],
    "expenses": [
      {
        "_id": "exp-001",
        "amount": 45.99,
        "description": "Lunch",
        "date": "2025-12-30",
        "categoryId": "cat-001",
        "paymentMethod": "credit"
      },
      {
        "_id": "exp-002",
        "amount": 120.50,
        "description": "Gas",
        "date": "2025-12-29",
        "categoryId": "cat-002",
        "paymentMethod": "debit"
      }
    ]
  }
}
```

**Partial Success Response (207):**

```json
{
  "success": true,
  "message": "Expenses imported with some errors",
  "data": {
    "imported": 1,
    "failed": 1,
    "errors": [
      {
        "index": 1,
        "expense": {
          "amount": -50,
          "description": ""
        },
        "errors": [
          {
            "field": "amount",
            "message": "Amount must be at least 0.01"
          },
          {
            "field": "description",
            "message": "Description is required"
          }
        ]
      }
    ],
    "expenses": [
      {
        "_id": "exp-001",
        "amount": 45.99,
        "description": "Lunch",
        "date": "2025-12-30"
      }
    ]
  }
}
```

**Example Request (JavaScript):**

```javascript
const accessToken = localStorage.getItem('accessToken');

const expensesToImport = [
  {
    amount: 45.99,
    description: 'Lunch',
    date: '2025-12-30',
    categoryId: 'cat-001',
    paymentMethod: 'credit'
  },
  {
    amount: 120.50,
    description: 'Gas',
    date: '2025-12-29',
    categoryId: 'cat-002',
    paymentMethod: 'debit'
  }
];

const response = await fetch('http://localhost:3000/api/expenses/import', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    expenses: expensesToImport
  })
});

const data = await response.json();
console.log(`Imported ${data.data.imported} expenses, ${data.data.failed} failed`);
```

---

## Recurring Expense Endpoints

### 1. Create Recurring Expense

Create a new recurring expense template.

**Endpoint:** `POST /api/recurring`

**Authentication:** Required

**Request Body:**

```json
{
  "amount": 1200.00,
  "description": "Monthly rent",
  "categoryId": "cat-007",
  "frequency": "monthly",
  "startDate": "2025-01-01",
  "endDate": "2026-01-01",
  "intervalCount": 1,
  "dayOfMonth": 1,
  "paymentMethod": "online",
  "notes": "Apartment rent"
}
```

**Validation Rules:**

- `amount`: Required, 0.01 to 999999999.99
- `description`: Required, 1-500 characters
- `frequency`: Required, one of: `daily`, `weekly`, `monthly`, `yearly`
- `startDate`: Required, YYYY-MM-DD format
- `endDate`: Optional, YYYY-MM-DD format, must be after startDate
- `intervalCount`: Optional, 1-365 (e.g., every 2 weeks = weekly frequency with intervalCount: 2)
- `dayOfMonth`: Optional for monthly/yearly, 1-31
- `dayOfWeek`: Optional for weekly, 0-6 (0=Sunday)
- `categoryId`: Optional, valid category UUID
- `tags`: Optional, array of valid tag UUIDs
- `paymentMethod`: Optional, one of: `cash`, `credit`, `debit`, `online`, `check`, `other`
- `notes`: Optional, max 1000 characters

**Success Response (201):**

```json
{
  "success": true,
  "message": "Recurring expense created successfully",
  "data": {
    "recurringExpense": {
      "_id": "rec-001",
      "userId": "71b57f26-a550-4de6-b5aa-ddb61f9151ba",
      "amount": 1200.00,
      "description": "Monthly rent",
      "categoryId": "cat-007",
      "frequency": "monthly",
      "startDate": "2025-01-01",
      "endDate": "2026-01-01",
      "nextOccurrence": "2025-01-01",
      "intervalCount": 1,
      "dayOfMonth": 1,
      "paymentMethod": "online",
      "notes": "Apartment rent",
      "isActive": true,
      "createdAt": "2025-12-30T10:00:00.000Z",
      "updatedAt": "2025-12-30T10:00:00.000Z"
    }
  }
}
```

**Error Response (400):**

```json
{
  "success": false,
  "error": {
    "message": "Validation failed",
    "statusCode": 400,
    "errors": [
      {
        "field": "frequency",
        "message": "Frequency must be one of: daily, weekly, monthly, yearly"
      }
    ]
  }
}
```

**Example Request (JavaScript):**

```javascript
const accessToken = localStorage.getItem('accessToken');

const response = await fetch('http://localhost:3000/api/recurring', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    amount: 1200.00,
    description: 'Monthly rent',
    categoryId: 'cat-007',
    frequency: 'monthly',
    startDate: '2025-01-01',
    endDate: '2026-01-01',
    intervalCount: 1,
    dayOfMonth: 1,
    paymentMethod: 'online',
    notes: 'Apartment rent'
  })
});

const data = await response.json();
```

---

### 2. Get All Recurring Expenses

Retrieve all recurring expenses for the user.

**Endpoint:** `GET /api/recurring`

**Authentication:** Required

**Query Parameters:**

- `includeInactive` (optional): Include paused recurring expenses - `true` or `false` (default: false)

**Success Response (200):**

```json
{
  "success": true,
  "message": "Recurring expenses list fetched successfully",
  "data": {
    "recurringExpenses": [
      {
        "_id": "rec-001",
        "userId": "71b57f26-a550-4de6-b5aa-ddb61f9151ba",
        "amount": 1200.00,
        "description": "Monthly rent",
        "categoryId": "cat-007",
        "frequency": "monthly",
        "startDate": "2025-01-01",
        "endDate": "2026-01-01",
        "nextOccurrence": "2026-01-01",
        "intervalCount": 1,
        "dayOfMonth": 1,
        "isActive": true,
        "createdAt": "2025-12-30T10:00:00.000Z"
      }
    ],
    "count": 1
  }
}
```

**Example Request (JavaScript):**

```javascript
const accessToken = localStorage.getItem('accessToken');

const response = await fetch('http://localhost:3000/api/recurring?includeInactive=false', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${accessToken}`
  }
});

const data = await response.json();
```

---

### 3. Get Recurring Expense by ID

Retrieve a specific recurring expense by its ID.

**Endpoint:** `GET /api/recurring/:id`

**Authentication:** Required

**Path Parameters:**

- `id`: Recurring expense UUID

**Success Response (200):**

```json
{
  "success": true,
  "message": "Recurring expense fetched successfully",
  "data": {
    "recurringExpense": {
      "_id": "rec-001",
      "userId": "71b57f26-a550-4de6-b5aa-ddb61f9151ba",
      "amount": 1200.00,
      "description": "Monthly rent",
      "categoryId": "cat-007",
      "frequency": "monthly",
      "startDate": "2025-01-01",
      "endDate": "2026-01-01",
      "nextOccurrence": "2026-01-01",
      "intervalCount": 1,
      "dayOfMonth": 1,
      "paymentMethod": "online",
      "notes": "Apartment rent",
      "isActive": true,
      "lastGenerated": "2025-12-01T00:00:00.000Z",
      "createdAt": "2025-12-30T10:00:00.000Z",
      "updatedAt": "2025-12-30T10:00:00.000Z"
    }
  }
}
```

**Error Response (404):**

```json
{
  "success": false,
  "error": {
    "message": "Recurring expense not found",
    "statusCode": 404
  }
}
```

**Example Request (JavaScript):**

```javascript
const accessToken = localStorage.getItem('accessToken');
const recurringId = 'rec-001';

const response = await fetch(`http://localhost:3000/api/recurring/${recurringId}`, {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${accessToken}`
  }
});

const data = await response.json();
```

---

### 4. Update Recurring Expense

Update an existing recurring expense.

**Endpoint:** `PUT /api/recurring/:id`

**Authentication:** Required

**Path Parameters:**

- `id`: Recurring expense UUID

**Request Body:** (all fields optional)

```json
{
  "amount": 1250.00,
  "description": "Updated monthly rent",
  "endDate": "2026-06-01",
  "notes": "Rent increased"
}
```

**Validation Rules:**

- Same as create, but all fields are optional

**Success Response (200):**

```json
{
  "success": true,
  "message": "Recurring expense updated successfully",
  "data": {
    "recurringExpense": {
      "_id": "rec-001",
      "userId": "71b57f26-a550-4de6-b5aa-ddb61f9151ba",
      "amount": 1250.00,
      "description": "Updated monthly rent",
      "categoryId": "cat-007",
      "frequency": "monthly",
      "startDate": "2025-01-01",
      "endDate": "2026-06-01",
      "nextOccurrence": "2026-01-01",
      "notes": "Rent increased",
      "isActive": true,
      "createdAt": "2025-12-30T10:00:00.000Z",
      "updatedAt": "2025-12-30T12:00:00.000Z"
    }
  }
}
```

**Example Request (JavaScript):**

```javascript
const accessToken = localStorage.getItem('accessToken');
const recurringId = 'rec-001';

const response = await fetch(`http://localhost:3000/api/recurring/${recurringId}`, {
  method: 'PUT',
  headers: {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    amount: 1250.00,
    description: 'Updated monthly rent',
    notes: 'Rent increased'
  })
});

const data = await response.json();
```

---

### 5. Delete Recurring Expense

Delete a recurring expense template.

**Endpoint:** `DELETE /api/recurring/:id`

**Authentication:** Required

**Path Parameters:**

- `id`: Recurring expense UUID

**Success Response (200):**

```json
{
  "success": true,
  "message": "Recurring expense deleted successfully"
}
```

**Error Response (404):**

```json
{
  "success": false,
  "error": {
    "message": "Recurring expense not found",
    "statusCode": 404
  }
}
```

**Example Request (JavaScript):**

```javascript
const accessToken = localStorage.getItem('accessToken');
const recurringId = 'rec-001';

const response = await fetch(`http://localhost:3000/api/recurring/${recurringId}`, {
  method: 'DELETE',
  headers: {
    'Authorization': `Bearer ${accessToken}`
  }
});

const data = await response.json();
```

---

### 6. Pause Recurring Expense

Pause an active recurring expense (stops automatic generation).

**Endpoint:** `PUT /api/recurring/:id/pause`

**Authentication:** Required

**Path Parameters:**

- `id`: Recurring expense UUID

**Success Response (200):**

```json
{
  "success": true,
  "message": "Recurring expense paused successfully",
  "data": {
    "recurringExpense": {
      "_id": "rec-001",
      "amount": 1200.00,
      "description": "Monthly rent",
      "isActive": false,
      "updatedAt": "2025-12-30T12:00:00.000Z"
    }
  }
}
```

**Error Response (400):**

```json
{
  "success": false,
  "error": {
    "message": "Recurring expense is already paused",
    "statusCode": 400
  }
}
```

**Example Request (JavaScript):**

```javascript
const accessToken = localStorage.getItem('accessToken');
const recurringId = 'rec-001';

const response = await fetch(`http://localhost:3000/api/recurring/${recurringId}/pause`, {
  method: 'PUT',
  headers: {
    'Authorization': `Bearer ${accessToken}`
  }
});

const data = await response.json();
```

---

### 7. Resume Recurring Expense

Resume a paused recurring expense.

**Endpoint:** `PUT /api/recurring/:id/resume`

**Authentication:** Required

**Path Parameters:**

- `id`: Recurring expense UUID

**Success Response (200):**

```json
{
  "success": true,
  "message": "Recurring expense resumed successfully",
  "data": {
    "recurringExpense": {
      "_id": "rec-001",
      "amount": 1200.00,
      "description": "Monthly rent",
      "isActive": true,
      "updatedAt": "2025-12-30T12:00:00.000Z"
    }
  }
}
```

**Error Response (400):**

```json
{
  "success": false,
  "error": {
    "message": "Recurring expense is already active",
    "statusCode": 400
  }
}
```

**Example Request (JavaScript):**

```javascript
const accessToken = localStorage.getItem('accessToken');
const recurringId = 'rec-001';

const response = await fetch(`http://localhost:3000/api/recurring/${recurringId}/resume`, {
  method: 'PUT',
  headers: {
    'Authorization': `Bearer ${accessToken}`
  }
});

const data = await response.json();
```

---

### 8. Generate Expense Manually

Manually generate an expense from a recurring template.

**Endpoint:** `POST /api/recurring/:id/generate`

**Authentication:** Required

**Path Parameters:**

- `id`: Recurring expense UUID

**Request Body:** (optional)

```json
{
  "date": "2025-12-30"
}
```

**Success Response (201):**

```json
{
  "success": true,
  "message": "Expense generated successfully from recurring template",
  "data": {
    "expense": {
      "_id": "exp-new-001",
      "userId": "71b57f26-a550-4de6-b5aa-ddb61f9151ba",
      "amount": 1200.00,
      "description": "Monthly rent",
      "date": "2025-12-30",
      "categoryId": "cat-007",
      "paymentMethod": "online",
      "notes": "Apartment rent",
      "recurringExpenseId": "rec-001",
      "createdAt": "2025-12-30T12:00:00.000Z"
    },
    "recurringExpense": {
      "_id": "rec-001",
      "nextOccurrence": "2026-01-01",
      "lastGenerated": "2025-12-30T12:00:00.000Z"
    }
  }
}
```

**Example Request (JavaScript):**

```javascript
const accessToken = localStorage.getItem('accessToken');
const recurringId = 'rec-001';

const response = await fetch(`http://localhost:3000/api/recurring/${recurringId}/generate`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    date: '2025-12-30'
  })
});

const data = await response.json();
```

---

### 9. Get Generated History

Get the history of expenses generated from a recurring template.

**Endpoint:** `GET /api/recurring/:id/history`

**Authentication:** Required

**Path Parameters:**

- `id`: Recurring expense UUID

**Query Parameters:**

- `limit` (optional): Number of records to return (default: 50)

**Success Response (200):**

```json
{
  "success": true,
  "message": "Generated expenses history fetched successfully",
  "data": {
    "recurringExpense": {
      "_id": "rec-001",
      "description": "Monthly rent"
    },
    "generatedExpenses": [
      {
        "_id": "exp-001",
        "amount": 1200.00,
        "description": "Monthly rent",
        "date": "2025-12-01",
        "createdAt": "2025-12-01T00:00:00.000Z"
      },
      {
        "_id": "exp-002",
        "amount": 1200.00,
        "description": "Monthly rent",
        "date": "2025-11-01",
        "createdAt": "2025-11-01T00:00:00.000Z"
      }
    ],
    "count": 2
  }
}
```

**Example Request (JavaScript):**

```javascript
const accessToken = localStorage.getItem('accessToken');
const recurringId = 'rec-001';

const response = await fetch(`http://localhost:3000/api/recurring/${recurringId}/history?limit=50`, {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${accessToken}`
  }
});

const data = await response.json();
```

---

### 10. Get Upcoming Recurring Expenses

Get all recurring expenses that will generate soon.

**Endpoint:** `GET /api/recurring/upcoming`

**Authentication:** Required

**Query Parameters:**

- `days` (optional): Number of days to look ahead (default: 30)

**Success Response (200):**

```json
{
  "success": true,
  "message": "Upcoming recurring expenses fetched successfully",
  "data": {
    "upcoming": [
      {
        "_id": "rec-001",
        "amount": 1200.00,
        "description": "Monthly rent",
        "nextOccurrence": "2026-01-01",
        "daysUntil": 2,
        "frequency": "monthly"
      },
      {
        "_id": "rec-002",
        "amount": 50.00,
        "description": "Gym membership",
        "nextOccurrence": "2026-01-15",
        "daysUntil": 16,
        "frequency": "monthly"
      }
    ],
    "count": 2,
    "totalAmount": 1250.00
  }
}
```

**Example Request (JavaScript):**

```javascript
const accessToken = localStorage.getItem('accessToken');

const response = await fetch('http://localhost:3000/api/recurring/upcoming?days=30', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${accessToken}`
  }
});

const data = await response.json();
```

---

## Attachment Endpoints

### 1. Upload Attachment

Upload a file attachment for an expense.

**Endpoint:** `POST /api/attachments/expenses/:expenseId`

**Authentication:** Required

**Path Parameters:**

- `expenseId`: Expense UUID

**Request Body:** (multipart/form-data)

- `file`: File to upload (required)
- `category`: Attachment category - `receipt`, `invoice`, `document`, `image`, `other` (optional)

**File Validation:**

- **Allowed Image Types:** JPEG, PNG, GIF, WebP
- **Allowed Document Types:** PDF, DOC, DOCX, XLS, XLSX, TXT, CSV
- **Max Image Size:** 5 MB
- **Max Document Size:** 10 MB
- **Max Files Per Expense:** 10

**Success Response (201):**

```json
{
  "success": true,
  "message": "Attachment uploaded successfully",
  "data": {
    "attachment": {
      "_id": "att-001",
      "userId": "71b57f26-a550-4de6-b5aa-ddb61f9151ba",
      "expenseId": "exp-001",
      "originalName": "receipt.jpg",
      "filename": "1735560000000-uuid-receipt.jpg",
      "mimeType": "image/jpeg",
      "size": 245678,
      "readableSize": "239.92 KB",
      "path": "/uploads/receipts/1735560000000-uuid-receipt.jpg",
      "thumbnailPath": "/uploads/thumbnails/thumb_1735560000000-uuid-receipt.jpg",
      "category": "receipt",
      "createdAt": "2025-12-30T10:00:00.000Z"
    }
  }
}
```

**Error Response (400):**

```json
{
  "success": false,
  "error": {
    "message": "Invalid file type. Allowed types: images (JPEG, PNG, GIF, WebP) and documents (PDF, DOC, DOCX, XLS, XLSX, TXT, CSV)",
    "statusCode": 400
  }
}
```

**Error Response (413):**

```json
{
  "success": false,
  "error": {
    "message": "File size exceeds maximum limit",
    "statusCode": 413
  }
}
```

**Example Request (JavaScript):**

```javascript
const accessToken = localStorage.getItem('accessToken');
const expenseId = 'exp-001';
const fileInput = document.getElementById('fileInput');
const file = fileInput.files[0];

const formData = new FormData();
formData.append('file', file);
formData.append('category', 'receipt');

const response = await fetch(`http://localhost:3000/api/attachments/expenses/${expenseId}`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${accessToken}`
  },
  body: formData
});

const data = await response.json();
```

**Example Request (cURL):**

```bash
curl -X POST http://localhost:3000/api/attachments/expenses/exp-001 \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -F "file=@/path/to/receipt.jpg" \
  -F "category=receipt"
```

---

### 2. Get Expense Attachments

Get all attachments for a specific expense.

**Endpoint:** `GET /api/attachments/expenses/:expenseId`

**Authentication:** Required

**Path Parameters:**

- `expenseId`: Expense UUID

**Success Response (200):**

```json
{
  "success": true,
  "message": "Attachments list fetched successfully",
  "data": {
    "attachments": [
      {
        "_id": "att-001",
        "expenseId": "exp-001",
        "originalName": "receipt.jpg",
        "filename": "1735560000000-uuid-receipt.jpg",
        "mimeType": "image/jpeg",
        "size": 245678,
        "readableSize": "239.92 KB",
        "category": "receipt",
        "thumbnailPath": "/uploads/thumbnails/thumb_1735560000000-uuid-receipt.jpg",
        "createdAt": "2025-12-30T10:00:00.000Z"
      },
      {
        "_id": "att-002",
        "expenseId": "exp-001",
        "originalName": "invoice.pdf",
        "filename": "1735560100000-uuid-invoice.pdf",
        "mimeType": "application/pdf",
        "size": 512000,
        "readableSize": "500 KB",
        "category": "invoice",
        "thumbnailPath": null,
        "createdAt": "2025-12-30T10:05:00.000Z"
      }
    ],
    "count": 2,
    "totalSize": 757678,
    "totalSizeReadable": "739.92 KB"
  }
}
```

**Example Request (JavaScript):**

```javascript
const accessToken = localStorage.getItem('accessToken');
const expenseId = 'exp-001';

const response = await fetch(`http://localhost:3000/api/attachments/expenses/${expenseId}`, {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${accessToken}`
  }
});

const data = await response.json();
```

---

### 3. Get Attachment by ID

Get details of a specific attachment.

**Endpoint:** `GET /api/attachments/:id`

**Authentication:** Required

**Path Parameters:**

- `id`: Attachment UUID

**Success Response (200):**

```json
{
  "success": true,
  "message": "Attachment fetched successfully",
  "data": {
    "attachment": {
      "_id": "att-001",
      "userId": "71b57f26-a550-4de6-b5aa-ddb61f9151ba",
      "expenseId": "exp-001",
      "originalName": "receipt.jpg",
      "filename": "1735560000000-uuid-receipt.jpg",
      "mimeType": "image/jpeg",
      "size": 245678,
      "readableSize": "239.92 KB",
      "path": "/uploads/receipts/1735560000000-uuid-receipt.jpg",
      "thumbnailPath": "/uploads/thumbnails/thumb_1735560000000-uuid-receipt.jpg",
      "category": "receipt",
      "createdAt": "2025-12-30T10:00:00.000Z",
      "updatedAt": "2025-12-30T10:00:00.000Z"
    }
  }
}
```

**Error Response (404):**

```json
{
  "success": false,
  "error": {
    "message": "Attachment not found",
    "statusCode": 404
  }
}
```

**Example Request (JavaScript):**

```javascript
const accessToken = localStorage.getItem('accessToken');
const attachmentId = 'att-001';

const response = await fetch(`http://localhost:3000/api/attachments/${attachmentId}`, {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${accessToken}`
  }
});

const data = await response.json();
```

---

### 4. Download Attachment

Download the original file.

**Endpoint:** `GET /api/attachments/:id/download`

**Authentication:** Required

**Path Parameters:**

- `id`: Attachment UUID

**Success Response (200):**

Returns the file with appropriate headers:
```
Content-Type: image/jpeg (or appropriate mime type)
Content-Disposition: attachment; filename="receipt.jpg"
Content-Length: 245678
```

**Error Response (404):**

```json
{
  "success": false,
  "error": {
    "message": "File not found on server",
    "statusCode": 404
  }
}
```

**Example Request (JavaScript):**

```javascript
const accessToken = localStorage.getItem('accessToken');
const attachmentId = 'att-001';

const response = await fetch(`http://localhost:3000/api/attachments/${attachmentId}/download`, {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${accessToken}`
  }
});

// Download the file
const blob = await response.blob();
const url = window.URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = 'receipt.jpg'; // Get filename from response headers
a.click();
window.URL.revokeObjectURL(url);
```

---

### 5. Get Thumbnail

Get the thumbnail image for an attachment (images only).

**Endpoint:** `GET /api/attachments/:id/thumbnail`

**Authentication:** Required

**Path Parameters:**

- `id`: Attachment UUID

**Success Response (200):**

Returns the thumbnail image file:
```
Content-Type: image/jpeg
Content-Length: 15234
```

Thumbnail specifications:
- Size: 200x200 pixels
- Format: JPEG
- Quality: 80%
- Fit: Cover (centered)

**Error Response (400):**

```json
{
  "success": false,
  "error": {
    "message": "Thumbnail generation failed",
    "statusCode": 400
  }
}
```

**Error Response (404):**

```json
{
  "success": false,
  "error": {
    "message": "Attachment not found",
    "statusCode": 404
  }
}
```

**Example Request (JavaScript):**

```javascript
const accessToken = localStorage.getItem('accessToken');
const attachmentId = 'att-001';

// Display thumbnail in an img tag
const imgElement = document.getElementById('thumbnail');
imgElement.src = `http://localhost:3000/api/attachments/${attachmentId}/thumbnail`;

// Or fetch and create object URL
const response = await fetch(`http://localhost:3000/api/attachments/${attachmentId}/thumbnail`, {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${accessToken}`
  }
});

const blob = await response.blob();
const imageUrl = URL.createObjectURL(blob);
imgElement.src = imageUrl;
```

---

### 6. Delete Attachment

Delete an attachment and its associated files.

**Endpoint:** `DELETE /api/attachments/:id`

**Authentication:** Required

**Path Parameters:**

- `id`: Attachment UUID

**Success Response (200):**

```json
{
  "success": true,
  "message": "Attachment deleted successfully"
}
```

**Error Response (404):**

```json
{
  "success": false,
  "error": {
    "message": "Attachment not found",
    "statusCode": 404
  }
}
```

**Example Request (JavaScript):**

```javascript
const accessToken = localStorage.getItem('accessToken');
const attachmentId = 'att-001';

const response = await fetch(`http://localhost:3000/api/attachments/${attachmentId}`, {
  method: 'DELETE',
  headers: {
    'Authorization': `Bearer ${accessToken}`
  }
});

const data = await response.json();
```

---

### 7. Get Storage Statistics

Get storage statistics for the authenticated user.

**Endpoint:** `GET /api/attachments/storage-stats`

**Authentication:** Required

**Success Response (200):**

```json
{
  "success": true,
  "data": {
    "statistics": {
      "totalFiles": 15,
      "totalSize": 12345678,
      "totalSizeReadable": "11.77 MB",
      "totalImages": 10,
      "totalDocuments": 5,
      "imageSize": 7654321,
      "imageSizeReadable": "7.30 MB",
      "documentSize": 4691357,
      "documentSizeReadable": "4.47 MB",
      "byCategory": {
        "receipt": {
          "count": 8,
          "size": 5678912,
          "sizeReadable": "5.42 MB"
        },
        "invoice": {
          "count": 4,
          "size": 3456789,
          "sizeReadable": "3.30 MB"
        },
        "document": {
          "count": 2,
          "size": 2098765,
          "sizeReadable": "2.00 MB"
        },
        "image": {
          "count": 1,
          "size": 1111212,
          "sizeReadable": "1.06 MB"
        }
      }
    }
  }
}
```

**Example Request (JavaScript):**

```javascript
const accessToken = localStorage.getItem('accessToken');

const response = await fetch('http://localhost:3000/api/attachments/storage-stats', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${accessToken}`
  }
});

const data = await response.json();
console.log(`Total storage used: ${data.data.statistics.totalSizeReadable}`);
```

---

## Additional Information

### Rate Limiting

Currently, there is no rate limiting implemented. For production use, consider implementing rate limiting on sensitive endpoints.

### CORS

The API supports CORS. Configure allowed origins in the `.env` file using the `CORS_ORIGIN` variable.

### Data Persistence

All data is stored in JSON files located in the `data/` directory. Uploaded files are stored in the `uploads/` directory.

### Automated Tasks

The system runs automated tasks:
- **Recurring Expense Generation**: Runs daily at midnight (00:00) to generate expenses from active recurring templates

### File Storage

Uploaded files are organized in the following structure:
```
uploads/
├── receipts/           # Original uploaded files
└── thumbnails/         # Generated thumbnails for images
```

### Best Practices for Frontend Integration

1. **Token Management**:
   - Store access token in memory or sessionStorage
   - Store refresh token in httpOnly cookie or secure storage
   - Implement automatic token refresh before expiration
   - Clear tokens on logout

2. **Error Handling**:
   - Always check `response.ok` before parsing JSON
   - Handle validation errors by displaying field-specific messages
   - Implement retry logic for network errors
   - Show user-friendly error messages

3. **File Uploads**:
   - Validate file size and type on the frontend before upload
   - Show upload progress
   - Display thumbnails for image attachments
   - Handle upload errors gracefully

4. **Pagination**:
   - Implement infinite scroll or pagination controls
   - Cache fetched pages to reduce API calls
   - Show loading indicators during fetches

5. **Search and Filters**:
   - Debounce search input to reduce API calls
   - Allow users to clear/reset filters
   - Persist filter state in URL query parameters

---

## Support

For issues, questions, or feature requests, please contact the development team or refer to the main [README.md](./README.md).
