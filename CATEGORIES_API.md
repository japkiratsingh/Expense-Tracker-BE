# Categories API Documentation

## Overview

The Categories API allows users to manage expense categories. The system includes 12 predefined system categories that are automatically initialized for all users, plus the ability for users to create their own custom categories.

## Base URL

```
http://localhost:3000/api/categories
```

## Authentication

All endpoints require authentication via JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

---

## System Categories

The following 12 system categories are automatically created and available to all users:

1. **Food & Dining** - Restaurants, groceries, and food delivery
2. **Transportation** - Gas, public transit, ride shares, and vehicle maintenance
3. **Shopping** - Clothing, electronics, and general shopping
4. **Entertainment** - Movies, concerts, hobbies, and subscriptions
5. **Bills & Utilities** - Electricity, water, internet, and phone bills
6. **Healthcare** - Medical expenses, pharmacy, and insurance
7. **Home** - Rent, mortgage, furniture, and home improvement
8. **Education** - Tuition, books, courses, and training
9. **Personal Care** - Salon, gym, beauty products, and wellness
10. **Travel** - Flights, hotels, and vacation expenses
11. **Income** - Salary, bonuses, and other income
12. **Other** - Miscellaneous expenses

---

## Endpoints

### 1. Create a Category

Create a new user-defined category.

**Endpoint:** `POST /api/categories`

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

**Field Specifications:**
- `name` (required): 2-50 characters
- `description` (optional): Max 200 characters
- `color` (optional): Hex color code (e.g., #FF5733), defaults to #808080
- `icon` (optional): Icon name, max 50 characters, defaults to "category"
- `budget` (optional): Number between 0 and 999,999,999.99
- `parentCategoryId` (optional): ID of parent category for subcategories

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Category created successfully",
  "data": {
    "category": {
      "_id": "306dca8a-1b10-4b42-a649-499dabb44ee7",
      "userId": "71b57f26-a550-4de6-b5aa-ddb61f9151ba",
      "name": "Freelance Work",
      "description": "Income from freelance projects",
      "color": "#4A90E2",
      "icon": "work",
      "type": "user",
      "budget": 5000,
      "parentCategoryId": null,
      "isActive": true,
      "createdAt": "2025-12-30T09:30:56.902Z",
      "updatedAt": "2025-12-30T09:30:56.903Z"
    }
  }
}
```

**Error Responses:**
- `400 Bad Request` - Invalid input or category name already exists
- `401 Unauthorized` - Missing or invalid token

---

### 2. Get All Categories

Retrieve all categories (system + user's own custom categories).

**Endpoint:** `GET /api/categories`

**Query Parameters:**
- `type` (optional): Filter by type - "system", "user", or "all"
- `includeInactive` (optional): Boolean to include inactive categories

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Categories retrieved successfully",
  "data": {
    "categories": [
      {
        "_id": "fce405b6-1b29-451d-8405-5b13f111a7e7",
        "userId": null,
        "name": "Food & Dining",
        "description": "Restaurants, groceries, and food delivery",
        "color": "#FF6B6B",
        "icon": "restaurant",
        "type": "system",
        "budget": null,
        "parentCategoryId": null,
        "isActive": true,
        "createdAt": "2025-12-30T09:20:08.707Z",
        "updatedAt": "2025-12-30T09:20:08.707Z"
      },
      {
        "_id": "306dca8a-1b10-4b42-a649-499dabb44ee7",
        "userId": "71b57f26-a550-4de6-b5aa-ddb61f9151ba",
        "name": "Freelance Work",
        "description": "Income from freelance projects",
        "color": "#4A90E2",
        "icon": "work",
        "type": "user",
        "budget": 5000,
        "parentCategoryId": null,
        "isActive": true,
        "createdAt": "2025-12-30T09:30:56.902Z",
        "updatedAt": "2025-12-30T09:30:56.903Z"
      }
    ],
    "count": 13
  }
}
```

---

### 3. Get Category by ID

Retrieve details of a specific category.

**Endpoint:** `GET /api/categories/:id`

