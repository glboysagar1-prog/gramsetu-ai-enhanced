# Railway Web UI Deployment Guide for GramSetu AI

This guide provides detailed instructions for deploying the GramSetu AI backend services to Railway using the web UI, which is often more reliable than the CLI when facing authentication issues.

## Prerequisites

1. GitHub account
2. Railway account (sign up at https://railway.app/)
3. Vercel account (you already have this since frontend is deployed)
4. Access to the GramSetu AI GitHub repository

## Deployment Architecture

```
Railway Projects:
├── gramsetu-flask-api     # Flask backend (Port 5001)
├── gramsetu-auth-api      # Node.js backend (Port 5003)
└── gramsetu-database      # Shared PostgreSQL database

Vercel Project:
└── gramsetu-frontend      # React frontend (already deployed)
```

## Step 1: Create Railway Projects via Web UI

### 1.1 Create Flask Backend Project

1. Go to https://railway.app/ and log in to your account
2. Click "New Project" → "Empty Project"
3. Name it: `gramsetu-flask-api`
4. Click "Create Project"

### 1.2 Create Node.js Backend Project

1. Click "New Project" → "Empty Project" again
2. Name it: `gramsetu-auth-api`
3. Click "Create Project"

### 1.3 Create Shared Database Project

1. Click "New Project" → "Empty Project"
2. Name it: `gramsetu-database`
3. Click "Create Project"

## Step 2: Deploy Flask Backend via GitHub Integration

### 2.1 Connect GitHub Repository

1. In the `gramsetu-flask-api` project:
   - Click "Connect Repo"
   - Select your GramSetu AI repository
   - Choose the correct branch (usually `main` or `master`)

### 2.2 Configure Service Settings

1. Railway should auto-detect the Flask app
2. If not, manually configure:
   - **Root Directory**: `/` (project root)
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn --bind 0.0.0.0:$PORT app:app`

### 2.3 Set Environment Variables

In the `gramsetu-flask-api` project, go to Settings → Variables and add:

```
PORT=5001
FLASK_ENV=production
JWT_SECRET=your-super-secret-jwt-key-change-in-production
CORS_ORIGINS=https://gramsetu-89lg3uz12-sagars-projects-ca23f511.vercel.app,http://localhost:3000
```

(Note: Generate a secure JWT_SECRET using `openssl rand -hex 32`)

## Step 3: Deploy Node.js Backend via GitHub Integration

### 3.1 Connect GitHub Repository

1. In the `gramsetu-auth-api` project:
   - Click "Connect Repo"
   - Select your GramSetu AI repository
   - Choose the correct branch

### 3.2 Configure Service Settings

1. Set the root directory to: `/replit-backend`
2. Railway should auto-detect the Node.js app
3. If not, manually configure:
   - **Root Directory**: `/replit-backend`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`

### 3.3 Set Environment Variables

In the `gramsetu-auth-api` project, go to Settings → Variables and add:

```
PORT=5003
NODE_ENV=production
JWT_SECRET=your-super-secret-jwt-key-change-in-production
REFRESH_SECRET=your-refresh-secret-change-in-production
CORS_ORIGINS=https://gramsetu-89lg3uz12-sagars-projects-ca23f511.vercel.app,http://localhost:3000
```

(Note: Generate secure secrets using `openssl rand -hex 32`)

## Step 4: Set Up Shared PostgreSQL Database

### 4.1 Add PostgreSQL Add-on

1. In the `gramsetu-database` project:
   - Go to Settings → Add-ons
   - Click "Add PostgreSQL"
   - Wait for it to provision

### 4.2 Get Database Connection String

1. Once provisioned, click on the PostgreSQL add-on
2. Copy the `DATABASE_URL` connection string

### 4.3 Share Database with Backend Services

1. In the `gramsetu-flask-api` project:
   - Go to Settings → Variables
   - Add `DATABASE_URL` with the copied connection string

2. In the `gramsetu-auth-api` project:
   - Go to Settings → Variables
   - Add `DATABASE_URL` with the same copied connection string

## Step 5: Configure InsForge Integration (Optional)

If you're using InsForge services, add these variables to the `gramsetu-auth-api` project:

```
INSFORGE_PROJECT_ID=your-insforge-project-id
INSFORGE_API_KEY=your-insforge-api-key
INSFORGE_JWT_SECRET=your-insforge-jwt-secret
```

## Step 6: Configure Google OAuth (Optional)

If you want to enable Google OAuth, add these variables to the `gramsetu-auth-api` project:

```
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=https://gramsetu-89lg3uz12-sagars-projects-ca23f511.vercel.app/auth/callback/google
```

## Step 7: Run Database Migrations

### 7.1 Using Railway Console

1. In the `gramsetu-auth-api` project:
   - Go to the Deployments tab
   - Click on the latest deployment
   - Click "Console" at the top
   - Run the migration command:
     ```bash
     npx drizzle-kit push
     ```

## Step 8: Update Vercel Environment Variables

### 8.1 Get Backend URLs

1. In the `gramsetu-flask-api` project:
   - Go to Settings → Domains
   - Copy the default domain (e.g., `gramsetu-flask-api.up.railway.app`)

2. In the `gramsetu-auth-api` project:
   - Go to Settings → Domains
   - Copy the default domain (e.g., `gramsetu-auth-api.up.railway.app`)

### 8.2 Update Vercel Variables

1. Go to your Vercel project dashboard
2. Go to Settings → Environment Variables
3. Add or update these variables:
   ```
   REACT_APP_API_URL=https://<your-flask-railway-url>
   REACT_APP_AUTH_API_URL=https://<your-auth-railway-url>
   ```

## Step 9: Redeploy Frontend

After updating the environment variables in Vercel:

1. Go to your Vercel project dashboard
2. Go to the "Deployments" tab
3. Click "Redeploy" for the latest deployment
4. Or trigger a new deployment by pushing a small change to your GitHub repository

## Step 10: Verification and Testing

### 10.1 Check Service Status

1. In Railway, check that both backend services are running
2. Check the logs for any errors

### 10.2 Test API Endpoints

1. Test the Flask backend:
   ```bash
   curl https://<your-flask-railway-url>/health
   ```

2. Test the Node.js backend:
   ```bash
   curl https://<your-auth-railway-url>/health
   ```

### 10.3 Test Frontend Integration

1. Visit your Vercel frontend URL
2. Try to log in or register a new user
3. Test the complaint submission flow

## Troubleshooting Common Issues

### Database Connection Issues

1. Ensure DATABASE_URL is set correctly in both backend projects
2. Check that the PostgreSQL add-on is properly provisioned
3. Verify network access between services and database

### CORS Errors

1. Ensure CORS_ORIGINS includes your Vercel domain
2. Check that the frontend URL matches exactly (including https://)

### Authentication Failures

1. Verify JWT_SECRET is the same in both backend services
2. Check that environment variables are set correctly

### Deployment Failures

1. Check build logs for dependency installation errors
2. Ensure the root directory is set correctly for each service
3. Verify that the start commands are correct

## Useful Railway Web UI Features

### Logs and Monitoring

1. View real-time logs for each service
2. Monitor resource usage
3. Set up alerts for service downtime

### Environment Management

1. Use Railway's environment feature for different deployment stages
2. Easily switch between development, staging, and production configurations

### Scaling

1. Configure auto-scaling based on demand
2. Set resource limits for each service

## Security Best Practices

1. Never commit secrets to GitHub
2. Use Railway's secrets management for sensitive data
3. Regularly rotate API keys and secrets
4. Enable HTTPS (automatically provided by Railway)
5. Implement proper authentication and authorization

## Next Steps

1. Set up custom domains if needed
2. Configure monitoring and alerting
3. Set up backup and disaster recovery procedures
4. Implement CI/CD for automated deployments
5. Add performance monitoring tools

Your GramSetu AI application should now be fully deployed with:
- Flask backend on Railway
- Node.js backend on Railway
- Shared PostgreSQL database on Railway
- React frontend on Vercel
- All services properly interconnected