#!/bin/bash

# Stop all GramSetu AI backend services

echo "🛑 Stopping all GramSetu AI services..."

# Kill processes on specific ports
for port in 3000 5001 5003; do
    if lsof -ti:$port > /dev/null 2>&1; then
        echo "  ↳ Stopping process on port $port"
        lsof -ti:$port | xargs kill -9 2>/dev/null
    fi
done

echo "✅ All services stopped"