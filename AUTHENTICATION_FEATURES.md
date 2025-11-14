# GramSetu AI Authentication System

This document describes the complete authentication system implemented for GramSetu AI using InsForge integration.

## Features Implemented

### 1. JWT Authentication
- Secure token-based authentication using JSON Web Tokens
- Token expiration and automatic refresh
- Local storage for persistent sessions
- Role-based access control (RBAC)

### 2. Google OAuth Integration
- Single Sign-On (SSO) with Google accounts
- Secure token exchange
- Automatic user role assignment
- Redirect handling for authentication flow

### 3. Password Reset with OTP
- Secure password reset flow with One-Time Password (OTP)
- Email-based OTP delivery
- OTP expiration (5 minutes)
- Password strength validation
- Multi-step verification process

### 4. Role-Based Access Control (RBAC)
- Five distinct user roles:
  - Citizen
  - Field Officer
  - District Officer
  - State Officer
  - National Admin
- Hierarchical permissions (higher roles inherit lower role permissions)
- National Admin has access to all system features

### 5. User Registration
- Role-specific signup process
- Password strength requirements
- Email validation
- Automatic login after registration

## Implementation Details

### Frontend Components

1. **Login Component** (`src/components/Auth/Login.js`)
   - Role selection interface
   - Credential-based login
   - Google OAuth button
   - Demo credentials display
   - Password visibility toggle

2. **Signup Component** (`src/components/Auth/Signup.js`)
   - Role-specific registration
   - Form validation
   - Password confirmation
   - Real-time feedback

3. **Password Reset Component** (`src/components/Auth/PasswordReset.js`)
   - Three-step reset process:
     1. Request OTP
     2. Verify OTP
     3. Set new password
   - Email validation
   - Password strength enforcement

4. **Google Callback Component** (`src/components/Auth/GoogleCallback.js`)
   - Handles OAuth redirect
   - Token exchange
   - User authentication
   - Role-based redirection

5. **Auth Context** (`src/contexts/AuthContext.js`)
   - Centralized authentication state management
   - Token storage and retrieval
   - User role checking functions
   - Session persistence

### Backend Integration

The authentication system integrates with InsForge's backend services through the following API endpoints:

#### Authentication Endpoints
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - Credential-based login
- `POST /api/auth/google` - Google OAuth login
- `POST /api/auth/password-reset/send-otp` - Request password reset OTP
- `POST /api/auth/password-reset/verify-otp` - Verify password reset OTP
- `POST /api/auth/password-reset/reset` - Reset password
- `GET /api/auth/profile` - Get user profile

#### Role-Based Access Control
- Middleware for authentication verification
- Role-specific route protection
- Hierarchical permission system
- National Admin override for all roles

### Security Features

1. **Token Security**
   - JWT with HS256 algorithm
   - 7-day token expiration
   - Secure storage in localStorage
   - Automatic logout on token expiration

2. **Password Security**
   - Minimum 6-character requirement
   - Confirmation validation
   - No plain-text storage

3. **OTP Security**
   - 6-digit codes
   - 5-minute expiration
   - 3 attempt limit
   - Automatic invalidation after use

4. **OAuth Security**
   - Secure token exchange
   - Redirect URI validation
   - Access token revocation

### User Roles and Permissions

| Role | Permissions |
|------|-------------|
| Citizen | File complaints, view personal complaints, access AI chat |
| Field Officer | All Citizen permissions + resolve assigned complaints, update complaint status |
| District Officer | All Field Officer permissions + view district analytics, manage field officers |
| State Officer | All District Officer permissions + state-level analytics, manage district officers |
| National Admin | All permissions + system administration, user management, national analytics |

## Integration with InsForge

The authentication system leverages InsForge's backend services for:

1. **User Management**
   - User registration and storage
   - Profile management
   - Role assignment

2. **Authentication Services**
   - JWT token generation and validation
   - OAuth integration
   - Password reset workflows

3. **Security Features**
   - Token expiration handling
   - Password encryption
   - Session management

## API Usage Examples

### Login Request
```javascript
const response = await fetch('/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password123'
  }),
});
```

### Google OAuth Login
```javascript
const response = await fetch('/api/auth/google', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ accessToken: 'google-access-token' }),
});
```

### Password Reset Request
```javascript
const response = await fetch('/api/auth/password-reset/send-otp', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ email: 'user@example.com' }),
});
```

## Environment Variables

The authentication system requires the following environment variables:

```env
INSFORGE_PROJECT_ID=your-project-id
INSFORGE_API_KEY=your-api-key
INSFORGE_JWT_SECRET=your-jwt-secret
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=https://your-domain.com/auth/callback/google
```

## Testing

The authentication system includes:

1. **Unit Tests** for authentication functions
2. **Integration Tests** for API endpoints
3. **End-to-End Tests** for user flows
4. **Security Tests** for token handling

## Future Enhancements

1. **Multi-Factor Authentication (MFA)**
2. **Biometric Authentication**
3. **Session Management Dashboard**
4. **Advanced Password Policies**
5. **Audit Logging**

## Support

For issues with the authentication system, please contact the development team or refer to the InsForge documentation.