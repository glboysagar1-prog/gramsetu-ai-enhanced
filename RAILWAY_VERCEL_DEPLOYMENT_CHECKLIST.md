# GramSetu AI Railway & Vercel Deployment Checklist

This checklist provides a streamlined guide for deploying the GramSetu AI application with:
- Backend services to Railway
- Frontend to Vercel
- Auto-linked environment variables and webhooks

## Pre-Deployment Preparation

### [ ] Repository Setup
- [ ] Code is committed and pushed to GitHub
- [ ] Repository structure is correct:
  ```
  gramsetu-ai/
  ├── src/                 # React frontend
  ├── replit-backend/      # Node.js auth backend
  ├── services/            # Python Flask complaint backend
  ├── package.json         # Frontend dependencies
  ├── requirements.txt     # Flask backend dependencies
  ├── railway.json         # Railway config for Flask
  ├── replit-backend/railway.json  # Railway config for Node.js
  └── vercel.json          # Vercel configuration
  ```

### [ ] Tools Installation
- [ ] Node.js and npm installed
- [ ] Python 3.8+ installed
- [ ] Git installed
- [ ] Railway CLI installed (`npm install -g @railway/cli`)
- [ ] Vercel CLI installed (`npm install -g vercel`)

## Backend Deployment to Railway

### [ ] Railway Account Setup
- [ ] Login to Railway CLI: `railway login`
- [ ] Verify login: `railway whoami`

### [ ] Flask Backend Deployment
- [ ] Navigate to project root
- [ ] Initialize Railway project: `railway init`
- [ ] Deploy Flask backend: `railway up`
- [ ] Note Flask backend URL: `railway url`
- [ ] Configure environment variables in Railway dashboard:
  - [ ] `PORT=5001`
  - [ ] `FLASK_ENV=production`
  - [ ] `DATABASE_URL` (will be set by PostgreSQL addon)
  - [ ] `JWT_SECRET` (secure random string)
  - [ ] `CORS_ORIGINS` (include Vercel frontend URL)
  - [ ] `OPENAI_API_KEY` (if using AI features)
  - [ ] `THIRDWEB_API_KEY` (if using blockchain features)

### [ ] Node.js Backend Deployment
- [ ] Navigate to `replit-backend` directory
- [ ] Initialize Railway project: `railway init`
- [ ] Deploy Node.js backend: `railway up`
- [ ] Note Node.js backend URL: `railway url`
- [ ] Configure environment variables in Railway dashboard:
  - [ ] `PORT=5003`
  - [ ] `NODE_ENV=production`
  - [ ] `DATABASE_URL` (will be set by PostgreSQL addon)
  - [ ] `INSFORGE_PROJECT_ID`
  - [ ] `INSFORGE_API_KEY`
  - [ ] `INSFORGE_JWT_SECRET`
  - [ ] `GOOGLE_CLIENT_ID` (if using Google OAuth)
  - [ ] `GOOGLE_CLIENT_SECRET` (if using Google OAuth)
  - [ ] `GOOGLE_REDIRECT_URI` (if using Google OAuth)
  - [ ] `CORS_ORIGINS` (include Vercel frontend URL)

### [ ] Database Setup
- [ ] Add PostgreSQL addon to Flask backend project in Railway dashboard
- [ ] Add PostgreSQL addon to Node.js backend project in Railway dashboard
- [ ] Run database migrations for Node.js backend:
  ```bash
  cd replit-backend
  railway run npm run db:push
  cd ..
  ```

## Frontend Deployment to Vercel

### [ ] Vercel Account Setup
- [ ] Login to Vercel CLI: `vercel login`
- [ ] Verify login: `vercel whoami`

### [ ] Frontend Deployment
- [ ] Navigate to project root
- [ ] Build frontend: `npm run build`
- [ ] Deploy to Vercel: `vercel --prod`
- [ ] Note frontend URL

### [ ] Environment Variables Configuration
- [ ] Configure environment variables in Vercel dashboard:
  - [ ] `REACT_APP_API_URL` (Flask backend URL from Railway)
  - [ ] `REACT_APP_AUTH_API_URL` (Node.js backend URL from Railway)
  - [ ] `REACT_APP_GOOGLE_CLIENT_ID` (if using Google OAuth)

## Integration and Testing

### [ ] Cross-Platform Configuration
- [ ] Update CORS settings in both backend services to include Vercel frontend URL
- [ ] Verify webhooks are set up between GitHub, Railway, and Vercel
- [ ] Set up monitoring and alerting if needed

### [ ] Testing
- [ ] Test user registration flow
- [ ] Test user login flow
- [ ] Test Google OAuth flow (if implemented)
- [ ] Test password reset flow
- [ ] Test complaint submission
- [ ] Test AI chat functionality
- [ ] Test role-based access control
- [ ] Test all API endpoints
- [ ] Test responsive design on different devices

## Post-Deployment Tasks

### [ ] Monitoring Setup
- [ ] Set up uptime monitoring for all services
- [ ] Set up performance monitoring
- [ ] Set up error tracking
- [ ] Set up log aggregation

### [ ] Security Verification
- [ ] Verify HTTPS is enabled on all services
- [ ] Verify environment variables are properly secured
- [ ] Verify authentication tokens are properly secured
- [ ] Verify database connections are secure
- [ ] Verify CORS settings are properly configured

### [ ] Documentation
- [ ] Update deployment documentation with actual URLs
- [ ] Update API documentation with production endpoints
- [ ] Update user guides with production URLs
- [ ] Update troubleshooting guides with production-specific issues

## Automated Deployment Scripts

The project includes several automated deployment scripts:

1. **Quick Railway Deployment** (`scripts/quick-deploy-railway.sh`):
   - Deploys both backend services to Railway
   - Requires manual environment variable configuration

2. **Full Stack Deployment** (`scripts/deploy-full-stack.sh`):
   - Deploys backend to Railway and frontend to Vercel
   - Attempts to auto-configure environment variables
   - Requires both Railway and Vercel CLI

3. **InsForge Integrated Deployment** (`scripts/deploy-with-insforge.sh`):
   - Deploys with InsForge MCP integration
   - Requires InsForge configuration

## Troubleshooting Common Issues

### CORS Errors
- Solution: Verify `CORS_ORIGINS` environment variables in both backend services
- Solution: Ensure frontend URL is included in CORS settings

### Database Connection Issues
- Solution: Verify PostgreSQL addons are added to Railway projects
- Solution: Check that `DATABASE_URL` environment variables are set correctly

### Authentication Failures
- Solution: Verify InsForge configuration in Node.js backend
- Solution: Check Google OAuth credentials (if used)

### API Endpoint Issues
- Solution: Verify `REACT_APP_API_URL` and `REACT_APP_AUTH_API_URL` in Vercel
- Solution: Check that backend services are running on Railway

## Useful Commands

### Railway Commands
```bash
railway login          # Login to Railway
railway init           # Initialize Railway project
railway up             # Deploy to Railway
railway logs           # View logs
railway status         # Check status
railway url            # Get project URL
railway variables set KEY=value    # Set environment variable
```

### Vercel Commands
```bash
vercel login           # Login to Vercel
vercel --prod          # Deploy to production
vercel inspect         # Inspect deployment
vercel logs            # View logs
vercel env add KEY     # Add environment variable
```

## References

- [Railway Documentation](https://docs.railway.app)
- [Vercel Documentation](https://vercel.com/docs)
- [GramSetu AI Deployment Instructions](DEPLOYMENT_INSTRUCTIONS.md)
- [Complete Deployment Guide](COMPLETE_DEPLOYMENT_GUIDE.md)