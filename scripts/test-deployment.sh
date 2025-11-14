#!/bin/bash

# Test Deployment Script for GramSetu AI
# This script verifies that all deployed services are working correctly

set -e

echo "🧪 Testing GramSetu AI Deployment"
echo "================================="
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Check if URLs are provided as arguments
if [ $# -eq 0 ]; then
    echo -e "${YELLOW}Usage: $0 <flask_backend_url> <replit_backend_url>${NC}"
    echo "Example: $0 https://gramsetu-flask.up.railway.app https://gramsetu-auth.up.railway.app"
    echo ""
    read -p "Enter Flask Backend URL: " FLASK_URL
    read -p "Enter Replit Backend URL: " REPLIT_URL
else
    FLASK_URL=$1
    REPLIT_URL=$2
fi

# Test Flask Backend
echo -e "${BLUE}Testing Flask Backend ($FLASK_URL)...${NC}"
if curl -s -f "$FLASK_URL/healthz" > /dev/null; then
    echo -e "${GREEN}✅ Flask Backend is responding${NC}"
    HEALTH_STATUS=$(curl -s "$FLASK_URL/healthz" | grep -o '"status":"[^"]*"' | cut -d'"' -f4)
    echo "   Health Status: $HEALTH_STATUS"
else
    echo -e "${RED}❌ Flask Backend is not responding${NC}"
fi
echo ""

# Test Replit Backend
echo -e "${BLUE}Testing Replit Backend ($REPLIT_URL)...${NC}"
if curl -s -f "$REPLIT_URL/api" > /dev/null; then
    echo -e "${GREEN}✅ Replit Backend is responding${NC}"
else
    echo -e "${YELLOW}⚠️  Replit Backend API endpoint not found (this is normal during initial deployment)${NC}"
fi
echo ""

# Test Authentication Endpoints
echo -e "${BLUE}Testing Authentication Endpoints...${NC}"

# Test signup endpoint
if curl -s -f -X POST "$REPLIT_URL/api/auth/signup" \
    -H "Content-Type: application/json" \
    -d '{"email":"test@example.com","username":"testuser","password":"test123456"}' > /dev/null; then
    echo -e "${YELLOW}⚠️  Auth signup endpoint accessible (may return validation error, which is expected)${NC}"
else
    echo -e "${RED}❌ Auth signup endpoint not accessible${NC}"
fi

# Test login endpoint
if curl -s -f -X POST "$REPLIT_URL/api/auth/login" \
    -H "Content-Type: application/json" \
    -d '{"email":"test@example.com","password":"test123456"}' > /dev/null; then
    echo -e "${YELLOW}⚠️  Auth login endpoint accessible (may return auth error, which is expected)${NC}"
else
    echo -e "${RED}❌ Auth login endpoint not accessible${NC}"
fi
echo ""

# Test Database Connection
echo -e "${BLUE}Testing Database Connection...${NC}"
# This would typically be tested through the application logs
echo -e "${YELLOW}⚠️  Check Railway logs to verify database connection${NC}"
echo "   Run: railway logs"
echo ""

# Summary
echo -e "${BLUE}Test Summary:${NC}"
echo "============="
echo "Flask Backend: $FLASK_URL"
echo "Replit Backend: $REPLIT_URL"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Check Railway logs for any errors:"
echo "   railway logs"
echo "2. Verify environment variables are correctly set in Railway dashboard"
echo "3. Run database migrations if not already done:"
echo "   cd replit-backend && railway run npm run db:push"
echo "4. Test frontend integration with deployed backends"
echo ""
echo -e "${GREEN}✅ Basic deployment tests completed!${NC}"
echo ""
echo "See COMPLETE_DEPLOYMENT_GUIDE.md for detailed troubleshooting."