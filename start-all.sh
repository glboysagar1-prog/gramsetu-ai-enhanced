#!/bin/bash

# GramSetu AI - Start All Services Script
# This script starts all required services for the GramSetu AI application

echo "🚀 Starting GramSetu AI Application..."
echo "======================================"

# Check if required environment variables are set
echo "🔍 Verifying environment setup..."
if ! node setup-env.js; then
    echo "❌ Environment verification failed!"
    exit 1
fi

# Function to clean up background processes on exit
cleanup() {
    echo -e "\n🛑 Shutting down services..."
    kill $(jobs -p) 2>/dev/null
    exit 0
}

# Trap exit signals to clean up
trap cleanup EXIT INT TERM

# Start Authentication Backend (Node.js)
echo -e "\n🔧 Starting Authentication Backend..."
cd replit-backend
npm run dev > ../logs/auth-backend.log 2>&1 &
AUTH_BACKEND_PID=$!
cd ..

# Start Complaint Backend (Python)
echo "🔧 Starting Complaint Backend..."
cd services
python3 app.py > ../logs/complaint-backend.log 2>&1 &
COMPLAINT_BACKEND_PID=$!
cd ..

# Start Frontend (React)
echo "🔧 Starting Frontend..."
npm start > logs/frontend.log 2>&1 &
FRONTEND_PID=$!

echo -e "\n✅ All services started successfully!"
echo "📝 Service PIDs:"
echo "   Authentication Backend: $AUTH_BACKEND_PID"
echo "   Complaint Backend: $COMPLAINT_BACKEND_PID"
echo "   Frontend: $FRONTEND_PID"

echo -e "\n🔗 Access the application:"
echo "   Frontend: http://localhost:3000"
echo "   Auth Backend: http://localhost:5000"
echo "   Complaint Backend: http://localhost:5001"

echo -e "\n📋 Log files are available in the 'logs' directory"
echo -e "\n⚠️  Press Ctrl+C to stop all services"

# Wait for all background processes
wait