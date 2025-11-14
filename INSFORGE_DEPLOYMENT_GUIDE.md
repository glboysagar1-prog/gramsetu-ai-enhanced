# GramSetu AI Deployment Guide Using InsForge

This guide provides instructions for deploying your GramSetu AI application using InsForge as the backend service provider, which eliminates the need for Railway deployment.

## 🎉 Current Status

Your GramSetu AI application deployment is now **partially complete** with:

### ✅ Completed
1. **Frontend Deployment**: Successfully deployed to Vercel
   - URL: https://gramsetu-89lg3uz12-sagars-projects-ca23f511.vercel.app
2. **InsForge Backend Setup**: Authentication, storage, and database services configured
3. **Storage Buckets**: Created for user files and complaint evidence

### ⚙️ InsForge Backend Services
- **Authentication**: Email/password and OAuth (Google, GitHub)
- **Database**: PostgreSQL with users table
- **Storage**: Private buckets for user files and complaint evidence
- **AI Services**: Gemini and GPT-4 models available
- **Edge Functions**: Serverless function deployment capability

## 🚀 Deployment Architecture

```
Deployment Architecture:
├── Frontend (Vercel)
│   └── React Application
│       ├── URL: https://gramsetu-89lg3uz12-sagars-projects-ca23f511.vercel.app
│
├── Backend (InsForge)
│   ├── Authentication Service
│   │   ├── Email/Password Registration & Login
│   │   ├── OAuth (Google, GitHub)
│   │   └── JWT-based session management
│   │
│   ├── Database Service
│   │   ├── PostgreSQL database
│   │   ├── Users table (auto-created)
│   │   └── Extensible schema
│   │
│   ├── Storage Service
│   │   ├── user-files bucket (private)
│   │   ├── complaint-evidence bucket (private)
│   │   └── Secure file upload/download
│   │
│   ├── AI Service
│   │   ├── Google Gemini 2.5 Flash
│   │   ├── OpenAI GPT-4
│   │   └── Multimodal support (text + images)
│   │
│   └── Edge Functions
│       └── Serverless API endpoints
```

## 📋 Next Steps for Complete Deployment

### 1. Update Frontend to Use InsForge Backend

#### 1.1 Install InsForge SDK
```bash
cd /path/to/gramsetu-ai
npm install @insforge/sdk
```

#### 1.2 Update Environment Variables in Vercel
Add these environment variables to your Vercel project:

```
REACT_APP_INSFORGE_URL=https://89gp4et3.us-east.insforge.app
REACT_APP_INSFORGE_API_KEY=ik_91095700e39c0e61fcf551407fe9a7ba
```

#### 1.3 Update Authentication Context
Modify your authentication context to use InsForge instead of the current backend:

```javascript
// src/contexts/AuthContext.js
import { createClient } from '@insforge/sdk';

const client = createClient({ 
  baseUrl: process.env.REACT_APP_INSFORGE_URL 
});

// Replace existing login function
const login = async (credentials) => {
  try {
    const { data, error } = await client.auth.signInWithPassword({
      email: credentials.username,
      password: credentials.password
    });
    
    if (error) throw error;
    
    // Store token and user data
    localStorage.setItem('gramsetuToken', data.accessToken);
    localStorage.setItem('gramsetuUser', JSON.stringify(data.user));
    
    setToken(data.accessToken);
    setUser(data.user);
    
    return { success: true, user: data.user };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Replace existing signup function
const signup = async (userData) => {
  try {
    const { data, error } = await client.auth.signUp({
      email: userData.email,
      password: userData.password
    });
    
    if (error) throw error;
    
    // Update profile
    await client.auth.setProfile({
      nickname: userData.name,
      role: userData.role
    });
    
    return { success: true, user: data.user };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
```

### 2. Create Edge Functions for Business Logic

#### 2.1 Create Complaint Management Function
Create a file `functions/complaints.js`:

```javascript
module.exports = async function(request) {
  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  };

  // Handle OPTIONS
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  // Extract token from request headers
  const authHeader = request.headers.get('Authorization');
  const userToken = authHeader ? authHeader.replace('Bearer ', '') : null;
  
  // Create client with the edge function token
  const client = createClient({ 
    baseUrl: Deno.env.get('BACKEND_INTERNAL_URL') || 'http://insforge:7130',
    edgeFunctionToken: userToken
  });
  
  try {
    // Get authenticated user
    const { data: userData, error: userError } = await client.auth.getCurrentUser();
    if (userError) {
      return new Response(JSON.stringify({ error: 'Authentication required' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    const url = new URL(request.url);
    const method = request.method;
    const path = url.pathname;
    
    // Route handling
    if (path === '/complaints' && method === 'POST') {
      // Create complaint
      const body = await request.json();
      
      // Insert complaint into database
      const { data, error } = await client.database
        .from('complaints')
        .insert([{
          user_id: userData.user.id,
          title: body.title,
          description: body.description,
          category: body.category,
          latitude: body.latitude,
          longitude: body.longitude,
          status: 'pending',
          created_at: new Date().toISOString()
        }])
        .select()
        .single();
      
      if (error) {
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
      
      return new Response(JSON.stringify(data), {
        status: 201,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    } else if (path === '/complaints' && method === 'GET') {
      // Get user's complaints
      const { data, error } = await client.database
        .from('complaints')
        .select('*')
        .eq('user_id', userData.user.id)
        .order('created_at', { ascending: false });
      
      if (error) {
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
      
      return new Response(JSON.stringify(data), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    return new Response(JSON.stringify({ error: 'Not found' }), {
      status: 404,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
};
```

