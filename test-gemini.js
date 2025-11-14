#!/usr/bin/env node

/**
 * Test script for Google Gemini AI integration
 * This script tests if the Gemini API key is properly configured
 */

// Load environment variables
require('dotenv').config();

const { GoogleGenerativeAI } = require("@google/generative-ai");

// Get API key from environment variables
const apiKey = process.env.REACT_APP_GEMINI_API_KEY || process.env.GEMINI_API_KEY;

console.log('🔍 Testing Google Gemini AI Integration');
console.log('=====================================');
console.log(`API Key found: ${!!apiKey}`);
console.log(`API Key value: ${apiKey ? apiKey.substring(0, 10) + '...' : 'None'}`);

if (!apiKey || apiKey === 'YOUR_GEMINI_API_KEY_HERE') {
  console.log('❌ Gemini API key not found in environment variables');
  console.log('Please set REACT_APP_GEMINI_API_KEY in your .env file');
  process.exit(1);
}

async function testGemini() {
  try {
    // Initialize Google Generative AI
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // List available models
    console.log('Fetching available models...');
    try {
      const models = await genAI.listModels();
      console.log('Available models:');
      models.models.forEach(model => {
        console.log(`- ${model.name} (${model.displayName})`);
      });
    } catch (listError) {
      console.log('Could not list models:', listError.message);
    }
    
    // Try different model names
    const modelNames = ["gemini-1.5-pro-latest", "gemini-1.0-pro-latest", "gemini-pro", "models/gemini-pro"];
    let model = null;
    let modelName = "";
    
    for (const name of modelNames) {
      try {
        console.log(`Trying model: ${name}`);
        model = genAI.getGenerativeModel({ model: name });
        modelName = name;
        break;
      } catch (e) {
        console.log(`Model ${name} not available, trying next...`);
      }
    }
    
    if (!model) {
      throw new Error("No available Gemini models found");
    }
    
    console.log(`Using model: ${modelName}`);
    
    // Test prompt
    const prompt = "Write a short greeting message for a governance AI assistant";
    
    console.log('Sending test prompt to Gemini...');
    console.log(`Prompt: ${prompt}`);
    console.log('');
    
    // Generate content
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log('✅ Gemini API Response:');
    console.log(text);
    console.log('');
    console.log('🎉 Gemini AI integration is working correctly!');
    
  } catch (error) {
    console.log('❌ Gemini AI test failed:');
    console.log(error.message);
    console.log('');
    console.log('Please check your API key and network connection');
    process.exit(1);
  }
}

// Run the test
testGemini();