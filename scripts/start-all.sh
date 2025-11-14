#!/bin/bash

# GramSetu AI - Dual Backend Startup Script
# This script starts both the Replit backend and Flask backend simultaneously

echo "🚀 Starting GramSetu AI System..."
echo "=================================="

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to check if a port is in use
check_port() {
    lsof -ti:$1 > /dev/null 2>&1
}

# Kill existing processes on ports
echo -e "${YELLOW}📋 Cleaning up existing processes...${NC}"
if check_port 5001; then
    echo "  ↳ Stopping process on port 5001"
    lsof -ti:5001 | xargs kill -9 2>/dev/null
fi

if check_port 5003; then
    echo "  ↳ Stopping process on port 5003"
    lsof -ti:5003 | xargs kill -9 2>/dev/null
fi

if check_port 3000; then
    echo "  ↳ React app already running on port 3000"
fi

sleep 1

# Start Replit Backend (Port 5003)
echo -e "\n${BLUE}🔧 Starting Replit Backend (Auth & Files)...${NC}"
cd "/Users/sagar/Documents/GramSetu AI – National Governance Intelligence Network/replit-backend"
PORT=5003 npm run dev > ../logs/replit-backend.log 2>&1 &
REPLIT_PID=$!
echo "  ↳ Replit Backend PID: $REPLIT_PID"
cd ..

# Wait for Replit backend to start
sleep 3

# Start Flask Backend (Port 5001)
echo -e "\n${BLUE}🤖 Starting Flask Backend (Complaints & AI)...${NC}"
cd "/Users/sagar/Documents/GramSetu AI – National Governance Intelligence Network"
PORT=5001 python3 app.py > logs/flask-backend.log 2>&1 &
FLASK_PID=$!
echo "  ↳ Flask Backend PID: $FLASK_PID"

# Wait for backends to initialize
echo -e "\n${YELLOW}⏳ Waiting for backends to initialize...${NC}"
sleep 5

# Check if backends are running
echo -e "\n${GREEN}✅ Backend Status:${NC}"

if check_port 5003; then
    echo -e "  ${GREEN}✓${NC} Replit Backend: http://localhost:5003"
else
    echo -e "  ${YELLOW}⚠${NC}  Replit Backend: Failed to start (check logs/replit-backend.log)"
fi

if check_port 5001; then
    echo -e "  ${GREEN}✓${NC} Flask Backend:  http://localhost:5001"
else
    echo -e "  ${YELLOW}⚠${NC}  Flask Backend: Failed to start (check logs/flask-backend.log)"
fi

if check_port 3000; then
    echo -e "  ${GREEN}✓${NC} React Frontend: http://localhost:3000"
else
    echo -e "  ${YELLOW}ℹ${NC}  React Frontend: Not running (start with 'npm start')"
fi

echo -e "\n${GREEN}=================================="
echo -e "🎉 GramSetu AI is ready!${NC}"
echo -e "==================================\n"

echo "📊 Access Points:"
echo "  • Frontend:       http://localhost:3000"
echo "  • Auth API:       http://localhost:5003/api"
echo "  • Complaint API:  http://localhost:5001/api"

echo -e "\n📝 Logs:"
echo "  • Replit Backend: logs/replit-backend.log"
echo "  • Flask Backend:  logs/flask-backend.log"

echo -e "\n⚠️  To stop all services, press Ctrl+C or run: ./scripts/stop-all.sh\n"

# Keep script running and handle shutdown
trap "echo -e '\n${YELLOW}🛑 Shutting down backends...${NC}'; kill $REPLIT_PID $FLASK_PID 2>/dev/null; exit" INT TERM

# Wait for backends
wait