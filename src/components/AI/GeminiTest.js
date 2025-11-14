import React, { useState } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";

const GeminiTest = () => {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    setError('');
    setResponse('');

    try {
      // Get API key from environment
      const apiKey = process.env.REACT_APP_GEMINI_API_KEY;
      
      if (!apiKey || apiKey === 'YOUR_GEMINI_API_KEY_HERE') {
        throw new Error('Gemini API key not found. Please set REACT_APP_GEMINI_API_KEY in your .env file.');
      }

      // Initialize Google Generative AI
      const genAI = new GoogleGenerativeAI(apiKey);
      // Use the same model as in GovernanceGPT
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-001" });

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
    <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
      <h2>Google Gemini AI Test</h2>
      <p>Test the Gemini AI integration with a simple prompt.</p>
      
      <form onSubmit={handleSubmit} style={{ marginBottom: '1rem' }}>
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="prompt" style={{ display: 'block', marginBottom: '0.5rem' }}>
            Enter your prompt:
          </label>
          <textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ask anything..."
            style={{
              width: '100%',
              padding: '0.75rem',
              borderRadius: '8px',
              border: '1px solid #ccc',
              minHeight: '100px',
              fontSize: '1rem'
            }}
          />
        </div>
        <button
          type="submit"
          disabled={loading || !prompt.trim()}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#4285F4',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '1rem',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading || !prompt.trim() ? 0.7 : 1
          }}
        >
          {loading ? 'Generating...' : 'Send to Gemini'}
        </button>
      </form>

      {error && (
        <div style={{
          padding: '1rem',
          backgroundColor: '#ffebee',
          color: '#c62828',
          borderRadius: '8px',
          marginBottom: '1rem'
        }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {response && (
        <div style={{
          padding: '1rem',
          backgroundColor: '#e8f5e9',
          borderRadius: '8px',
          marginTop: '1rem'
        }}>
          <strong>Gemini Response:</strong>
          <p style={{ marginTop: '0.5rem', lineHeight: '1.5' }}>{response}</p>
        </div>
      )}
    </div>
  );
};

export default GeminiTest;