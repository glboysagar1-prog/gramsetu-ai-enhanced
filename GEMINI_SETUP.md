# Google Gemini AI Integration Guide

This guide explains how to set up and configure Google Gemini AI for the GramSetu AI Governance Assistant.

## Prerequisites

1. A Google Cloud account
2. A Google Cloud project
3. Billing enabled for your Google Cloud project

## Getting a Google Gemini API Key

1. Go to the [Google AI Studio](https://aistudio.google.com/)
2. Sign in with your Google account
3. Create a new API key:
   - Click on "Get API key" in a Google Cloud project
   - Select an existing project or create a new one
   - Click "Create API key"
4. Copy the API key and save it securely

## Configuration

1. Add your Gemini API key to the `.env` file:
   ```bash
   REACT_APP_GEMINI_API_KEY=your_actual_api_key_here
   ```

2. The application will automatically use Gemini AI for generating responses in the Governance Assistant.

## Testing the Integration

You can test if your Gemini API key is working correctly:

```bash
npm run test:gemini
```

This will send a test prompt to Gemini and display the response.

## How It Works

The Governance Assistant now uses Google Gemini AI for:

1. **Natural Language Understanding**: Better comprehension of citizen queries
2. **Context-Aware Responses**: Role-specific responses based on user type
3. **Multilingual Support**: Enhanced support for Indian languages
4. **Policy Guidance**: More accurate policy information and recommendations

## Fallback Mechanism

If Gemini AI is not configured or encounters an error, the system will fall back to:
- Predefined responses for each user role
- Simulated AI responses for demonstration purposes

## Troubleshooting

### Common Issues

1. **API Key Error**: 
   - Ensure your API key is correctly set in the `.env` file
   - Verify that billing is enabled for your Google Cloud project

2. **Network Issues**:
   - Check your internet connection
   - Ensure that your firewall isn't blocking requests to Google's APIs

3. **Rate Limiting**:
   - Gemini has rate limits; if you exceed them, you'll need to wait or upgrade your plan

### Testing Your Setup

Run the test script to verify your configuration:
```bash
npm run test:gemini
```

If successful, you should see a response from Gemini AI.

## Security Considerations

1. **API Key Protection**:
   - Never commit your API key to version control
   - Use environment variables as shown in the `.env` file
   - Rotate your API keys periodically

2. **Data Privacy**:
   - Be aware that prompts sent to Gemini may be stored by Google
   - Review Google's data usage policies for AI services

## Advanced Configuration

You can customize the Gemini model by modifying the GovernanceGPT.js component:

```javascript
// Change the model
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

// Adjust generation settings
const generationConfig = {
  temperature: 0.7,
  topP: 0.9,
  topK: 40,
  maxOutputTokens: 500,
};
```

## Support

For issues with the Gemini integration:
1. Check the browser console for error messages
2. Verify your API key is valid and has proper permissions
3. Ensure your Google Cloud project has the necessary APIs enabled