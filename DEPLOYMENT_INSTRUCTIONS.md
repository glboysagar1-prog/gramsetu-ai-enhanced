# GramSetu AI Deployment Instructions

This guide provides step-by-step instructions for deploying the GramSetu AI application with:
- Backend services to Railway
- Frontend to Vercel
- Auto-linked environment variables and webhooks between both platforms

## Prerequisites

1. **GitHub Account** - For source code repository
2. **Railway Account** - For backend deployment
3. **Vercel Account** - For frontend deployment
4. **Node.js** (v16 or higher) - For deployment tools
5. **Git** - For version control

## Deployment Architecture

```
GitHub Repository
├── Frontend (React)
└── Backend Services
    ├── Flask Backend (Port 5001) - Complaints & AI
    └── Node.js Backend (Port 5003) - Authentication & Files

Deployment Targets:
├── Railway - Backend Services
│   ├── Flask Backend → gramsetu-flask-api-*.railway.app
│   └── Node.js Backend → gramsetu-auth-api-*.railway.app
└── Vercel - Frontend
    └── React App → gramsetu-frontend-*.vercel.app
```

## Step 1: Prepare GitHub Repository

1. Push your latest code to GitHub:
```bash
git add .
git commit -m "Prepare for deployment"
git push origin main
```

2. Ensure your repository has the following structure:
```
gramsetu-ai/
├── src/                 # React frontend
├── replit-backend/      # Node.js auth backend
├── services/            # Python Flask complaint backend
├── package.json         # Frontend dependencies
├── requirements.txt     # Flask backend dependencies
├── railway.json         # Railway config for Flask
├── replit-backend/railway.json  # Railway config for Node.js
└── README.md
```

## Step 2: Deploy Backend to Railway

### 2.1 Install Railway CLI
```bash
npm install -g @railway/cli
```

### 2.2 Login to Railway
```bash
railway login
```

### 2.3 Deploy Flask Backend (Complaints & AI)
```bash
# Navigate to project root
cd /path/to/gramsetu-ai

# Initialize Railway project
railway init
# When prompted, name it something like "gramsetu-flask-api"

# Deploy the Flask backend
railway up

# Note the URL provided by Railway
FLASK_URL=$(railway url)
echo "Flask Backend URL: $FLASK_URL"
```

### 2.4 Deploy Node.js Backend (Auth & Files)
```bash
# Navigate to replit-backend directory
cd replit-backend

# Initialize Railway project
railway init
# When prompted, name it something like "gramsetu-auth-api"

# Deploy the Node.js backend
railway up

# Note the URL provided by Railway
AUTH_URL=$(railway url)
echo "Auth Backend URL: $AUTH_URL"

# Return to project root
cd ..
```

## Step 3: Configure Environment Variables in Railway

### 3.1 Flask Backend Environment Variables
In the Railway dashboard for your Flask project, add these environment variables:

```
# Application
PORT=5001
FLASK_ENV=production

# Database (Railway will provide automatically with PostgreSQL addon)
DATABASE_URL=postgresql://postgres:password@host:5432/database

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# AI Services (Optional)
OPENAI_API_KEY=your-openai-api-key
THIRDWEB_API_KEY=your-thirdweb-api-key

# CORS
CORS_ORIGINS=https://your-frontend-domain.vercel.app,http://localhost:3000
```

### 3.2 Node.js Backend Environment Variables
In the Railway dashboard for your Node.js project, add these environment variables:

```
# Application
PORT=5003
NODE_ENV=production

# InsForge Configuration
INSFORGE_PROJECT_ID=your-insforge-project-id
INSFORGE_API_KEY=your-insforge-api-key
INSFORGE_JWT_SECRET=your-insforge-jwt-secret

# Google OAuth (Optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=https://your-frontend-domain.vercel.app/auth/callback/google

# Database (Railway will provide automatically with PostgreSQL addon)
DATABASE_URL=postgresql://postgres:password@host:5432/database

# CORS
CORS_ORIGINS=https://your-frontend-domain.vercel.app,http://localhost:3000
```

## Step 4: Add Database Addons in Railway

### 4.1 Add PostgreSQL to Both Projects
1. In Railway dashboard for each project:
   - Click "Settings" → "Add-ons"
   - Add "PostgreSQL" addon
   - Railway will automatically set the DATABASE_URL environment variable

### 4.2 Run Database Migrations (Node.js Backend)
```bash
cd replit-backend
railway run npm run db:push
cd ..
```

## Step 5: Deploy Frontend to Vercel

