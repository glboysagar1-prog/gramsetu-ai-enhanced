#!/bin/bash

# Full Stack Deployment Script for GramSetu AI
# Deploys backend to Railway and frontend to Vercel with auto-linked environment variables

set -e

echo "🚀 GramSetu AI - Full Stack Deployment"
echo "======================================"
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
    echo -e "${RED}Error: Vercel CLI not installed${NC}"
    echo "Install with: npm install -g vercel"
    exit 1
fi

echo -e "${BLUE}Starting full stack deployment process...${NC}"
echo ""

# Login to Railway (interactive)
echo -e "${YELLOW}Step 1: Logging in to Railway${NC}"
echo "Please complete the login process in your browser"
railway login
echo -e "${GREEN}✅ Logged in to Railway${NC}"
echo ""

# Login to Vercel (interactive)
echo -e "${YELLOW}Step 2: Logging in to Vercel${NC}"
echo "Please complete the login process in your browser"
vercel login
echo -e "${GREEN}✅ Logged in to Vercel${NC}"
echo ""

# Deploy Flask Backend
echo -e "${YELLOW}Step 3: Deploying Flask Backend (Complaints & AI)${NC}"
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
echo -e "${YELLOW}Step 4: Deploying Replit Backend (Auth & Files)${NC}"
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

# Configure Railway Environment Variables
echo -e "${YELLOW}Step 5: Configuring Railway Environment Variables${NC}"

echo "Setting environment variables for Flask Backend..."
railway variables set PORT=5001
railway variables set FLASK_ENV=production
railway variables set CORS_ORIGINS="https://gramsetu-frontend.vercel.app,http://localhost:3000"

echo "Setting environment variables for Replit Backend..."
cd replit-backend
railway variables set PORT=5003
railway variables set NODE_ENV=production
railway variables set CORS_ORIGINS="https://gramsetu-frontend.vercel.app,http://localhost:3000"
cd ..

echo -e "${GREEN}✅ Environment variables configured${NC}"
echo ""

# Add PostgreSQL addons
echo -e "${YELLOW}Step 6: Adding PostgreSQL Addons${NC}"
echo "Please add PostgreSQL addons manually in the Railway dashboard for both projects:"
echo "1. Go to Railway dashboard"
echo "2. For each project, go to Settings → Add-ons"
echo "3. Add PostgreSQL addon"
echo "4. The DATABASE_URL will be set automatically"
echo ""
read -p "Press Enter when you've added the PostgreSQL addons..."

# Run database migrations
echo -e "${YELLOW}Step 7: Running Database Migrations${NC}"
cd replit-backend
echo "Running database migrations..."
railway run npm run db:push
cd ..
echo -e "${GREEN}✅ Database migrations completed${NC}"
echo ""

# Deploy Frontend to Vercel
echo -e "${YELLOW}Step 8: Deploying Frontend to Vercel${NC}"

# Build frontend
echo "Building frontend..."
npm run build

# Deploy to Vercel
echo "Deploying to Vercel..."
vercel --prod --confirm
FRONTEND_URL=$(vercel --token $(vercel token) --scope $(vercel whoami) --json | jq -r '.url')
echo -e "${GREEN}✅ Frontend deployed at: $FRONTEND_URL${NC}"
echo ""

# Configure Vercel Environment Variables
echo -e "${YELLOW}Step 9: Configuring Vercel Environment Variables${NC}"
vercel env add REACT_APP_API_URL production <<< "$FLASK_URL"
vercel env add REACT_APP_AUTH_API_URL production <<< "$REPLIT_URL"
echo -e "${GREEN}✅ Vercel environment variables configured${NC}"
echo ""

# Final Summary
echo -e "${BLUE}Deployment Summary:${NC}"
echo "==================="
echo "Flask Backend (Complaints & AI): $FLASK_URL"
echo "Replit Backend (Auth & Files): $REPLIT_URL"
echo "Frontend: $FRONTEND_URL"
echo ""
echo -e "${YELLOW}Next Manual Steps:${NC}"
echo "1. Add InsForge configuration to Railway projects:"
echo "   - INSFORGE_PROJECT_ID"
echo "   - INSFORGE_API_KEY"
echo "   - INSFORGE_JWT_SECRET"
echo "2. Add Google OAuth credentials to Replit backend (if needed):"
echo "   - GOOGLE_CLIENT_ID"
echo "   - GOOGLE_CLIENT_SECRET"
echo "   - GOOGLE_REDIRECT_URI"
echo "3. Add Redis addon to Flask backend (optional but recommended)"
echo ""
echo -e "${GREEN}✅ Full stack deployment process completed!${NC}"
echo ""
echo "See DEPLOYMENT_INSTRUCTIONS.md for detailed instructions and troubleshooting."