**URL Parameters:**
- `id` (required): Category ID

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Category retrieved successfully",
  "data": {
    "category": {
      "_id": "306dca8a-1b10-4b42-a649-499dabb44ee7",
      "userId": "71b57f26-a550-4de6-b5aa-ddb61f9151ba",
      "name": "Freelance Work",
      "description": "Income from freelance projects",
      "color": "#4A90E2",
      "icon": "work",
      "type": "user",
      "budget": 5000,
      "parentCategoryId": null,
      "isActive": true,
      "createdAt": "2025-12-30T09:30:56.902Z",
      "updatedAt": "2025-12-30T09:30:56.903Z"
    }
  }
}
```

**Error Responses:**
- `404 Not Found` - Category not found
- `403 Forbidden` - Unauthorized to access this category

---

### 4. Update a Category

Update an existing user category. System categories cannot be modified.

**Endpoint:** `PUT /api/categories/:id`

**URL Parameters:**
- `id` (required): Category ID

**Request Body:**
```json
{
  "name": "Freelance & Consulting",
  "description": "Updated description",
  "color": "#5BA3E2",
  "icon": "business_center",
  "budget": 7500,
  "isActive": true
}
```

**Note:** All fields are optional. Only provided fields will be updated.

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Category updated successfully",
  "data": {
    "category": {
      "_id": "306dca8a-1b10-4b42-a649-499dabb44ee7",
      "userId": "71b57f26-a550-4de6-b5aa-ddb61f9151ba",
      "name": "Freelance & Consulting",
      "description": "Updated description",
      "color": "#5BA3E2",
      "icon": "business_center",
      "type": "user",
      "budget": 7500,
      "parentCategoryId": null,
      "isActive": true,
      "createdAt": "2025-12-30T09:30:56.902Z",
      "updatedAt": "2025-12-30T09:35:22.445Z"
    }
  }
}
```

**Error Responses:**
- `400 Bad Request` - Invalid input or duplicate name
- `403 Forbidden` - Cannot modify system categories or unauthorized
- `404 Not Found` - Category not found

---

### 5. Delete a Category

Soft delete a user category. System categories cannot be deleted.

**Endpoint:** `DELETE /api/categories/:id`

**URL Parameters:**
- `id` (required): Category ID

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Category deleted successfully",
  "data": null
}
```

**Error Responses:**
- `403 Forbidden` - Cannot delete system categories or unauthorized
- `404 Not Found` - Category not found

**Note:** This is a soft delete - the category is marked as inactive but not removed from the database.

---

### 6. Get Category Expenses

Get all expenses in a specific category.

**Endpoint:** `GET /api/categories/:id/expenses`

**URL Parameters:**
- `id` (required): Category ID

**Query Parameters:**
- `startDate` (optional): ISO 8601 date string
- `endDate` (optional): ISO 8601 date string
- `page` (optional): Page number (min: 1)
- `limit` (optional): Results per page (min: 1, max: 100)

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Category expenses retrieved successfully",
  "data": {
    "expenses": [],
    "total": 0,
    "message": "Expense feature not yet implemented"
  }
}
```

**Note:** This endpoint will be fully functional once the Expenses feature is implemented.

---

### 7. Get Category Statistics

Get statistics for a specific category.

**Endpoint:** `GET /api/categories/:id/stats`

**URL Parameters:**
- `id` (required): Category ID

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Category statistics retrieved successfully",
  "data": {
    "statistics": {
      "categoryId": "306dca8a-1b10-4b42-a649-499dabb44ee7",
      "categoryName": "Freelance Work",
      "budget": 5000,
      "totalExpenses": 0,
      "expenseCount": 0,
      "averageExpense": 0,
      "budgetUsedPercentage": 0,
      "remainingBudget": 5000,
      "message": "Statistics will be calculated once expenses are tracked"
    }
  }
}
```

**Note:** Full statistics will be available once the Expenses feature is implemented.

---

### 8. Get Category Overview

Get an overview of all user's categories.

**Endpoint:** `GET /api/categories/overview`

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Category overview retrieved successfully",
  "data": {
    "totalCategories": 13,
    "systemCategories": 12,
    "userCategories": 1,
    "categoriesWithBudget": 1,
    "categories": [
      // Array of all categories
    ]
  }
}
```

---

## Category Types

### System Categories
- Created automatically for all users
- Cannot be modified or deleted
- `userId` is `null`
- `type` is `"system"`

### User Categories
- Created by users
- Can be modified and deleted by the owner
- `userId` contains the owner's user ID
- `type` is `"user"`

---

