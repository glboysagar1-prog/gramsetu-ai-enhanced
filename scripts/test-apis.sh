#!/bin/bash

# Test script to verify both backends are working correctly

echo "🧪 Testing GramSetu AI APIs..."
echo "==============================="

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test Replit Backend (Auth API)
echo -e "\n${BLUE}Testing Replit Backend (Auth API)...${NC}"

# Test login
echo "  ↳ Testing login endpoint..."
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:5003/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "test123456"}')

if echo "$LOGIN_RESPONSE" | grep -q "token"; then
    echo -e "  ${GREEN}✓${NC} Login successful"
    TOKEN=$(echo "$LOGIN_RESPONSE" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
    echo "    Token: ${TOKEN:0:20}... (truncated)"
else
    echo -e "  ${RED}✗${NC} Login failed"
    echo "    Response: $LOGIN_RESPONSE"
fi

# Test Flask Backend (Complaint API)
echo -e "\n${BLUE}Testing Flask Backend (Complaint API)...${NC}"

# Test health check
echo "  ↳ Testing health check endpoint..."
HEALTH_RESPONSE=$(curl -s http://localhost:5001/healthz)

if echo "$HEALTH_RESPONSE" | grep -q "healthy"; then
    echo -e "  ${GREEN}✓${NC} Health check successful"
    echo "    Status: $(echo "$HEALTH_RESPONSE" | grep -o '"status":"[^"]*"' | cut -d'"' -f4)"
else
    echo -e "  ${RED}✗${NC} Health check failed"
    echo "    Response: $HEALTH_RESPONSE"
fi

echo -e "\n${GREEN}✅ API tests completed!${NC}"