#!/bin/bash

# Deployment script for GramSetu AI application to Vercel

echo "🚀 Starting GramSetu AI deployment to Vercel..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null
then
    echo "❌ Vercel CLI is not installed. Installing..."
    npm install -g vercel
fi

echo "✅ Vercel CLI is available"

# Navigate to project directory
cd "/Users/sagar/Documents/GramSetu AI – National Governance Intelligence Network"

# Check current Git status
echo "🔍 Checking Git status..."
git status

# Build the project
echo "🏗️ Building the project..."
npm run build

# Check if build was successful
if [ $? -ne 0 ]; then
    echo "❌ Build failed. Please check the errors above."
    exit 1
fi

echo "✅ Build completed successfully"

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."
vercel --prod --confirm

# Check if deployment was successful
if [ $? -ne 0 ]; then
    echo "❌ Deployment failed. Please check the errors above."
    exit 1
fi

echo "✅ Deployment completed successfully!"

# Display deployment URL
echo "🌐 Your application is now live at: https://gramsetu-89lg3uz12-sagars-projects-ca23f511.vercel.app"

echo "🎉 Deployment process completed!"