## Category Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `_id` | String | Auto | Unique category identifier (UUID) |
| `userId` | String/null | Auto | User ID for user categories, null for system |
| `name` | String | Yes | Category name (2-50 chars) |
| `description` | String | No | Category description (max 200 chars) |
| `color` | String | No | Hex color code (default: #808080) |
| `icon` | String | No | Icon name (default: "category") |
| `type` | String | Auto | "system" or "user" |
| `budget` | Number/null | No | Monthly budget (0-999,999,999.99) |
| `parentCategoryId` | String/null | No | Parent category for subcategories |
| `isActive` | Boolean | Auto | Active status (default: true) |
| `createdAt` | String | Auto | ISO 8601 timestamp |
| `updatedAt` | String | Auto | ISO 8601 timestamp |

---

## Validation Rules

### Name
- Required
- Minimum length: 2 characters
- Maximum length: 50 characters
- Must be unique per user (case-insensitive)

### Description
- Optional
- Maximum length: 200 characters

### Color
- Optional
- Must be valid hex color code format: `#RRGGBB`
- Example: `#FF5733`

### Icon
- Optional
- Maximum length: 50 characters

### Budget
- Optional
- Must be a positive number
- Minimum: 0
- Maximum: 999,999,999.99

---

## Error Codes

| Status Code | Message | Description |
|-------------|---------|-------------|
| 200 | OK | Request successful |
| 201 | Created | Category created successfully |
| 400 | Bad Request | Invalid input or validation error |
| 401 | Unauthorized | Missing or invalid authentication token |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Category not found |
| 500 | Internal Server Error | Server error |

---

## Example Usage with cURL

### Create a Category
```bash
curl -X POST http://localhost:3000/api/categories \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Photography",
    "description": "Income from photography services",
    "color": "#E74C3C",
    "icon": "camera",
    "budget": 2000
  }'
```

### Get All Categories
```bash
curl -X GET http://localhost:3000/api/categories \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Update a Category
```bash
curl -X PUT http://localhost:3000/api/categories/CATEGORY_ID \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "budget": 3500,
    "description": "Updated description"
  }'
```

### Delete a Category
```bash
curl -X DELETE http://localhost:3000/api/categories/CATEGORY_ID \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Complete cURL Testing Guide

### Step 1: Login and Get Access Token

```bash
# Login to get access token
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'

# Save the accessToken from response for use in subsequent requests
# Example response will contain: "accessToken": "eyJhbGc..."
```

### Step 2: Set Token as Environment Variable

```bash
# Export token for easier use (replace with your actual token)
export TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### Step 3: Test All Category Endpoints

#### 3.1 Get All Categories (Should auto-initialize 12 system categories)

```bash
curl -X GET http://localhost:3000/api/categories \
  -H "Authorization: Bearer $TOKEN" \
  | jq .
```

**Expected Output:** 12 system categories

#### 3.2 Get Category Overview

```bash
curl -X GET http://localhost:3000/api/categories/overview \
  -H "Authorization: Bearer $TOKEN" \
  | jq .
```

#### 3.3 Create a User Category

```bash
curl -X POST http://localhost:3000/api/categories \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Photography",
    "description": "Income from photography services",
    "color": "#E74C3C",
    "icon": "camera",
    "budget": 2000
  }' | jq .
```

**Save the category `_id` from response for next steps**

#### 3.4 Get Specific Category by ID

```bash
# Replace CATEGORY_ID with the actual ID from previous step
curl -X GET http://localhost:3000/api/categories/CATEGORY_ID \
  -H "Authorization: Bearer $TOKEN" \
  | jq .
```

#### 3.5 Update a Category

```bash
curl -X PUT http://localhost:3000/api/categories/CATEGORY_ID \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "budget": 3500,
    "description": "Updated: Professional photography services"
  }' | jq .
```

#### 3.6 Get Category Statistics

```bash
curl -X GET http://localhost:3000/api/categories/CATEGORY_ID/stats \
  -H "Authorization: Bearer $TOKEN" \
  | jq .
```

#### 3.7 Get Category Expenses

```bash
curl -X GET "http://localhost:3000/api/categories/CATEGORY_ID/expenses?page=1&limit=20" \
  -H "Authorization: Bearer $TOKEN" \
  | jq .
```

#### 3.8 Delete a Category

```bash
curl -X DELETE http://localhost:3000/api/categories/CATEGORY_ID \
  -H "Authorization: Bearer $TOKEN" \
  | jq .
```

### Full Test Script

Create a file `test-categories.sh`:

```bash
#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== Categories API Test Script ===${NC}\n"

# Step 1: Login
echo -e "${GREEN}1. Logging in...${NC}"
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}')

TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.data.accessToken')
echo "Token obtained: ${TOKEN:0:20}..."

# Step 2: Get all categories
echo -e "\n${GREEN}2. Getting all categories...${NC}"
curl -s -X GET http://localhost:3000/api/categories \
  -H "Authorization: Bearer $TOKEN" \
  | jq '.data.count, .message'

# Step 3: Create a category
echo -e "\n${GREEN}3. Creating a new category...${NC}"
CREATE_RESPONSE=$(curl -s -X POST http://localhost:3000/api/categories \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Consulting",
    "description": "Consulting income",
    "color": "#3498DB",
    "icon": "business",
    "budget": 10000
  }')

CATEGORY_ID=$(echo $CREATE_RESPONSE | jq -r '.data.category._id')
echo "Created category ID: $CATEGORY_ID"
echo $CREATE_RESPONSE | jq '.data.category | {name, type, budget}'

# Step 4: Get specific category
echo -e "\n${GREEN}4. Getting category details...${NC}"
curl -s -X GET "http://localhost:3000/api/categories/$CATEGORY_ID" \
  -H "Authorization: Bearer $TOKEN" \
  | jq '.data.category | {name, description, budget, type}'

