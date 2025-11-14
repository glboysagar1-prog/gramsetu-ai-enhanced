#!/bin/bash
# GramSetu AI - Release Package Creator
# Generates release.zip with all necessary files for IIT Bombay Techfest

set -e  # Exit on error

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${GREEN}=====================================${NC}"
echo -e "${GREEN}  GramSetu AI - Release Builder${NC}"
echo -e "${GREEN}=====================================${NC}"

# Configuration
RELEASE_DIR="release"
RELEASE_ZIP="release.zip"
BUILD_DIR="build"

# Clean previous release
echo -e "\n${YELLOW}Cleaning previous release...${NC}"
rm -rf $RELEASE_DIR $RELEASE_ZIP

# Create release directory
mkdir -p $RELEASE_DIR

# Build frontend
echo -e "\n${GREEN}Building frontend...${NC}"
npm run build

# Copy built frontend
echo -e "${YELLOW}Copying frontend build...${NC}"
cp -r $BUILD_DIR $RELEASE_DIR/frontend

# Copy backend files
echo -e "${YELLOW}Copying backend files...${NC}"
mkdir -p $RELEASE_DIR/backend
cp app.py $RELEASE_DIR/backend/
cp config.py $RELEASE_DIR/backend/
cp voice_config.py $RELEASE_DIR/backend/
cp requirements.txt $RELEASE_DIR/backend/
cp -r services $RELEASE_DIR/backend/
cp -r utils $RELEASE_DIR/backend/
cp -r mocks $RELEASE_DIR/backend/

# Copy Docker files
echo -e "${YELLOW}Copying Docker configuration...${NC}"
cp Dockerfile.frontend $RELEASE_DIR/
cp Dockerfile.backend $RELEASE_DIR/
cp docker-compose.yml $RELEASE_DIR/

# Copy demo files
echo -e "${YELLOW}Copying demo files...${NC}"
mkdir -p $RELEASE_DIR/demo
cp -r demo/* $RELEASE_DIR/demo/ 2>/dev/null || echo "Demo files not found, skipping..."

# Copy documentation
echo -e "${YELLOW}Copying documentation...${NC}"
cp README.md $RELEASE_DIR/
cp QUICK_START_GUIDE.md $RELEASE_DIR/
cp DEMO_SCRIPT.md $RELEASE_DIR/
cp CHECKLIST_FOR_JUDGES.md $RELEASE_DIR/
cp COMPLETE_FEATURES_LIST.md $RELEASE_DIR/

# Copy environment template
cp .env.example $RELEASE_DIR/

# Copy scripts
mkdir -p $RELEASE_DIR/scripts
cp scripts/*.sh $RELEASE_DIR/scripts/

# Create deployment instructions
cat > $RELEASE_DIR/DEPLOY.md << 'EOF'
# GramSetu AI - Deployment Instructions

## Quick Deploy Options

### Option 1: Docker Compose (Recommended for Local Demo)

```bash
# 1. Copy .env.example to .env and configure
cp .env.example .env

# 2. Start all services
docker-compose up -d

# 3. Access application
# Frontend: http://localhost:3000
# Backend: http://localhost:5000
```

### Option 2: Vercel (Frontend) + Render (Backend)

#### Frontend (Vercel):
```bash
cd frontend
npm install
vercel --prod
```

Environment variables in Vercel dashboard:
- `REACT_APP_API_URL`: Your backend URL

#### Backend (Render):
1. Push code to GitHub
2. Create new Web Service on Render
3. Connect repository
4. Set environment variables from `.env.example`
5. Deploy

### Option 3: Manual Installation

#### Frontend:
```bash
cd frontend
npm install
npm start  # Development
npm run build  # Production
```

#### Backend:
```bash
cd backend
pip install -r requirements.txt
python app.py  # Development
gunicorn app:app  # Production
```

## Environment Variables

See `.env.example` for all required variables.

**Minimum required for demo mode:**
- `JWT_SECRET`
- `DATABASE_URL` (can use SQLite)
- `DEMO_MODE=true`

**Optional (will use mocks if missing):**
- `OPENAI_API_KEY`
- `THIRDWEB_SECRET_KEY`
- `PINECONE_API_KEY`

## Offline Demo Mode

To run completely offline with pre-seeded data:

```bash
# Set in .env
OFFLINE_MODE=true
DEMO_MODE=true

# Or via URL parameter
http://localhost:3000?offline=true
```

## Troubleshooting

### Frontend won't build:
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Backend errors:
```bash
pip install --upgrade pip
pip install -r requirements.txt --force-reinstall
```

### Database issues:
```bash
# Reset SQLite database
rm gramsetu_ai.db
python app.py  # Will auto-create
```

## Support

For issues: https://github.com/gramsetu-ai/issues
Email: support@gramsetu.in
EOF

# Create checksums
echo -e "${YELLOW}Generating checksums...${NC}"
cd $RELEASE_DIR
find . -type f -exec sha256sum {} \; > CHECKSUMS.txt
cd ..

# Create release package
echo -e "\n${GREEN}Creating release.zip...${NC}"
zip -r $RELEASE_ZIP $RELEASE_DIR

# Get file size
FILE_SIZE=$(du -h $RELEASE_ZIP | cut -f1)

echo -e "\n${GREEN}=====================================${NC}"
echo -e "${GREEN}  Release Package Created!${NC}"
echo -e "${GREEN}=====================================${NC}"
echo -e "\nPackage: ${YELLOW}$RELEASE_ZIP${NC}"
echo -e "Size: ${YELLOW}$FILE_SIZE${NC}"
echo -e "\n${GREEN}Contents:${NC}"
echo "  ✓ Frontend build (static files)"
echo "  ✓ Backend code & dependencies"
echo "  ✓ Docker configuration"
echo "  ✓ Demo files & seed data"
echo "  ✓ Documentation (README, DEMO_SCRIPT, etc.)"
echo "  ✓ Environment template"
echo "  ✓ Deployment scripts"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "  1. Extract: unzip $RELEASE_ZIP"
echo "  2. Configure: cp .env.example .env (edit values)"
echo "  3. Deploy: docker-compose up -d"
echo "  4. Test: http://localhost:3000"
echo ""
echo -e "${GREEN}Ready for IIT Bombay Techfest! 🚀${NC}"
