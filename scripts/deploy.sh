#!/bin/bash

# GramSetu AI - Quick Deployment Setup Script
# This script helps you deploy to Railway, Render, or Vercel

set -e

echo "🚀 GramSetu AI - Deployment Setup"
echo "=================================="
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

echo "Select deployment platform:"
echo "1) Railway (Recommended - Free $5 credit)"
echo "2) Render (Free tier available)"
echo "3) Vercel (Frontend + Serverless)"
echo "4) Docker (Build images locally)"
echo "5) Exit"
echo ""
read -p "Enter choice [1-5]: " choice

case $choice in
    1)
        echo -e "\n${BLUE}📦 Railway Deployment Setup${NC}"
        echo "=================================="
        
        # Check if Railway CLI is installed
        if ! command -v railway &> /dev/null; then
            echo -e "${YELLOW}Installing Railway CLI...${NC}"
            npm install -g @railway/cli
        fi
        
        echo -e "\n${GREEN}✅ Railway CLI ready!${NC}"
        echo ""
        echo "Next steps:"
        echo "1. Run: railway login"
        echo "2. Run: railway init"
        echo "3. Create two projects:"
        echo "   - For Replit Backend: cd replit-backend && railway up"
        echo "   - For Flask Backend: railway up"
        echo ""
        echo "4. Add environment variables in Railway dashboard"
        echo ""
        echo "📖 See PRODUCTION_DEPLOYMENT.md for detailed instructions"
        ;;
        
    2)
        echo -e "\n${BLUE}🎨 Render Deployment Setup${NC}"
        echo "=================================="
        echo ""
        echo "Manual steps (no CLI needed):"
        echo ""
        echo "1. Go to: https://render.com"
        echo "2. New Web Service → Connect GitHub"
        echo "3. Deploy Flask Backend:"
        echo "   - Root: '.'"
        echo "   - Build: pip install -r requirements.txt"
        echo "   - Start: gunicorn --bind 0.0.0.0:\$PORT app:app"
        echo ""
        echo "4. Deploy Replit Backend:"
        echo "   - Root: 'replit-backend'"
        echo "   - Build: npm install && npm run build"
        echo "   - Start: npm start"
        echo ""
        echo "📖 See PRODUCTION_DEPLOYMENT.md for environment variables"
        ;;
        
    3)
        echo -e "\n${BLUE}▲ Vercel Deployment Setup${NC}"
        echo "=================================="
        
        # Check if Vercel CLI is installed
        if ! command -v vercel &> /dev/null; then
            echo -e "${YELLOW}Installing Vercel CLI...${NC}"
            npm install -g vercel
        fi
        
        echo -e "\n${GREEN}✅ Vercel CLI ready!${NC}"
        echo ""
        echo "Next steps:"
        echo "1. Deploy Frontend:"
        echo "   vercel --prod"
        echo ""
        echo "2. Deploy Replit Backend (Serverless):"
        echo "   cd replit-backend"
        echo "   vercel --prod"
        echo ""
        echo "Note: Flask backend not recommended for Vercel"
        echo "      Use Railway or Render for Flask"
        ;;
        
    4)
        echo -e "\n${BLUE}🐳 Docker Build${NC}"
        echo "=================================="
        
        # Check if Docker is installed
        if ! command -v docker &> /dev/null; then
            echo -e "${RED}Error: Docker not installed${NC}"
            echo "Install from: https://www.docker.com/get-started"
            exit 1
        fi
        
        echo -e "${YELLOW}Building Docker images...${NC}"
        echo ""
        
        # Build Flask backend
        echo "Building Flask backend..."
        docker build -f Dockerfile.flask -t gramsetu-flask-backend .
        
        # Build Replit backend
        echo "Building Replit backend..."
        cd replit-backend
        docker build -t gramsetu-replit-backend .
        cd ..
        
        # Build React frontend
        echo "Building React frontend..."
        docker build -f Dockerfile.frontend -t gramsetu-frontend .
        
        echo -e "\n${GREEN}✅ Docker images built successfully!${NC}"
        echo ""
        echo "Run containers:"
        echo "  docker run -p 5002:5000 gramsetu-flask-backend"
        echo "  docker run -p 5001:5000 gramsetu-replit-backend"
        echo "  docker run -p 3000:80 gramsetu-frontend"
        ;;
        
    5)
        echo "Exiting..."
        exit 0
        ;;
        
    *)
        echo -e "${RED}Invalid choice${NC}"
        exit 1
        ;;
esac

echo ""
echo -e "${GREEN}=================================="
echo -e "✅ Setup Complete!${NC}"
echo -e "==================================\n"
echo "📖 For detailed instructions, see:"
echo "   PRODUCTION_DEPLOYMENT.md"
echo ""
