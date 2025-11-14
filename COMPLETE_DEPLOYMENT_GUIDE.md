# Complete Deployment and Management Guide for GramSetu AI

This guide provides step-by-step instructions for deploying your GramSetu AI application to Railway and managing all aspects of the system.

## 🚀 Deployment to Railway

### Prerequisites
- Node.js and npm installed (already verified: v24.10.0)
- Railway CLI installed (already verified: v4.11.0)
- InsForge MCP configured

### Deployment Steps

1. **Login to Railway**
   ```bash
   railway login
   ```
   Complete the login process in your browser.

2. **Deploy Flask Backend**
   ```bash
   # From project root
   railway init
   railway up
   ```

3. **Deploy Replit Backend**
   ```bash
   cd replit-backend
   railway init
   railway up
   cd ..
   ```

4. **Get Deployment URLs**
   ```bash
   # For Flask backend
   railway url
   
   # For Replit backend (from replit-backend directory)
   cd replit-backend && railway url && cd ..
   ```

## 🔐 Authentication Services Management

### InsForge Authentication Configuration

Your InsForge authentication is configured in [replit-backend/insforge.config.ts](file:///Users/sagar/Documents/GramSetu%20AI%20–%20National%20Governance%20Intelligence%20Network/replit-backend/insforge.config.ts):

Key services available:
- JWT-based authentication with 7-day tokens
- Google OAuth login
- Password reset with OTP
- Role-based access control (5 roles)

### Environment Variables for Authentication

Set these in Railway project settings:

```
INSFORGE_PROJECT_ID=your-project-id
INSFORGE_API_KEY=your-api-key
INSFORGE_JWT_SECRET=your-jwt-secret
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

## 🗄️ Database Operations

### Current Database Setup

Your application uses PostgreSQL with Drizzle ORM. The connection is configured in [replit-backend/server/db.ts](file:///Users/sagar/Documents/GramSetu%20AI%20–%20National%20Governance%20Intelligence%20Network/replit-backend/server/db.ts).

### Railway Database Setup

1. **Add PostgreSQL Addon**
   - In Railway dashboard, go to your project
   - Click "Addons" → "Database" → "Add PostgreSQL"

2. **Run Database Migrations**
   ```bash
   cd replit-backend
   railway run npm run db:push
   cd ..
   ```

### Environment Variables for Database

Set in Railway project settings:
```
DATABASE_URL=postgresql://postgres:password@host:5432/database
```

## ⚙️ Environment Variables Configuration

### Required Variables by Service

**Flask Backend:**
```
PORT=5000
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
JWT_SECRET=your-super-secret-jwt-key
OPENAI_API_KEY=your-openai-key (optional)
THIRDWEB_API_KEY=your-thirdweb-key (optional)
```

**Replit Backend:**
```
NODE_ENV=production
PORT=5000
INSFORGE_PROJECT_ID=your-project-id
INSFORGE_API_KEY=your-api-key
INSFORGE_JWT_SECRET=your-jwt-secret
DATABASE_URL=postgresql://...
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### Setting Environment Variables in Railway

1. Go to your Railway project
2. Click "Settings" → "Variables"
3. Add each variable with its value
4. Click "Save"

## 🧪 Testing and CI/CD Pipelines

### Running Tests Locally

**Unit Tests:**
```bash
npm test
```

**End-to-End Tests:**
```bash
npm run test:e2e
```

**Linting:**
```bash
npm run lint
```

**Complete CI Pipeline:**
```bash
npm run test:ci
```

### Stress Testing
```bash
npm run stress-test
```

### Playwright Test Configuration

Tests are configured in [playwright.config.js](file:///Users/sagar/Documents/GramSetu%20AI%20–%20National%20Governance%20Intelligence%20Network/playwright.config.js) and located in [tests/e2e/](file:///Users/sagar/Documents/GramSetu%20AI%20–%20National%20Governance%20Intelligence%20Network/tests/e2e/).

## 🔄 Post-Deployment Configuration

### 1. Add Redis Addon (Optional but Recommended)
- In Railway dashboard, add Redis addon to Flask backend project

### 2. Configure Domain Names (Optional)
- In Railway dashboard, go to project settings
- Add custom domain if needed

### 3. Set Up Health Checks
- Railway automatically monitors health endpoints
- Flask backend: `/healthz`
- Replit backend: Built-in health checks

### 4. Configure Auto-Scaling
- In Railway dashboard, go to project settings
- Configure instance count and auto-scaling rules

## 📊 Monitoring and Maintenance

### Railway Monitoring
- View logs: `railway logs`
- Check metrics in Railway dashboard
- Set up alerts for downtime or performance issues

### Database Maintenance
- Regular backups through Railway
- Monitor connection pool usage
- Optimize queries as needed

### Security Updates
- Railway automatically updates underlying infrastructure
- Update dependencies regularly:
  ```bash
  npm update
  pip freeze > requirements.txt
  ```

## 🆘 Troubleshooting

### Common Issues

1. **Database Connection Errors**
   - Verify DATABASE_URL is correct
   - Check PostgreSQL addon is provisioned
   - Ensure SSL settings are correct

2. **Authentication Issues**
   - Verify JWT_SECRET matches between services
   - Check InsForge credentials
   - Ensure Google OAuth is configured

3. **Deployment Failures**
   - Check build logs: `railway logs`
   - Verify all environment variables are set
   - Check Dockerfile syntax

4. **Performance Issues**
   - Monitor Railway metrics
   - Check database query performance
   - Optimize frontend bundle size

### Getting Help
- Railway documentation: https://docs.railway.app
- InsForge documentation: https://docs.insforge.dev
- Project documentation in `/docs` directory

## 🎯 Next Steps After Deployment

1. **Test All Features**
   - Authentication flows
   - Complaint submission
   - File uploads
   - Analytics dashboard

2. **Configure Production Domains**
   - Set up custom domains
   - Configure SSL certificates

3. **Set Up Monitoring**
   - Configure alerts
   - Set up performance monitoring

4. **Prepare for Scaling**
   - Configure auto-scaling
   - Optimize database queries
   - Implement caching strategies

Your GramSetu AI application is now ready for production deployment with all services properly configured and managed through the InsForge MCP integration!