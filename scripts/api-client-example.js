/**
 * Example API client demonstrating how to use both backends together
 * This shows the integration between the Replit auth backend and Flask complaint backend
 */

const axios = require('axios');

// API endpoints
const AUTH_API_BASE = 'http://localhost:5003/api';
const COMPLAINT_API_BASE = 'http://localhost:5001/api';

class GramSetuClient {
  constructor() {
    this.authToken = null;
    this.userId = null;
  }

  /**
   * Login to the authentication system
   */
  async login(email, password) {
    try {
      const response = await axios.post(`${AUTH_API_BASE}/auth/login`, {
        email,
        password
      });

      this.authToken = response.data.token;
      this.userId = response.data.user.id;
      
      console.log('✅ Login successful');
      console.log(`👤 User: ${response.data.user.username}`);
      console.log(`🆔 User ID: ${this.userId}`);
      
      return response.data;
    } catch (error) {
      console.error('❌ Login failed:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Submit a complaint using the Flask backend
   */
  async submitComplaint(complaintData) {
    if (!this.authToken) {
      throw new Error('Not authenticated. Please login first.');
    }

    try {
      // In a real implementation, you would send this to the Flask backend
      // For this example, we'll just show how it would work
      console.log('📝 Would submit complaint to Flask backend:');
      console.log(`   Text: ${complaintData.text}`);
      console.log(`   Category: ${complaintData.category}`);
      console.log(`   With auth token: ${this.authToken.substring(0, 20)}...`);
      
      // Mock response
      return {
        id: 'mock-complaint-id',
        status: 'submitted',
        message: 'Complaint would be submitted to Flask backend'
      };
    } catch (error) {
      console.error('❌ Complaint submission failed:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Upload a file using the Replit backend
   */
  async uploadFile(fileData) {
    if (!this.authToken) {
      throw new Error('Not authenticated. Please login first.');
    }

    try {
      // In a real implementation, you would upload to the Replit backend
      // For this example, we'll just show how it would work
      console.log('📁 Would upload file to Replit backend:');
      console.log(`   Filename: ${fileData.name}`);
      console.log(`   Size: ${fileData.size} bytes`);
      console.log(`   With auth token: ${this.authToken.substring(0, 20)}...`);
      
      // Mock response
      return {
        id: 'mock-file-id',
        status: 'uploaded',
        message: 'File would be uploaded to Replit backend'
      };
    } catch (error) {
      console.error('❌ File upload failed:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Get user analytics from Replit backend
   */
  async getUserAnalytics() {
    if (!this.authToken) {
      throw new Error('Not authenticated. Please login first.');
    }

    try {
      // In a real implementation, you would fetch from the Replit backend
      // For this example, we'll just show how it would work
      console.log('📊 Would fetch analytics from Replit backend');
      console.log(`   With auth token: ${this.authToken.substring(0, 20)}...`);
      
      // Mock response
      return {
        fileCount: 5,
        totalStorage: 2048000,
        filesThisMonth: 2,
        recentUploads: [
          { id: 'file1', name: 'document1.pdf', uploadedAt: new Date() },
          { id: 'file2', name: 'image1.jpg', uploadedAt: new Date() }
        ]
      };
    } catch (error) {
      console.error('❌ Analytics fetch failed:', error.response?.data || error.message);
      throw error;
    }
  }
}

// Example usage
async function main() {
  console.log('🚀 GramSetu AI Client Example');
  console.log('=============================');
  
  const client = new GramSetuClient();
  
  try {
    // Login
    await client.login('test@example.com', 'test123456');
    
    // Submit a complaint
    await client.submitComplaint({
      text: 'Water supply issue in sector 5',
      category: 'Water supply issues',
      urgency: 'High'
    });
    
    // Upload a file
    await client.uploadFile({
      name: 'water-bill.pdf',
      size: 1024000,
      type: 'application/pdf'
    });
    
    // Get analytics
    await client.getUserAnalytics();
    
    console.log('\n✅ All operations completed successfully!');
    console.log('This demonstrates how both backends work together.');
    
  } catch (error) {
    console.error('💥 Error in client example:', error.message);
  }
}

// Run the example if this file is executed directly
if (require.main === module) {
  main();
}

module.exports = GramSetuClient;