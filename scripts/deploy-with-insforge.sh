#!/bin/bash

# Deploy GramSetu AI with InsForge MCP Integration
# This script automates the deployment process with proper configuration

set -e

echo "🚀 GramSetu AI - Deployment with InsForge MCP"
echo "============================================"
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

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo -e "${YELLOW}Warning: Vercel CLI not installed${NC}"
    echo "To deploy frontend to Vercel, install with: npm install -g vercel"
    echo ""
fi

echo -e "${BLUE}Starting deployment process with InsForge MCP...${NC}"
echo ""

# Login to Railway (interactive)
echo -e "${YELLOW}Step 1: Logging in to Railway${NC}"
echo "Please complete the login process in your browser"
railway login
echo -e "${GREEN}✅ Logged in to Railway${NC}"
echo ""

# Deploy Flask Backend
echo -e "${YELLOW}Step 2: Deploying Flask Backend (Complaints & AI)${NC}"
echo "This may take a few minutes..."

# Initialize Flask project
railway init
PROJECT_NAME_FLASK="gramsetu-flask-api-$(date +%s)"
echo "Project name: $PROJECT_NAME_FLASK"

# Deploy Flask backend
railway up
FLASK_URL=$(railway url)
echo -e "${GREEN}✅ Flask Backend deployed at: $FLASK_URL${NC}"
echo ""

# Deploy Replit Backend
echo -e "${YELLOW}Step 3: Deploying Replit Backend (Auth & Files)${NC}"
cd replit-backend

# Initialize Replit project
railway init
PROJECT_NAME_REPLIT="gramsetu-auth-api-$(date +%s)"
echo "Project name: $PROJECT_NAME_REPLIT"

# Deploy Replit backend
railway up
REPLIT_URL=$(railway url)
echo -e "${GREEN}✅ Replit Backend deployed at: $REPLIT_URL${NC}"
echo ""

# Return to project root
cd ..

# Display next steps
echo -e "${BLUE}Deployment Summary:${NC}"
echo "==================="
echo "Flask Backend (Complaints & AI): $FLASK_URL"
echo "Replit Backend (Auth & Files): $REPLIT_URL"
echo ""
echo -e "${YELLOW}Next Configuration Steps:${NC}"
echo "1. Add environment variables in Railway dashboard:"
echo "   - INSFORGE_PROJECT_ID"
echo "   - INSFORGE_API_KEY"
echo "   - INSFORGE_JWT_SECRET"
echo "   - DATABASE_URL (PostgreSQL addon)"
echo "   - GOOGLE_CLIENT_ID (for Google OAuth)"
echo "   - GOOGLE_CLIENT_SECRET (for Google OAuth)"
echo ""
echo "2. Add PostgreSQL addons to both projects in Railway dashboard"
echo ""
echo "3. Run database migrations for Replit backend:"
echo "   cd replit-backend && railway run npm run db:push && cd .."
echo ""
echo "4. Add Redis addon to Flask backend (optional but recommended)"
echo ""
echo "5. Deploy frontend to Vercel:"
echo "   vercel --prod"
echo ""
echo -e "${GREEN}✅ Backend deployment process completed!${NC}"
echo ""
echo "See COMPLETE_DEPLOYMENT_GUIDE.md for detailed instructions"
echo "and troubleshooting information."
echo ""
echo "For complete deployment with frontend, see DEPLOYMENT_INSTRUCTIONS.md"

# Offer to open documentation
echo ""
read -p "Would you like to view the complete deployment guide? (y/n): " view_docs
if [[ $view_docs == "y" || $view_docs == "Y" ]]; then
    if command -v open &> /dev/null; then
        open COMPLETE_DEPLOYMENT_GUIDE.md
    elif command -v xdg-open &> /dev/null; then
        xdg-open COMPLETE_DEPLOYMENT_GUIDE.md
    else
        echo "Please open COMPLETE_DEPLOYMENT_GUIDE.md in your editor"
    fi
fi