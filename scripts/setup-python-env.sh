#!/bin/bash

# Setup script for Python backend environment
echo "🔍 Setting up Python backend environment..."

# Navigate to services directory
cd "$(dirname "$0")/../services" || exit 1

# Check if python-dotenv is installed
if ! python3 -c "import dotenv" 2>/dev/null; then
    echo "Installing python-dotenv..."
    python3 -m pip install python-dotenv
fi

# Run the Python environment setup script
echo "Running Python environment setup..."
python3 setup-env.py

if [ $? -eq 0 ]; then
    echo "✅ Python environment setup completed successfully!"
else
    echo "❌ Python environment setup failed!"
    exit 1
fi