// Test script to verify InsForge connection
const { createClient } = require('@insforge/sdk');

// Initialize client
const client = createClient({ 
  baseUrl: 'https://89gp4et3.us-east.insforge.app'
});

// Test connection
async function testConnection() {
  try {
    console.log('Testing InsForge connection...');
    
    // Test basic connectivity
    const response = await fetch('https://89gp4et3.us-east.insforge.app');
    console.log('HTTP Status:', response.status);
    
    // Test SDK initialization
    console.log('SDK initialized successfully');
    
    // Test authentication endpoint (without credentials)
    try {
      const { error } = await client.auth.signInWithPassword({
        email: 'test@example.com',
        password: 'testpassword'
      });
      
      // We expect an error here since we're using fake credentials
      // But this confirms the endpoint is reachable
      if (error) {
        console.log('Authentication endpoint is reachable');
        console.log('Expected error (fake credentials):', error.message);
      }
    } catch (authError) {
      console.log('Authentication endpoint test failed:', authError.message);
    }
    
    console.log('Connection test completed successfully');
  } catch (error) {
    console.error('Connection test failed:', error.message);
  }
}

// Run test
testConnection();