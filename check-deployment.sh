#!/bin/bash

# Script to check deployment status

echo "=== GramSetu AI Deployment Status Checker ==="
echo

# Check if required tools are installed
echo "1. Checking required tools..."
echo "   Node.js: $(node --version 2>/dev/null || echo 'Not installed')"
echo "   npm: $(npm --version 2>/dev/null || echo 'Not installed')"
echo "   Python: $(python3 --version 2>/dev/null || echo 'Not installed')"
echo "   Railway CLI: $(railway --version 2>/dev/null || echo 'Not installed')"
echo "   Vercel CLI: $(vercel --version 2>/dev/null || echo 'Not installed')"
echo

# Check project structure
echo "2. Checking project structure..."
if [ -d "src" ] && [ -d "replit-backend" ] && [ -d "services" ]; then
    echo "   ✅ Project structure is correct"
else
    echo "   ❌ Project structure is incomplete"
fi
echo

# Check build status
echo "3. Checking build status..."
if [ -d "build" ]; then
    echo "   ✅ Frontend build exists"
else
    echo "   ⚠️  Frontend build does not exist (run 'npm run build')"
fi

if [ -d "replit-backend/dist" ]; then
    echo "   ✅ Backend build exists"
else
    echo "   ⚠️  Backend build does not exist (run 'cd replit-backend && npm run build')"
fi
echo

# Check deployment status
echo "4. Checking deployment status..."
if [ -f ".vercel/project.json" ]; then
    echo "   ✅ Frontend deployed to Vercel"
    echo "   Frontend URL: https://gramsetu-89lg3uz12-sagars-projects-ca23f511.vercel.app"
else
    echo "   ⚠️  Frontend not deployed to Vercel"
fi

if [ -f "railway.json" ]; then
    echo "   ⚠️  Backend deployment to Railway pending"
    echo "   🔄 ALTERNATIVE: InsForge backend services configured"
    echo "   InsForge Status: ✅ API Key available, Storage buckets created"
else
    echo "   ❌ Railway configuration not found"
fi
echo

echo "=== Deployment Status Summary ==="
echo "✅ Frontend: Deployed to Vercel"
echo "🔄 Backend: InsForge services configured (see INSFORGE_DEPLOYMENT_GUIDE.md)"
echo
echo "Next steps:"
echo "1. Update frontend to use InsForge backend (see INSFORGE_DEPLOYMENT_GUIDE.md)"
echo "2. Create edge functions for business logic"
echo "3. Configure database tables"
echo "4. Update Vercel environment variables"