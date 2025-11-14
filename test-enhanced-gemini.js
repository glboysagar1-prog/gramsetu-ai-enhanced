// Test script to verify enhanced Google Gemini integration
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Load environment variables
require('dotenv').config();

async function testEnhancedGemini() {
  console.log('🔍 Testing Enhanced Google Gemini AI Integration');
  console.log('==============================================');
  
  try {
    // Get API key from environment
    const apiKey = process.env.REACT_APP_GEMINI_API_KEY;
    
    if (!apiKey || apiKey === 'YOUR_GEMINI_API_KEY_HERE') {
      throw new Error('Gemini API key not found. Please set REACT_APP_GEMINI_API_KEY in your .env file.');
    }
    
    console.log('✅ API Key found');
    
    // Initialize Google Generative AI with enhanced configuration
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash-001",
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      }
    });
    
    // Test prompt
    const prompt = "Explain how AI can improve governance and citizen services in India";
    
    console.log('📝 Sending enhanced test prompt to Gemini...');
    console.log(`Prompt: ${prompt}`);
    
    // Generate content
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log('\n✅ Enhanced Gemini API Response:');
    console.log(text);
    console.log('\n🎉 Enhanced Gemini AI integration is working correctly!');
    
  } catch (error) {
    console.log('\n❌ Enhanced Gemini AI test failed:');
    console.log(error.message);
    console.log('\nPlease check your API key and network connection');
  }
}

// Run the test
testEnhancedGemini();