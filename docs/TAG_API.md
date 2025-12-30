# Tag Management API Documentation

## Overview

The Tag Management API allows users to create, manage, and organize tags for their expenses. Tags help categorize and filter expenses for better organization and analysis.

## Base URL

```
http://localhost:3000/api
```

## Authentication

All tag endpoints require authentication. Include the JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

To get a token, first login:

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "yourpassword"
  }'
```

---

## Endpoints

### 1. Create Tag

Create a new tag for the authenticated user.

**Endpoint:** `POST /api/tags`

**Request Body:**

| Field | Type | Required | Description | Constraints |
|-------|------|----------|-------------|-------------|
| name | string | Yes | Tag name | 1-50 characters, must be unique per user |
| color | string | No | Hex color code | Format: #RRGGBB (default: #808080) |

**Example Request:**

```bash
curl -X POST http://localhost:3000/api/tags \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Work",
    "color": "#4A90E2"
  }'
```

**Success Response (201):**

```json
{
  "success": true,
  "message": "Tag created successfully",
  "data": {
    "tag": {
      "_id": "022ded88-5c56-4479-bc19-deb68e3bd8f2",
      "userId": "71b57f26-a550-4de6-b5aa-ddb61f9151ba",
      "name": "Work",
      "color": "#4A90E2",
      "createdAt": "2025-12-30T16:30:12.761Z",
      "updatedAt": "2025-12-30T16:30:12.761Z"
    }
  }
}
```

**Error Responses:**

```json
// 400 - Validation Error (Missing name)
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

// 400 - Invalid color format
{
  "success": false,
  "error": {
    "message": "Validation failed",
    "statusCode": 400,
    "errors": [
      {
        "field": "color",
        "message": "Color must be a valid hex color (e.g., #FF5733)",
        "value": "red"
      }
    ]
  }
}

// 400 - Duplicate tag name
{
  "success": false,
  "error": {
    "message": "A tag with this name already exists",
    "statusCode": 400
  }
}

// 400 - Maximum tags reached
{
  "success": false,
  "error": {
    "message": "Maximum number of tags reached",
    "statusCode": 400
  }
}
```

---

### 2. List All Tags

Get all tags for the authenticated user.

**Endpoint:** `GET /api/tags`

**Example Request:**

```bash
curl -X GET http://localhost:3000/api/tags \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Tags list fetched successfully",
  "data": {
    "tags": [
      {
        "_id": "022ded88-5c56-4479-bc19-deb68e3bd8f2",
        "userId": "71b57f26-a550-4de6-b5aa-ddb61f9151ba",
        "name": "Work",
        "color": "#4A90E2",
        "createdAt": "2025-12-30T16:30:12.761Z",
        "updatedAt": "2025-12-30T16:30:12.761Z"
      },
      {
        "_id": "2769f7cd-9b49-40a6-ba75-8e5a82bf2908",
        "userId": "71b57f26-a550-4de6-b5aa-ddb61f9151ba",
        "name": "Personal",
        "color": "#E74C3C",
        "createdAt": "2025-12-30T16:30:56.445Z",
        "updatedAt": "2025-12-30T16:30:56.445Z"
      }
    ],
    "count": 2
  }
}
```

---

### 3. Get Tag by ID

Get a specific tag by its ID.

**Endpoint:** `GET /api/tags/:id`

**URL Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | UUID | Yes | Tag ID |

**Example Request:**

```bash
curl -X GET http://localhost:3000/api/tags/022ded88-5c56-4479-bc19-deb68e3bd8f2 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Tag fetched successfully",
  "data": {
    "tag": {
      "_id": "022ded88-5c56-4479-bc19-deb68e3bd8f2",
      "userId": "71b57f26-a550-4de6-b5aa-ddb61f9151ba",
      "name": "Work",
      "color": "#4A90E2",
      "createdAt": "2025-12-30T16:30:12.761Z",
      "updatedAt": "2025-12-30T16:30:12.761Z"
    }
  }
}
```

**Error Responses:**

```json
// 404 - Tag not found
{
  "success": false,
  "error": {
    "message": "Tag not found",
    "statusCode": 404
  }
}

