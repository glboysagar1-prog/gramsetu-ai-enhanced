import React, { useState } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";

const GeminiTestComponent = () => {
  const [prompt, setPrompt] = useState('Explain how AI can improve governance and citizen services in India');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const testGemini = async () => {
    setLoading(true);
    setError('');
    setResponse('');
    
    try {
      // Get API key from environment
      const apiKey = process.env.REACT_APP_GEMINI_API_KEY;
      
      if (!apiKey || apiKey === 'YOUR_GEMINI_API_KEY_HERE') {
        throw new Error('Gemini API key not found. Please set REACT_APP_GEMINI_API_KEY in your .env file.');
      }

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

      // Generate content
      const result = await model.generateContent(prompt);
      const geminiResponse = await result.response;
      const text = geminiResponse.text();
      
      setResponse(text);
    } catch (err) {
      setError(err.message || 'Failed to generate response');
      console.error('Gemini API Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2>Google Gemini AI Test</h2>
      <p>Test the enhanced Gemini AI integration with a governance-related prompt.</p>
      
      <div style={{ marginBottom: '15px' }}>
        <label htmlFor="prompt" style={{ display: 'block', marginBottom: '5px' }}>
          Enter your prompt:
        </label>
        <textarea
          id="prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Ask anything..."
          style={{
            width: '100%',
            padding: '10px',
            borderRadius: '5px',
            border: '1px solid #ccc',
            minHeight: '80px',
            fontSize: '14px'
          }}
        />
      </div>
      
      <button
        onClick={testGemini}
        disabled={loading}
        style={{
          padding: '10px 20px',
          backgroundColor: '#4285F4',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          fontSize: '16px',
          cursor: loading ? 'not-allowed' : 'pointer',
          opacity: loading ? 0.7 : 1
        }}
      >
        {loading ? 'Generating...' : 'Test Enhanced Gemini AI'}
      </button>

      {error && (
        <div style={{
          marginTop: '15px',
          padding: '15px',
          backgroundColor: '#ffebee',
          color: '#c62828',
          borderRadius: '5px'
        }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {response && (
        <div style={{
          marginTop: '15px',
          padding: '15px',
          backgroundColor: '#e8f5e9',
          borderRadius: '5px'
        }}>
          <strong>Gemini Response:</strong>
          <p style={{ marginTop: '10px', lineHeight: '1.5' }}>{response}</p>
        </div>
      )}
    </div>
  );
};

export default GeminiTestComponent;