### 5.1 Install Vercel CLI
```bash
npm install -g vercel
```

### 5.2 Login to Vercel
```bash
vercel login
```

### 5.3 Deploy Frontend
```bash
# From project root
vercel --prod
```

When prompted:
- Set up and deploy? `Y`
- Which scope? Select your Vercel account
- Link to existing project? `N`
- What's your project's name? `gramsetu-frontend`
- In which directory is your code located? `./`
- Want to override the settings? `N`

## Step 6: Configure Environment Variables in Vercel

In the Vercel dashboard for your frontend project, add these environment variables:

```
# Backend API URLs (from Railway deployment)
REACT_APP_API_URL=https://your-flask-backend-url.up.railway.app
REACT_APP_AUTH_API_URL=https://your-auth-backend-url.up.railway.app

# Optional: Google OAuth Client ID
REACT_APP_GOOGLE_CLIENT_ID=your-google-client-id
```

## Step 7: Set Up Webhooks Between Platforms

### 7.1 GitHub Webhooks for Railway
Railway automatically sets up GitHub webhooks when you link your repository.

### 7.2 GitHub Webhooks for Vercel
Vercel automatically sets up GitHub webhooks when you link your repository.

### 7.3 Cross-Platform Webhooks
To enable communication between Railway services and Vercel:

1. In Railway dashboard for Flask backend:
   - Add environment variable:
     ```
     VERCEL_FRONTEND_URL=https://your-frontend-domain.vercel.app
     ```

2. In Railway dashboard for Node.js backend:
   - Add environment variable:
     ```
     VERCEL_FRONTEND_URL=https://your-frontend-domain.vercel.app
     ```

## Step 8: Configure CORS Settings

Ensure CORS is properly configured in both backend services:

### 8.1 Flask Backend (app.py)
```python
from flask_cors import CORS

app = Flask(__name__)
CORS(app, origins=[
    "https://your-frontend-domain.vercel.app",
    "http://localhost:3000"
])
```

### 8.2 Node.js Backend (server setup)
```javascript
const cors = require('cors');

app.use(cors({
  origin: [
    'https://your-frontend-domain.vercel.app',
    'http://localhost:3000'
  ],
  credentials: true
}));
```

## Step 9: Final Testing

1. Visit your Vercel frontend URL
2. Test authentication flows
3. Test complaint submission
4. Test AI chat functionality
5. Verify all API endpoints are working

## Troubleshooting

### Common Issues

1. **CORS Errors**:
   - Ensure CORS_ORIGINS environment variables are set correctly
   - Verify frontend URL matches exactly in backend CORS configuration

2. **Database Connection Issues**:
   - Check that PostgreSQL addons are added to Railway projects
   - Verify DATABASE_URL environment variables are set

3. **Authentication Failures**:
   - Ensure INSFORGE_* environment variables are set correctly
   - Check that Google OAuth credentials are correct (if used)

4. **API Endpoint Issues**:
   - Verify REACT_APP_API_URL and REACT_APP_AUTH_API_URL in Vercel
   - Check that backend services are running on Railway

### Useful Commands

```bash
# Check Railway logs
railway logs

# Run commands in Railway environment
railway run <command>

# Check Railway status
railway status

# Check Vercel deployment status
vercel inspect
```

## Maintenance

### Updating Deployments

1. Push changes to GitHub:
```bash
git add .
git commit -m "Update deployment"
git push origin main
```

2. Railway will automatically redeploy on push (if auto-deploy is enabled)

3. For Vercel manual deployment:
```bash
vercel --prod
```

### Environment Management

- Use Railway's environment feature for different deployment stages (dev, staging, prod)
- Use Vercel's preview deployments for pull requests
- Keep sensitive environment variables in platform dashboards, not in code

## Security Best Practices

1. Never commit sensitive environment variables to GitHub
2. Use Railway and Vercel's secret management for sensitive data
3. Regularly rotate API keys and secrets
4. Enable HTTPS for all services (automatically provided by Railway and Vercel)
5. Implement proper authentication and authorization in backend services

## Monitoring and Analytics

- Use Railway's built-in monitoring for backend services
- Use Vercel's analytics for frontend performance
- Implement application-level logging in backend services
- Set up error tracking with services like Sentry (optional)

## Support

For deployment issues:
1. Check platform-specific documentation:
   - [Railway Docs](https://docs.railway.app)
   - [Vercel Docs](https://vercel.com/docs)
2. Review application logs in respective platforms
3. Contact platform support if needed