// 400 - Invalid tag ID format
{
  "success": false,
  "error": {
    "message": "Validation failed",
    "statusCode": 400,
    "errors": [
      {
        "field": "id",
        "message": "Invalid tag ID format"
      }
    ]
  }
}
```

---

### 4. Update Tag

Update an existing tag.

**Endpoint:** `PUT /api/tags/:id`

**URL Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | UUID | Yes | Tag ID |

**Request Body:**

| Field | Type | Required | Description | Constraints |
|-------|------|----------|-------------|-------------|
| name | string | No | New tag name | 1-50 characters, must be unique per user |
| color | string | No | New hex color code | Format: #RRGGBB |

**Example Request:**

```bash
curl -X PUT http://localhost:3000/api/tags/022ded88-5c56-4479-bc19-deb68e3bd8f2 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Work Projects",
    "color": "#2ECC71"
  }'
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Tag updated successfully",
  "data": {
    "tag": {
      "_id": "022ded88-5c56-4479-bc19-deb68e3bd8f2",
      "userId": "71b57f26-a550-4de6-b5aa-ddb61f9151ba",
      "name": "Work Projects",
      "color": "#2ECC71",
      "createdAt": "2025-12-30T16:30:12.761Z",
      "updatedAt": "2025-12-30T16:30:50.092Z"
    }
  }
}
```

**Error Responses:**

```json
// 404 - Tag not found
{
  "success": false,
  "error": {
    "message": "Tag not found",
    "statusCode": 404
  }
}

// 400 - Duplicate tag name
{
  "success": false,
  "error": {
    "message": "A tag with this name already exists",
    "statusCode": 400
  }
}
```

---

### 5. Delete Tag

Delete a tag.

**Endpoint:** `DELETE /api/tags/:id`

**URL Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | UUID | Yes | Tag ID |

**Example Request:**

```bash
curl -X DELETE http://localhost:3000/api/tags/460f85fc-e82d-4ee9-8517-b1ad5b269303 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Tag deleted successfully",
  "data": {
    "tag": {
      "_id": "460f85fc-e82d-4ee9-8517-b1ad5b269303",
      "userId": "71b57f26-a550-4de6-b5aa-ddb61f9151ba",
      "name": "To Delete",
      "color": "#95A5A6",
      "createdAt": "2025-12-30T16:31:44.971Z",
      "updatedAt": "2025-12-30T16:31:44.971Z"
    }
  }
}
```

**Error Responses:**

```json
// 404 - Tag not found
{
  "success": false,
  "error": {
    "message": "Tag not found",
    "statusCode": 404
  }
}
```

---

### 6. Get Expenses by Tag

Get all expenses associated with a specific tag.

**Endpoint:** `GET /api/tags/:id/expenses`

**URL Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | UUID | Yes | Tag ID |

**Example Request:**

```bash
curl -X GET http://localhost:3000/api/tags/022ded88-5c56-4479-bc19-deb68e3bd8f2/expenses \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Success Response (200):**

```json
{
  "success": true,
  "data": {
    "expenses": [],
    "count": 0
  }
}
```

**Note:** This endpoint currently returns an empty array. It will be fully implemented when the Expense Management feature is added.

**Error Responses:**

```json
// 404 - Tag not found
{
  "success": false,
  "error": {
    "message": "Tag not found",
    "statusCode": 404
  }
}
```

---

### 7. Merge Tags

Merge a source tag into a target tag. All expenses with the source tag will be updated to use the target tag, and the source tag will be deleted.

**Endpoint:** `PATCH /api/tags/:id/merge`

**URL Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | UUID | Yes | Source tag ID (will be deleted) |

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| targetTagId | UUID | Yes | Target tag ID (will remain) |

**Example Request:**

```bash
curl -X PATCH http://localhost:3000/api/tags/2769f7cd-9b49-40a6-ba75-8e5a82bf2908/merge \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "targetTagId": "022ded88-5c56-4479-bc19-deb68e3bd8f2"
  }'
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Tags merged successfully",
  "data": {
    "mergedFrom": {
      "_id": "2769f7cd-9b49-40a6-ba75-8e5a82bf2908",
      "userId": "71b57f26-a550-4de6-b5aa-ddb61f9151ba",
      "name": "Personal",
      "color": "#E74C3C",
      "createdAt": "2025-12-30T16:30:56.445Z",
      "updatedAt": "2025-12-30T16:30:56.445Z"
    },
    "mergedInto": {
      "_id": "022ded88-5c56-4479-bc19-deb68e3bd8f2",
      "userId": "71b57f26-a550-4de6-b5aa-ddb61f9151ba",
      "name": "Work Projects",
      "color": "#2ECC71",
      "createdAt": "2025-12-30T16:30:12.761Z",
      "updatedAt": "2025-12-30T16:30:50.092Z"
    }
  }
}
```

**Error Responses:**

```json
// 404 - Source tag not found
{
  "success": false,
  "error": {
    "message": "Tag not found",
    "statusCode": 404
  }
}

// 404 - Target tag not found
{
  "success": false,
  "error": {
    "message": "Target tag for merge not found",
    "statusCode": 404
  }
}

// 400 - Attempting to merge tag with itself
{
  "success": false,
  "error": {
    "message": "Cannot merge a tag with itself",
    "statusCode": 400
  }
}

// 400 - Missing targetTagId
{
  "success": false,
  "error": {
    "message": "Validation failed",
    "statusCode": 400,
    "errors": [
      {
        "field": "targetTagId",
        "message": "Target tag ID is required for merge operation"
      }
    ]
  }
}
```

---

## Common Error Responses

