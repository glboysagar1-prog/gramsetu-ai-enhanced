#!/bin/bash

# GramSetu AI - Quick Start Script
# Run this script to start both backend and frontend servers

set -e

echo "🚀 Starting GramSetu AI for IIT Bombay Techfest 2024"
echo "=================================================="

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Change to project directory
cd "$(dirname "$0")"

# Check if .env exists
if [ ! -f .env ]; then
    echo "${YELLOW}⚠️  .env file not found. Creating from example...${NC}"
    cp .env.example .env 2>/dev/null || echo "Please create .env file manually"
fi

# Function to cleanup on exit
cleanup() {
    echo "\n${YELLOW}Stopping servers...${NC}"
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    echo "${GREEN}✅ Servers stopped${NC}"
    exit 0
}

trap cleanup EXIT INT TERM

# Check Python version
echo "${BLUE}Checking Python version...${NC}"
python3 --version

# Check Node version
echo "${BLUE}Checking Node version...${NC}"
node --version

# Install Python dependencies (optional - app runs without AI libs)
echo "${BLUE}Checking Python dependencies...${NC}"
if ! python3 -c "import flask" 2>/dev/null; then
    echo "${YELLOW}Installing minimal Python dependencies...${NC}"
    pip3 install flask flask-cors python-dotenv pyjwt werkzeug 2>/dev/null || echo "Some packages already installed"
fi

# Install Node dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "${BLUE}Installing Node dependencies...${NC}"
    npm install
fi

# Start backend server
echo "${BLUE}Starting backend server on port 5001...${NC}"
python3 app.py > backend.log 2>&1 &
BACKEND_PID=$!

# Wait for backend to start
echo "${YELLOW}Waiting for backend to start...${NC}"
sleep 5

# Check if backend is running
if curl -s http://localhost:5001/healthz > /dev/null; then
    echo "${GREEN}✅ Backend running on http://localhost:5001${NC}"
    curl -s http://localhost:5001/healthz | python3 -m json.tool 2>/dev/null || echo "Backend is healthy"
else
    echo "${YELLOW}⚠️  Backend may still be starting... Check backend.log for details${NC}"
fi

# Start frontend server
echo "${BLUE}Starting frontend server on port 3000...${NC}"
PORT=3000 npm start > frontend.log 2>&1 &
FRONTEND_PID=$!

echo "${YELLOW}Waiting for frontend to compile...${NC}"
sleep 10

# Show status
echo ""
echo "${GREEN}=================================================="
echo "🎉 GramSetu AI is now running!"
echo "=================================================="
echo ""
echo "📊 Frontend Dashboard: ${BLUE}http://localhost:3000${NC}"
echo "🔧 Backend API:        ${BLUE}http://localhost:5001${NC}"
echo "💚 Health Check:       ${BLUE}http://localhost:5001/healthz${NC}"
echo ""
echo "📝 Logs:"
echo "   Backend:  tail -f backend.log"
echo "   Frontend: tail -f frontend.log"
echo ""
echo "⚙️  Running in: ${YELLOW}Fallback/Demo Mode${NC}"
echo "   (No AI libraries required for basic demo)"
echo ""
echo "Press ${YELLOW}Ctrl+C${NC} to stop all servers"
echo "=================================================="
echo ""

# Keep script running and show logs
tail -f backend.log frontend.log