# Step 5: Update category
echo -e "\n${GREEN}5. Updating category budget...${NC}"
curl -s -X PUT "http://localhost:3000/api/categories/$CATEGORY_ID" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"budget": 15000}' \
  | jq '.data.category | {name, budget}'

# Step 6: Get overview
echo -e "\n${GREEN}6. Getting category overview...${NC}"
curl -s -X GET http://localhost:3000/api/categories/overview \
  -H "Authorization: Bearer $TOKEN" \
  | jq '.data | {totalCategories, systemCategories, userCategories, categoriesWithBudget}'

# Step 7: Get statistics
echo -e "\n${GREEN}7. Getting category statistics...${NC}"
curl -s -X GET "http://localhost:3000/api/categories/$CATEGORY_ID/stats" \
  -H "Authorization: Bearer $TOKEN" \
  | jq '.data.statistics | {categoryName, budget, totalExpenses, remainingBudget}'

# Step 8: Delete category
echo -e "\n${GREEN}8. Deleting category...${NC}"
curl -s -X DELETE "http://localhost:3000/api/categories/$CATEGORY_ID" \
  -H "Authorization: Bearer $TOKEN" \
  | jq '.message'

echo -e "\n${BLUE}=== All tests completed! ===${NC}"
```

Make it executable and run:

```bash
chmod +x test-categories.sh
./test-categories.sh
```

### Testing with Pretty Output (Using jq)

If you have `jq` installed, pipe responses through it for formatted JSON:

```bash
curl -X GET http://localhost:3000/api/categories \
  -H "Authorization: Bearer $TOKEN" \
  | jq .
```

### Testing Error Cases

#### Test 1: Create category without auth token
```bash
curl -X POST http://localhost:3000/api/categories \
  -H "Content-Type: application/json" \
  -d '{"name":"Test"}'
# Expected: 401 Unauthorized
```

#### Test 2: Create category with invalid data
```bash
curl -X POST http://localhost:3000/api/categories \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"A"}'
# Expected: 400 Bad Request (name too short)
```

#### Test 3: Try to modify system category
```bash
# Get a system category ID first
SYSTEM_CAT_ID=$(curl -s http://localhost:3000/api/categories \
  -H "Authorization: Bearer $TOKEN" \
  | jq -r '.data.categories[] | select(.type=="system") | ._id' | head -1)

# Try to update it
curl -X PUT "http://localhost:3000/api/categories/$SYSTEM_CAT_ID" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Modified"}'
# Expected: 403 Forbidden
```

#### Test 4: Try to delete system category
```bash
curl -X DELETE "http://localhost:3000/api/categories/$SYSTEM_CAT_ID" \
  -H "Authorization: Bearer $TOKEN"
# Expected: 403 Forbidden
```

#### Test 5: Create duplicate category name
```bash
curl -X POST http://localhost:3000/api/categories \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Photography"}'

# Run again with same name
curl -X POST http://localhost:3000/api/categories \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Photography"}'
# Expected: 400 Bad Request (duplicate name)
```

---

## Notes

1. **System Category Protection**: System categories are read-only and cannot be modified or deleted.

2. **Budget Tracking**: When a budget is set for a category, the system will track expenses against it (once the Expenses feature is implemented).

3. **Soft Delete**: Deleted categories are marked as inactive but remain in the database for historical expense tracking.

4. **Subcategories**: The `parentCategoryId` field allows for hierarchical category organization.

5. **Auto-initialization**: System categories are automatically created the first time any user accesses the categories endpoint.

---

## Testing the API

### Prerequisites
1. Start the server: `npm start`
2. Register a user or login to get an access token
3. Use the token in the Authorization header for all requests

### Test Sequence
1. **Login** to get access token
2. **GET /api/categories** - Should see 12 system categories
3. **POST /api/categories** - Create your custom category
4. **GET /api/categories/:id** - Verify your category
5. **PUT /api/categories/:id** - Update it
6. **GET /api/categories/overview** - See the overview
7. **DELETE /api/categories/:id** - Soft delete it

---

## Implementation Status

✅ **Completed**
- Category model and repository
- All CRUD operations
- Input validation
- System category initialization
- User category management
- Budget tracking structure
- Category statistics structure

⏳ **Pending** (Depends on Expenses feature)
- Actual expense counting in categories
- Real budget vs actual calculations
- Expense filtering by category
- Category-wise spending trends

---

## Next Steps

1. Implement **Tags Management** feature
2. Implement **Expenses Management** feature
3. Link expenses to categories
4. Calculate real statistics and budget tracking
5. Add category-based analytics
6. Implement subcategory support

---

**Last Updated:** 2025-12-30
**Feature Status:** ✅ Complete and Tested
**Branch:** `feature/categories`