### 401 - Unauthorized (No token or invalid token)

```json
{
  "success": false,
  "error": {
    "message": "No token provided",
    "statusCode": 401
  }
}
```

### 401 - Token Expired

```json
{
  "success": false,
  "error": {
    "message": "Token expired",
    "statusCode": 401
  }
}
```

---

## Tag Constraints

- **Maximum tags per user:** 100
- **Tag name length:** 1-50 characters
- **Tag name uniqueness:** Must be unique per user (case-sensitive)
- **Color format:** Hex color code (#RRGGBB)
- **Default color:** #808080 (gray)

---

## Complete Testing Script

Here's a complete script to test all tag endpoints:

```bash
#!/bin/bash

# Base URL
BASE_URL="http://localhost:3000/api"

# Login and get token
echo "=== Login ==="
LOGIN_RESPONSE=$(curl -s -X POST $BASE_URL/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }')

TOKEN=$(echo $LOGIN_RESPONSE | python3 -c "import sys, json; print(json.load(sys.stdin)['data']['accessToken'])")

echo "Token: $TOKEN"
echo ""

# 1. Create first tag
echo "=== 1. Create first tag ==="
curl -s -X POST $BASE_URL/tags \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Work",
    "color": "#4A90E2"
  }' | python3 -m json.tool
echo ""

# 2. Create second tag
echo "=== 2. Create second tag ==="
curl -s -X POST $BASE_URL/tags \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Personal",
    "color": "#E74C3C"
  }' | python3 -m json.tool
echo ""

# 3. List all tags
echo "=== 3. List all tags ==="
TAGS_RESPONSE=$(curl -s -X GET $BASE_URL/tags \
  -H "Authorization: Bearer $TOKEN")
echo $TAGS_RESPONSE | python3 -m json.tool
echo ""

# Get first tag ID
TAG_ID=$(echo $TAGS_RESPONSE | python3 -c "import sys, json; print(json.load(sys.stdin)['data']['tags'][0]['_id'])")

# 4. Get tag by ID
echo "=== 4. Get tag by ID ==="
curl -s -X GET $BASE_URL/tags/$TAG_ID \
  -H "Authorization: Bearer $TOKEN" | python3 -m json.tool
echo ""

# 5. Update tag
echo "=== 5. Update tag ==="
curl -s -X PUT $BASE_URL/tags/$TAG_ID \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Work Projects",
    "color": "#2ECC71"
  }' | python3 -m json.tool
echo ""

# 6. Get expenses by tag
echo "=== 6. Get expenses by tag ==="
curl -s -X GET $BASE_URL/tags/$TAG_ID/expenses \
  -H "Authorization: Bearer $TOKEN" | python3 -m json.tool
echo ""

# 7. Create third tag for merging
echo "=== 7. Create third tag for merging ==="
MERGE_TAG=$(curl -s -X POST $BASE_URL/tags \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Temporary",
    "color": "#95A5A6"
  }')
echo $MERGE_TAG | python3 -m json.tool
echo ""

MERGE_TAG_ID=$(echo $MERGE_TAG | python3 -c "import sys, json; print(json.load(sys.stdin)['data']['tag']['_id'])")

# 8. Merge tags
echo "=== 8. Merge tags ==="
curl -s -X PATCH $BASE_URL/tags/$MERGE_TAG_ID/merge \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"targetTagId\": \"$TAG_ID\"
  }" | python3 -m json.tool
echo ""

# 9. Create tag to delete
echo "=== 9. Create tag to delete ==="
DELETE_TAG=$(curl -s -X POST $BASE_URL/tags \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "To Delete",
    "color": "#FF0000"
  }')
echo $DELETE_TAG | python3 -m json.tool
echo ""

DELETE_TAG_ID=$(echo $DELETE_TAG | python3 -c "import sys, json; print(json.load(sys.stdin)['data']['tag']['_id'])")

# 10. Delete tag
echo "=== 10. Delete tag ==="
curl -s -X DELETE $BASE_URL/tags/$DELETE_TAG_ID \
  -H "Authorization: Bearer $TOKEN" | python3 -m json.tool
echo ""

# 11. Final list of tags
echo "=== 11. Final list of tags ==="
curl -s -X GET $BASE_URL/tags \
  -H "Authorization: Bearer $TOKEN" | python3 -m json.tool
echo ""

echo "=== Testing Complete ==="
```

Save this script as `test_tags.sh`, make it executable with `chmod +x test_tags.sh`, and run it with `./test_tags.sh`.

---

## Notes

- All timestamps are in ISO 8601 format (UTC)
- Tag IDs are UUIDs (version 4)
- User IDs are automatically extracted from the JWT token
- Tags are scoped to individual users (users cannot see or modify other users' tags)
- The merge operation is irreversible
- When the Expense Management feature is implemented, the `GET /api/tags/:id/expenses` endpoint will return actual expense data
