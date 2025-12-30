#!/bin/bash

# Tag API Testing Script
# This script tests all tag management endpoints

# Base URL
BASE_URL="http://localhost:3000/api"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Login and get token
echo -e "${BLUE}=== Login ===${NC}"
LOGIN_RESPONSE=$(curl -s -X POST $BASE_URL/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }')

TOKEN=$(echo $LOGIN_RESPONSE | python3 -c "import sys, json; print(json.load(sys.stdin)['data']['accessToken'])" 2>/dev/null)

if [ -z "$TOKEN" ]; then
  echo -e "${RED}Failed to get token. Please ensure the server is running and credentials are correct.${NC}"
  exit 1
fi

echo -e "${GREEN}✓ Token obtained${NC}"
echo ""

# 1. Create first tag
echo -e "${BLUE}=== 1. Create first tag (Work) ===${NC}"
curl -s -X POST $BASE_URL/tags \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Work",
    "color": "#4A90E2"
  }' | python3 -m json.tool
echo ""

# 2. Create second tag
echo -e "${BLUE}=== 2. Create second tag (Personal) ===${NC}"
curl -s -X POST $BASE_URL/tags \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Personal",
    "color": "#E74C3C"
  }' | python3 -m json.tool
echo ""

# 3. List all tags
echo -e "${BLUE}=== 3. List all tags ===${NC}"
TAGS_RESPONSE=$(curl -s -X GET $BASE_URL/tags \
  -H "Authorization: Bearer $TOKEN")
echo $TAGS_RESPONSE | python3 -m json.tool
echo ""

# Get first tag ID
TAG_ID=$(echo $TAGS_RESPONSE | python3 -c "import sys, json; print(json.load(sys.stdin)['data']['tags'][0]['_id'])" 2>/dev/null)

if [ -z "$TAG_ID" ]; then
  echo -e "${RED}Failed to get tag ID${NC}"
  exit 1
fi

# 4. Get tag by ID
echo -e "${BLUE}=== 4. Get tag by ID ===${NC}"
curl -s -X GET $BASE_URL/tags/$TAG_ID \
  -H "Authorization: Bearer $TOKEN" | python3 -m json.tool
echo ""

# 5. Update tag
echo -e "${BLUE}=== 5. Update tag (rename and change color) ===${NC}"
curl -s -X PUT $BASE_URL/tags/$TAG_ID \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Work Projects",
    "color": "#2ECC71"
  }' | python3 -m json.tool
echo ""

# 6. Get expenses by tag
echo -e "${BLUE}=== 6. Get expenses by tag ===${NC}"
curl -s -X GET $BASE_URL/tags/$TAG_ID/expenses \
  -H "Authorization: Bearer $TOKEN" | python3 -m json.tool
echo ""

# 7. Create third tag for merging
echo -e "${BLUE}=== 7. Create third tag for merging (Temporary) ===${NC}"
MERGE_TAG=$(curl -s -X POST $BASE_URL/tags \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Temporary",
    "color": "#95A5A6"
  }')
echo $MERGE_TAG | python3 -m json.tool
echo ""

MERGE_TAG_ID=$(echo $MERGE_TAG | python3 -c "import sys, json; print(json.load(sys.stdin)['data']['tag']['_id'])" 2>/dev/null)

# 8. Merge tags
echo -e "${BLUE}=== 8. Merge tags (Temporary -> Work Projects) ===${NC}"
curl -s -X PATCH $BASE_URL/tags/$MERGE_TAG_ID/merge \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"targetTagId\": \"$TAG_ID\"
  }" | python3 -m json.tool
echo ""

# 9. Create tag to delete
echo -e "${BLUE}=== 9. Create tag to delete ===${NC}"
DELETE_TAG=$(curl -s -X POST $BASE_URL/tags \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "To Delete",
    "color": "#FF0000"
  }')
echo $DELETE_TAG | python3 -m json.tool
echo ""

DELETE_TAG_ID=$(echo $DELETE_TAG | python3 -c "import sys, json; print(json.load(sys.stdin)['data']['tag']['_id'])" 2>/dev/null)

# 10. Delete tag
echo -e "${BLUE}=== 10. Delete tag ===${NC}"
curl -s -X DELETE $BASE_URL/tags/$DELETE_TAG_ID \
  -H "Authorization: Bearer $TOKEN" | python3 -m json.tool
echo ""

# 11. Final list of tags
echo -e "${BLUE}=== 11. Final list of tags ===${NC}"
curl -s -X GET $BASE_URL/tags \
  -H "Authorization: Bearer $TOKEN" | python3 -m json.tool
echo ""

# Test validation errors
echo -e "${BLUE}=== 12. Test validation - Create tag without name ===${NC}"
curl -s -X POST $BASE_URL/tags \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "color": "#FF0000"
  }' | python3 -m json.tool
echo ""

echo -e "${BLUE}=== 13. Test validation - Invalid color format ===${NC}"
curl -s -X POST $BASE_URL/tags \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Tag",
    "color": "red"
  }' | python3 -m json.tool
echo ""

echo -e "${BLUE}=== 14. Test validation - Duplicate tag name ===${NC}"
curl -s -X POST $BASE_URL/tags \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Personal",
    "color": "#FF0000"
  }' | python3 -m json.tool
echo ""

echo -e "${GREEN}=== Testing Complete ===${NC}"
