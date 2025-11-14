#!/usr/bin/env node

/**
 * List available Google Gemini models
 * This script lists all available models for your API key
 */

// Load environment variables
require('dotenv').config();

const { GoogleGenerativeAI } = require("@google/generative-ai");

// Get API key from environment variables
const apiKey = process.env.REACT_APP_GEMINI_API_KEY || process.env.GEMINI_API_KEY;

console.log('🔍 Listing Google Gemini AI Models');
console.log('=================================');
console.log(`API Key found: ${!!apiKey}`);
console.log(`API Key value: ${apiKey ? apiKey.substring(0, 10) + '...' : 'None'}`);

if (!apiKey || apiKey === 'YOUR_GEMINI_API_KEY_HERE') {
  console.log('❌ Gemini API key not found in environment variables');
  console.log('Please set REACT_APP_GEMINI_API_KEY in your .env file');
  process.exit(1);
}

async function listModels() {
  try {
    // Initialize Google Generative AI
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Try to list models (this might not work in all versions)
    console.log('Attempting to list available models...');
    
    // Try direct API call
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
    );
    
    if (response.ok) {
      const data = await response.json();
      console.log('Available models:');
      data.models.forEach(model => {
        console.log(`- ${model.name} (${model.displayName})`);
        if (model.description) {
          console.log(`  ${model.description}`);
        }
      });
    } else {
      console.log('Failed to list models via API call');
      console.log(`Status: ${response.status}`);
      console.log(`Error: ${await response.text()}`);
    }
    
  } catch (error) {
    console.log('Error listing models:');
    console.log(error.message);
    
    // Try some common model names
    console.log('\nTrying common model names...');
    const commonModels = [
      "gemini-pro",
      "gemini-1.0-pro",
      "gemini-1.0-pro-latest",
      "gemini-pro-vision"
    ];
    
    const genAI = new GoogleGenerativeAI(apiKey);
    
    for (const modelName of commonModels) {
      try {
        console.log(`Testing model: ${modelName}`);
        const model = genAI.getGenerativeModel({ model: modelName });
        // Try a simple generation to test if the model works
        const result = await model.generateContent("Say hello");
        const response = await result.response;
        const text = response.text();
        console.log(`✅ ${modelName} is available and working`);
      } catch (modelError) {
        console.log(`❌ ${modelName} is not available or not working`);
      }
    }
  }
}

// Run the function
listModels();