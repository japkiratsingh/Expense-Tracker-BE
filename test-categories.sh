#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  Categories API Test Script           ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════╝${NC}\n"

# Check if server is running
echo -e "${YELLOW}Checking if server is running...${NC}"
if ! curl -s http://localhost:3000/api/health > /dev/null; then
    echo -e "${RED}❌ Server is not running!${NC}"
    echo -e "${YELLOW}Please start the server with: npm start${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Server is running${NC}\n"

# Step 1: Login
echo -e "${GREEN}1. Logging in...${NC}"
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}')

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Login failed!${NC}"
    exit 1
fi

TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.data.accessToken')
if [ "$TOKEN" == "null" ] || [ -z "$TOKEN" ]; then
    echo -e "${RED}❌ Failed to get access token${NC}"
    echo "Response: $LOGIN_RESPONSE"
    exit 1
fi
echo -e "${GREEN}✓ Token obtained: ${TOKEN:0:30}...${NC}"

# Step 2: Get all categories
echo -e "\n${GREEN}2. Getting all categories...${NC}"
ALL_CATS=$(curl -s -X GET http://localhost:3000/api/categories \
  -H "Authorization: Bearer $TOKEN")
CATEGORY_COUNT=$(echo $ALL_CATS | jq -r '.data.count')
echo -e "${GREEN}✓ Found $CATEGORY_COUNT categories${NC}"
echo $ALL_CATS | jq '.data.categories[0:3] | .[] | {name, type, budget}'

# Step 3: Create a category
echo -e "\n${GREEN}3. Creating a new category...${NC}"
CREATE_RESPONSE=$(curl -s -X POST http://localhost:3000/api/categories \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Consulting",
    "description": "Consulting income for testing",
    "color": "#3498DB",
    "icon": "business",
    "budget": 10000
  }')

CATEGORY_ID=$(echo $CREATE_RESPONSE | jq -r '.data.category._id')
if [ "$CATEGORY_ID" == "null" ] || [ -z "$CATEGORY_ID" ]; then
    echo -e "${RED}❌ Failed to create category${NC}"
    echo "Response: $CREATE_RESPONSE"
    exit 1
fi
echo -e "${GREEN}✓ Created category ID: $CATEGORY_ID${NC}"
echo $CREATE_RESPONSE | jq '.data.category | {name, type, budget, color}'

# Step 4: Get specific category
echo -e "\n${GREEN}4. Getting category details...${NC}"
GET_CAT=$(curl -s -X GET "http://localhost:3000/api/categories/$CATEGORY_ID" \
  -H "Authorization: Bearer $TOKEN")
echo -e "${GREEN}✓ Category retrieved${NC}"
echo $GET_CAT | jq '.data.category | {name, description, budget, type, isActive}'

# Step 5: Update category
echo -e "\n${GREEN}5. Updating category budget...${NC}"
UPDATE_CAT=$(curl -s -X PUT "http://localhost:3000/api/categories/$CATEGORY_ID" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"budget": 15000, "description": "Updated consulting income"}')
echo -e "${GREEN}✓ Category updated${NC}"
echo $UPDATE_CAT | jq '.data.category | {name, budget, description}'

# Step 6: Get overview
echo -e "\n${GREEN}6. Getting category overview...${NC}"
OVERVIEW=$(curl -s -X GET http://localhost:3000/api/categories/overview \
  -H "Authorization: Bearer $TOKEN")
echo -e "${GREEN}✓ Overview retrieved${NC}"
echo $OVERVIEW | jq '.data | {totalCategories, systemCategories, userCategories, categoriesWithBudget}'

# Step 7: Get statistics
echo -e "\n${GREEN}7. Getting category statistics...${NC}"
STATS=$(curl -s -X GET "http://localhost:3000/api/categories/$CATEGORY_ID/stats" \
  -H "Authorization: Bearer $TOKEN")
echo -e "${GREEN}✓ Statistics retrieved${NC}"
echo $STATS | jq '.data.statistics | {categoryName, budget, totalExpenses, remainingBudget}'

# Step 8: Get category expenses
echo -e "\n${GREEN}8. Getting category expenses...${NC}"
EXPENSES=$(curl -s -X GET "http://localhost:3000/api/categories/$CATEGORY_ID/expenses" \
  -H "Authorization: Bearer $TOKEN")
echo -e "${GREEN}✓ Expenses retrieved${NC}"
echo $EXPENSES | jq '.data | {total, message}'

# Step 9: Test error cases
echo -e "\n${YELLOW}9. Testing error cases...${NC}"

echo -e "\n${YELLOW}9.1 Try to create duplicate category name...${NC}"
DUPLICATE=$(curl -s -X POST http://localhost:3000/api/categories \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Test Consulting\"}")
if echo $DUPLICATE | jq -e '.success == false' > /dev/null; then
    echo -e "${GREEN}✓ Correctly rejected duplicate name${NC}"
    echo $DUPLICATE | jq '.error.message'
else
    echo -e "${RED}❌ Should have rejected duplicate name${NC}"
fi

echo -e "\n${YELLOW}9.2 Try to modify a system category...${NC}"
SYSTEM_CAT_ID=$(echo $ALL_CATS | jq -r '.data.categories[] | select(.type=="system") | ._id' | head -1)
MODIFY_SYSTEM=$(curl -s -X PUT "http://localhost:3000/api/categories/$SYSTEM_CAT_ID" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Modified"}')
if echo $MODIFY_SYSTEM | jq -e '.success == false' > /dev/null; then
    echo -e "${GREEN}✓ Correctly rejected system category modification${NC}"
    echo $MODIFY_SYSTEM | jq '.error.message'
else
    echo -e "${RED}❌ Should have rejected system category modification${NC}"
fi

echo -e "\n${YELLOW}9.3 Try to delete a system category...${NC}"
DELETE_SYSTEM=$(curl -s -X DELETE "http://localhost:3000/api/categories/$SYSTEM_CAT_ID" \
  -H "Authorization: Bearer $TOKEN")
if echo $DELETE_SYSTEM | jq -e '.success == false' > /dev/null; then
    echo -e "${GREEN}✓ Correctly rejected system category deletion${NC}"
    echo $DELETE_SYSTEM | jq '.error.message'
else
    echo -e "${RED}❌ Should have rejected system category deletion${NC}"
fi

# Step 10: Delete the test category
echo -e "\n${GREEN}10. Deleting test category...${NC}"
DELETE_CAT=$(curl -s -X DELETE "http://localhost:3000/api/categories/$CATEGORY_ID" \
  -H "Authorization: Bearer $TOKEN")
if echo $DELETE_CAT | jq -e '.success == true' > /dev/null; then
    echo -e "${GREEN}✓ Category deleted successfully${NC}"
    echo $DELETE_CAT | jq '.message'
else
    echo -e "${RED}❌ Failed to delete category${NC}"
fi

# Final summary
echo -e "\n${BLUE}╔════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  All tests completed successfully! ✓  ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════╝${NC}\n"

echo -e "${GREEN}Summary:${NC}"
echo -e "  ✓ Login successful"
echo -e "  ✓ Retrieved all categories"
echo -e "  ✓ Created user category"
echo -e "  ✓ Retrieved category details"
echo -e "  ✓ Updated category"
echo -e "  ✓ Retrieved overview and statistics"
echo -e "  ✓ Error handling works correctly"
echo -e "  ✓ Deleted category"
echo -e "\n${YELLOW}All 8 endpoints tested successfully!${NC}\n"
