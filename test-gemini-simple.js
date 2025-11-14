#!/usr/bin/env node

/**
 * Simple test script for Google Gemini AI integration
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
    
    // Use a working model from the list
    const modelNames = [
      "gemini-2.0-flash-001",
      "gemini-2.0-flash",
      "gemini-flash-latest",
      "gemini-pro-latest",
      "gemini-1.5-flash",
      "gemini-1.5-pro"
    ];
    
    let model = null;
    let selectedModelName = "";
    
    for (const name of modelNames) {
      try {
        console.log(`Trying model: ${name}`);
        model = genAI.getGenerativeModel({ model: name });
        selectedModelName = name;
        break;
      } catch (e) {
        console.log(`Model ${name} not available, trying next...`);
      }
    }
    
    if (!model) {
      // Fallback to a known working model
      console.log(`Using fallback model: gemini-2.0-flash-001`);
      model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-001" });
      selectedModelName = "gemini-2.0-flash-001";
    }
    
    console.log(`✅ Using model: ${selectedModelName}`);
    
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