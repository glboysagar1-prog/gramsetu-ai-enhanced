#!/bin/bash

# Verify Google Gemini AI Setup Script
echo "🔍 Verifying Google Gemini AI Setup for GramSetu AI"
echo "=================================================="

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "❌ .env file not found!"
    echo "Please create a .env file with your Gemini API key:"
    echo "REACT_APP_GEMINI_API_KEY=your_api_key_here"
    exit 1
fi

echo "✅ .env file found"

# Check if Gemini API key is set
if grep -q "REACT_APP_GEMINI_API_KEY=YOUR_GEMINI_API_KEY_HERE" ".env"; then
    echo "⚠️  Gemini API key not configured in .env file"
    echo "Please replace 'YOUR_GEMINI_API_KEY_HERE' with your actual API key"
    exit 1
elif grep -q "REACT_APP_GEMINI_API_KEY=" ".env"; then
    echo "✅ Gemini API key found in .env file"
else
    echo "⚠️  REACT_APP_GEMINI_API_KEY not found in .env file"
    echo "Please add: REACT_APP_GEMINI_API_KEY=your_api_key_here"
    exit 1
fi

# Check if required packages are installed
echo ""
echo "📦 Checking required packages..."

if npm list @google/generative-ai >/dev/null 2>&1; then
    echo "✅ @google/generative-ai package installed"
else
    echo "❌ @google/generative-ai package not installed"
    echo "Install it with: npm install @google/generative-ai"
    exit 1
fi

echo ""
echo "🧪 Testing Gemini AI integration..."
npm run test:gemini

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 Gemini AI setup verification complete!"
    echo ""
    echo "📝 Next steps:"
    echo "1. Start your application: npm start"
    echo "2. Open http://localhost:5002 in your browser"
    echo "3. Click the AI assistant button (bottom right) to test Gemini integration"
    echo ""
    echo "If you encounter any issues:"
    echo "- Verify your API key is correct and active"
    echo "- Check that billing is enabled for your Google Cloud project"
    echo "- Ensure you have internet connectivity"
else
    echo ""
    echo "❌ Gemini AI integration test failed!"
    echo "Please check the error message above and verify your setup."
    exit 1
fi