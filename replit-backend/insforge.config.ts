// Insforge Configuration for GramSetu AI - Replit Backend
// This file contains the configuration for Insforge integration

export const config = {
  // Project configuration
  projectId: process.env.INSFORGE_PROJECT_ID || 'your-project-id',
  apiKey: process.env.INSFORGE_API_KEY || 'your-api-key',
  jwtSecret: process.env.INSFORGE_JWT_SECRET || 'your-jwt-secret',
  
  // API endpoints
  apiBaseUrl: process.env.INSFORGE_API_BASE_URL || 'https://api.insforge.dev',
  authBaseUrl: process.env.INSFORGE_AUTH_BASE_URL || 'https://auth.insforge.dev',
  
  // JWT configuration
  jwt: {
    issuer: 'insforge',
    audience: 'gramsetu-ai',
    expiresIn: '7d', // 7 days
    algorithm: 'HS256'
  },
  
  // OAuth providers
  oauth: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || 'your-google-client-id',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'your-google-client-secret',
      redirectUri: process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/auth/callback/google'
    }
  },
  
  // OTP configuration
  otp: {
    length: 6,
    expiresIn: 300, // 5 minutes
    maxAttempts: 3
  },
  
  // Roles configuration
  roles: {
    citizen: 'citizen',
    fieldWorker: 'field-worker',
    districtOfficer: 'district-officer',
    stateOfficer: 'state-officer',
    nationalAdmin: 'national-admin'
  },
  
  // Frontend URLs
  frontend: {
    baseUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
    loginPath: '/login',
    resetPasswordPath: '/reset-password',
    verifyOtpPath: '/verify-otp'
  }
};