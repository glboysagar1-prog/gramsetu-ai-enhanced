# Insforge Integration Plan for GramSetu AI

This document outlines how to integrate Insforge's authentication services with your existing GramSetu AI application.

## Current Architecture

1. **Replit Backend** (Node.js/Express) - Port 5003
   - Authentication (JWT, email/password)
   - File storage
   - User management

2. **Flask Backend** (Python) - Port 5001
   - Complaint management
   - AI processing
   - Analytics

## Insforge Integration Overview

Insforge will replace your current authentication system with:
- JWT-based authentication
- Google OAuth login
- Password reset with OTP
- Role-based access control (RBAC)
- User management

## Integration Steps

### Step 1: Set up Insforge Account

1. Sign up at https://insforge.dev
2. Create a new project
3. Get your project credentials:
   - Project ID
   - API Key
   - JWT Secret

### Step 2: Update Environment Variables

Update your `.env` files with Insforge credentials:

**replit-backend/.env:**
```
# Remove existing Supabase credentials
# Add Insforge credentials
INSFORGE_PROJECT_ID=your-project-id
INSFORGE_API_KEY=your-api-key
INSFORGE_JWT_SECRET=your-jwt-secret
```

**Main .env:**
```
# Add Insforge credentials
INSFORGE_PROJECT_ID=your-project-id
INSFORGE_API_KEY=your-api-key
INSFORGE_JWT_SECRET=your-jwt-secret
```

### Step 3: Install Insforge SDK

**For Replit Backend (Node.js):**
```bash
cd replit-backend
npm install @insforge/sdk
```

**For Flask Backend (Python):**
```bash
pip install insforge-python-sdk
```

### Step 4: Replace Authentication Services

#### Replit Backend Changes

1. **Replace authService.ts** with Insforge authentication
2. **Update authController.ts** to use Insforge SDK
3. **Remove Supabase dependencies** for authentication
4. **Update middleware** to validate Insforge JWT tokens

#### Flask Backend Changes

1. **Add Insforge authentication middleware**
2. **Update user validation** to use Insforge
3. **Implement role-based access control**

### Step 5: Implement Google OAuth

1. **Configure Google OAuth in Insforge dashboard**
2. **Update frontend** to use Insforge OAuth flow
3. **Handle OAuth callbacks** in both backends

### Step 6: Implement Password Reset with OTP

1. **Use Insforge's built-in password reset**
2. **Update frontend forms** to match Insforge flow
3. **Handle OTP verification**

### Step 7: Implement Role-Based Access Control

1. **Define roles in Insforge dashboard:**
   - Citizen
   - Field Worker
   - District Officer
   - State Officer
   - National Admin

2. **Update middleware** to check roles
3. **Modify frontend** to show role-specific UI

### Step 8: Migrate Existing Users

1. **Export users from current system**
2. **Import to Insforge** using bulk import feature
3. **Update user references** in database

## Implementation Timeline

### Phase 1: Setup and Basic Integration (2-3 days)
- Set up Insforge account
- Install SDKs
- Replace basic authentication

### Phase 2: Advanced Features (3-4 days)
- Google OAuth integration
- Password reset with OTP
- Role-based access control

### Phase 3: Migration and Testing (2-3 days)
- User migration
- Testing
- Documentation updates

## Benefits of Insforge Integration

1. **Reduced Maintenance**: No need to manage authentication infrastructure
2. **Enhanced Security**: Professional-grade authentication with regular updates
3. **Scalability**: Built-in scaling for authentication services
4. **Advanced Features**: OAuth, OTP, RBAC out of the box
5. **Developer Experience**: Simplified authentication implementation

## Potential Challenges

1. **User Migration**: Moving existing users to Insforge
2. **Frontend Updates**: Updating authentication flows in React components
3. **Testing**: Ensuring all authentication flows work correctly
4. **Documentation**: Updating internal documentation

## Next Steps

1. Create Insforge account
2. Review current authentication implementation
3. Begin SDK installation and basic integration
4. Test with a small subset of features
5. Gradually migrate all authentication features