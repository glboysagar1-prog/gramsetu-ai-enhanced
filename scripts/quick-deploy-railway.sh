#!/bin/bash

# Quick Railway Deployment Script for GramSetu AI
# This script helps deploy both backends to Railway

set -e

echo "🚀 GramSetu AI - Quick Railway Deployment"
echo "========================================="
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Check if running in project root
if [ ! -f "app.py" ] || [ ! -d "replit-backend" ]; then
    echo -e "${RED}Error: Please run this script from the project root directory${NC}"
    exit 1
fi

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo -e "${RED}Error: Railway CLI not installed${NC}"
    echo "Install with: npm install -g @railway/cli"
    exit 1
fi

echo -e "${BLUE}Starting Railway deployment process...${NC}"
echo ""

# Login to Railway
echo -e "${YELLOW}Step 1: Logging in to Railway${NC}"
echo "Please complete the login process in your browser"
railway login
echo -e "${GREEN}✅ Logged in to Railway${NC}"
echo ""

# Deploy Flask Backend
echo -e "${YELLOW}Step 2: Deploying Flask Backend${NC}"
echo "This may take a few minutes..."
railway init
PROJECT_NAME_FLASK="gramsetu-flask-api-$(date +%s)"
echo "Project name: $PROJECT_NAME_FLASK"
railway up
FLASK_URL=$(railway url)
echo -e "${GREEN}✅ Flask Backend deployed at: $FLASK_URL${NC}"
echo ""

# Deploy Replit Backend
echo -e "${YELLOW}Step 3: Deploying Replit Backend${NC}"
cd replit-backend
railway init
PROJECT_NAME_REPLIT="gramsetu-auth-api-$(date +%s)"
echo "Project name: $PROJECT_NAME_REPLIT"
railway up
REPLIT_URL=$(railway url)
echo -e "${GREEN}✅ Replit Backend deployed at: $REPLIT_URL${NC}"
echo ""

# Return to project root
cd ..

echo -e "${BLUE}Deployment Summary:${NC}"
echo "==================="
echo "Flask Backend (Complaints & AI): $FLASK_URL"
echo "Replit Backend (Auth & Files): $REPLIT_URL"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Add environment variables in Railway dashboard"
echo "2. Add PostgreSQL and Redis addons"
echo "3. Run database migrations for Replit backend:"
echo "   cd replit-backend && railway run npm run db:push"
echo "4. Deploy frontend to Vercel:"
echo "   vercel --prod"
echo ""
echo -e "${GREEN}✅ Deployment process completed!${NC}"
echo ""
echo "See YOUR_DEPLOYMENT_GUIDE.md for detailed instructions"