#### 2.2 Deploy Edge Functions
```bash
# Create the function (this would be done through MCP tools)
# mcp_insforge_create-function --name complaints --codeFile functions/complaints.js
```

### 3. Update Frontend API Calls

#### 3.1 Update Complaint Service
Modify your complaint service to use the new InsForge backend:

```javascript
// src/services/complaintService.js
const API_BASE_URL = process.env.REACT_APP_INSFORGE_URL;
const COMPLAINTS_API_URL = `${API_BASE_URL}/functions/complaints`;

export const createComplaint = async (complaintData, token) => {
  const response = await fetch(COMPLAINTS_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(complaintData)
  });
  
  return response.json();
};

export const getUserComplaints = async (token) => {
  const response = await fetch(COMPLAINTS_API_URL, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  return response.json();
};
```

### 4. Configure Database Tables

#### 4.1 Create Complaints Table
Use the `run-raw-sql` tool to create the complaints table:

```sql
CREATE TABLE complaints (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  status VARCHAR(50) DEFAULT 'pending',
  evidence_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 4.2 Create Additional Tables as Needed
Create tables for:
- Officer assignments
- Complaint status history
- Citizen reputation scores
- Analytics data

### 5. Configure OAuth Providers (Optional)

#### 5.1 Google OAuth
Update the Google OAuth configuration in InsForge:

```bash
# This would be done through the InsForge dashboard or MCP tools
# Set Google OAuth client ID and redirect URI
```

#### 5.2 Update Frontend OAuth Integration
Modify your OAuth integration to work with InsForge:

```javascript
// src/components/Auth/Login.js
const handleGoogleLogin = async () => {
  setLoading(true);
  setError('');
  
  try {
    const client = createClient({ 
      baseUrl: process.env.REACT_APP_INSFORGE_URL 
    });
    
    const { data, error } = await client.auth.signInWithOAuth({
      provider: 'google',
      redirectTo: window.location.origin + '/auth/callback',
      skipBrowserRedirect: true
    });
    
    if (error) throw error;
    
    if (data?.url) {
      window.location.href = data.url;
    }
  } catch (err) {
    setError('Google login failed. Please try again.');
  } finally {
    setLoading(false);
  }
};
```

## 🛠️ Environment Configuration

### Vercel Environment Variables
Add these to your Vercel project settings:

```
REACT_APP_INSFORGE_URL=https://89gp4et3.us-east.insforge.app
REACT_APP_GOOGLE_CLIENT_ID=your-google-client-id  # If using Google OAuth
```

### Local Development Environment
Create a `.env.local` file in your project root:

```
REACT_APP_INSFORGE_URL=https://89gp4et3.us-east.insforge.app
REACT_APP_GOOGLE_CLIENT_ID=your-google-client-id
```

## 🧪 Testing the Deployment

### 1. Authentication Testing
- [ ] User registration
- [ ] Email/password login
- [ ] Google OAuth login (if configured)
- [ ] Profile management

### 2. Complaint Management Testing
- [ ] Create new complaint
- [ ] View user complaints
- [ ] Upload evidence files
- [ ] Track complaint status

### 3. AI Features Testing
- [ ] AI chat functionality
- [ ] Voice complaint processing
- [ ] Multilingual support

## 📈 Monitoring and Maintenance

### 1. Monitoring
- Use InsForge dashboard for:
  - Database performance
  - Storage usage
  - Function invocation metrics
  - Error tracking

### 2. Maintenance
- Regular database backups
- Storage cleanup for old files
- Function updates for new features
- Security audits

## 🔒 Security Best Practices

### 1. Authentication Security
- Use HTTPS for all communications
- Implement proper JWT token handling
- Regularly rotate API keys
- Use secure password policies

### 2. Data Security
- Encrypt sensitive data at rest
- Use private storage buckets
- Implement proper access controls
- Regular security audits

## 🆘 Troubleshooting

### Common Issues

1. **Authentication Failures**
   - Check API key configuration
   - Verify user credentials
   - Ensure proper token handling

2. **Database Connection Issues**
   - Verify table schemas
   - Check foreign key constraints
   - Review query syntax

3. **Storage Access Problems**
   - Verify bucket permissions
   - Check file upload limits
   - Validate authentication tokens

4. **AI Service Errors**
   - Check model availability
   - Verify API quotas
   - Review request formatting

## 🎯 Final Outcome

When deployment is complete, your GramSetu AI application will have:

- **Frontend**: React app on Vercel (already deployed)
- **Backend**: InsForge services (authentication, database, storage, AI)
- **Storage**: Private buckets for user files and complaint evidence
- **Authentication**: Email/password and OAuth support
- **API**: Edge functions for business logic
- **AI**: Gemini and GPT-4 integration
- **All Features**: Fully functional complaint system, AI chat, dashboards, etc.

Your application is accessible at:
https://gramsetu-89lg3uz12-sagars-projects-ca23f511.vercel.app

The InsForge backend provides a more streamlined deployment process and eliminates the need for managing separate Railway services.