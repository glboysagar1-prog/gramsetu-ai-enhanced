# Insforge Migration Guide

This guide will help you migrate your existing authentication system to Insforge.

## Current System Overview

Your current system uses:
1. **Replit Backend** (Node.js/Express) - Custom JWT authentication with Supabase
2. **Flask Backend** (Python) - Unknown authentication system (no clear implementation found)

## Migration Steps

### Phase 1: Setup and Configuration

1. **Create Insforge Account**
   - Sign up at https://insforge.dev
   - Create a new project
   - Get your project credentials

2. **Update Environment Variables**

   **Replit Backend (.env):**
   ```
   # Remove existing Supabase credentials
   # INSFORGE_PROJECT_ID=your-project-id
   # INSFORGE_API_KEY=your-api-key
   # INSFORGE_JWT_SECRET=your-jwt-secret
   # GOOGLE_CLIENT_ID=your-google-client-id
   # GOOGLE_CLIENT_SECRET=your-google-client-secret
   ```

   **Flask Backend (.env):**
   ```
   # INSFORGE_PROJECT_ID=your-project-id
   # INSFORGE_API_KEY=your-api-key
   # INSFORGE_JWT_SECRET=your-jwt-secret
   ```

3. **Install Dependencies**

   **Replit Backend:**
   ```bash
   cd replit-backend
   npm install axios
   ```

   **Flask Backend:**
   ```bash
   pip install requests
   ```

### Phase 2: Replace Authentication Services

#### Replit Backend Migration

1. **Replace authService.ts**
   - Keep your existing [insforgeAuthService.ts](file:///Users/sagar/Documents/GramSetu%20AI%20–%20National%20Governance%20Intelligence%20Network/replit-backend/server/services/insforgeAuthService.ts) as the new authentication service
   - Remove the old [authService.ts](file:///Users/sagar/Documents/GramSetu%20AI%20–%20National%20Governance%20Intelligence%20Network/replit-backend/server/services/authService.ts)

2. **Replace authController.ts**
   - Keep your existing [insforgeAuthController.ts](file:///Users/sagar/Documents/GramSetu%20AI%20–%20National%20Governance%20Intelligence%20Network/replit-backend/server/controllers/insforgeAuthController.ts) as the new authentication controller
   - Remove the old [authController.ts](file:///Users/sagar/Documents/GramSetu%20AI%20–%20National%20Governance%20Intelligence%20Network/replit-backend/server/controllers/authController.ts)

3. **Update Routes**
   - Your [routes.ts](file:///Users/sagar/Documents/GramSetu%20AI%20–%20National%20Governance%20Intelligence%20Network/replit-backend/server/routes.ts) has already been updated to use Insforge controllers

4. **Update Middleware**
   - Your [insforgeAuth.ts](file:///Users/sagar/Documents/GramSetu%20AI%20–%20National%20Governance%20Intelligence%20Network/replit-backend/server/middleware/insforgeAuth.ts) replaces the old authentication middleware

#### Flask Backend Migration

1. **Integrate insforge_auth_service.py**
   - Add the new [insforge_auth_service.py](file:///Users/sagar/Documents/GramSetu%20AI%20–%20National%20Governance%20Intelligence%20Network/services/insforge_auth_service.py) to your services
   - Use the decorators in your existing routes

2. **Update Existing Routes**
   - Replace authentication logic in your existing routes with Insforge decorators
   - Example:
     ```python
     # Before
     @app.route('/api/complaints')
     def get_complaints():
         # Custom auth logic
         pass
     
     # After
     @app.route('/api/complaints')
     @require_auth
     @require_citizen
     def get_complaints():
         # User data available in g.current_user
         pass
     ```

### Phase 3: Frontend Updates

1. **Update Authentication API Calls**
   - Change endpoints to match Insforge API
   - Update token handling

2. **Add Google OAuth Integration**
   - Implement Google login flow
   - Handle OAuth callbacks

3. **Update Password Reset Flow**
   - Implement OTP-based password reset
   - Update UI for OTP verification

### Phase 4: User Migration

1. **Export Existing Users**
   - Export user data from current system
   - Format for Insforge import

2. **Import Users to Insforge**
   - Use Insforge's bulk import feature
   - Map roles correctly

3. **Update References**
   - Update any database references to use Insforge user IDs
   - Update file ownership if needed

### Phase 5: Testing

1. **Unit Testing**
   - Test authentication flows
   - Test role-based access control

2. **Integration Testing**
   - Test end-to-end authentication
   - Test cross-backend authentication

3. **User Acceptance Testing**
   - Test with existing users
   - Verify role permissions

## API Endpoint Changes

### Replit Backend (Auth API)

**New Endpoints:**
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - Email/password login
- `POST /api/auth/google` - Google OAuth login
- `POST /api/auth/password-reset/send-otp` - Send password reset OTP
- `POST /api/auth/password-reset/verify-otp` - Verify password reset OTP
- `POST /api/auth/password-reset/reset` - Reset password
- `GET /api/auth/profile` - Get user profile

### Flask Backend

**Integration Pattern:**
```python
from services.insforge_auth_service import require_auth, require_citizen

@app.route('/api/complaints')
@require_auth
@require_citizen
def get_complaints():
    # User data available in g.current_user
    user = g.current_user
    # Your existing logic
```

## Environment Variables

### Required Variables

**Replit Backend:**
```
INSFORGE_PROJECT_ID=your-project-id
INSFORGE_API_KEY=your-api-key
INSFORGE_JWT_SECRET=your-jwt-secret
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

**Flask Backend:**
```
INSFORGE_PROJECT_ID=your-project-id
INSFORGE_API_KEY=your-api-key
INSFORGE_JWT_SECRET=your-jwt-secret
```

## Role Mapping

Your existing roles map to Insforge as follows:

| Current Role | Insforge Role |
|--------------|---------------|
| Citizen | citizen |
| Field Worker | field-worker |
| District Officer | district-officer |
| State Officer | state-officer |
| National Admin | national-admin |

## Testing Checklist

- [ ] User registration with email/password
- [ ] User login with email/password
- [ ] Google OAuth login
- [ ] Password reset with OTP
- [ ] Role-based access control
- [ ] Token verification
- [ ] Cross-backend authentication
- [ ] User profile retrieval
- [ ] Existing user data migration

## Rollback Plan

If issues occur during migration:

1. **Revert to Backup**
   - Restore database from backup
   - Revert code changes

2. **Fallback to Current System**
   - Temporarily disable Insforge integration
   - Re-enable Supabase authentication

3. **Gradual Rollout**
   - Migrate users in batches
   - Monitor for issues

## Support

For issues during migration:
1. Check Insforge documentation
2. Contact Insforge support
3. Review this migration guide
4. Test with staging environment first