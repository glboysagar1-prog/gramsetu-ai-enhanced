# Manual Deployment Guide for GramSetu AI

This guide provides step-by-step instructions for manually deploying the GramSetu AI application with backend services to Railway and frontend to Vercel.

## Prerequisites

1. GitHub account
2. Railway account
3. Vercel account
4. Node.js and npm installed
5. Python 3.8+ installed

## Project Structure

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

## Step 1: Prepare Code for Production

### 1.1 Frontend (React) Readiness

1. Ensure the build works:
```bash
cd /path/to/gramsetu-ai
npm install --legacy-peer-deps
npm run build
```

2. Add environment variables with `REACT_APP_*` prefix for runtime keys in Vercel dashboard later.

### 1.2 Node Auth Backend Readiness

1. Navigate to the backend directory:
```bash
cd /path/to/gramsetu-ai/replit-backend
npm install
npm run build
```

### 1.3 Flask Backend Readiness

1. Navigate to the Flask backend:
```bash
cd /path/to/gramsetu-ai
python3 -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

## Step 2: Create Railway Projects & Deploy Backends

### 2.1 Initialize and Deploy Flask Backend

1. Navigate to the Flask backend directory:
```bash
cd /path/to/gramsetu-ai
```

2. Initialize Railway project:
```bash
railway login
railway init
# When prompted, name it e.g., "gramsetu-flask-api"
```

3. Deploy to Railway:
```bash
railway up
FLASK_URL=$(railway url)
echo "Flask URL: $FLASK_URL"
```

### 2.2 Initialize and Deploy Node Auth Backend

1. Navigate to the Node backend directory:
```bash
cd /path/to/gramsetu-ai/replit-backend
```

2. Initialize Railway project:
```bash
railway init
# When prompted, name it e.g., "gramsetu-auth-api"
```

3. Deploy to Railway:
```bash
railway up
AUTH_URL=$(railway url)
echo "Auth URL: $AUTH_URL"
```

## Step 3: Add PostgreSQL Add-on to Railway Projects

### 3.1 Add PostgreSQL Database

1. In Railway web UI:
   - Open one project (e.g., gramsetu-auth-api)
   - Go to Plugins / Add-ons → Add PostgreSQL
   - After adding, click the database and copy the DATABASE_URL

2. Add the same database to the other project:
   - In the other project (e.g., gramsetu-flask-api)
   - Go to Variables and add DATABASE_URL with the same value

### 3.2 Run Database Migrations

For Node.js backend with Drizzle:
```bash
cd /path/to/gramsetu-ai/replit-backend
# Ensure DATABASE_URL is set in your railway variables
npx drizzle-kit push
```

## Step 4: Configure Environment Variables

### 4.1 Flask Backend Variables (Railway Dashboard)

Add these environment variables in the Railway dashboard for your Flask project:
```
PORT=5001
FLASK_ENV=production
DATABASE_URL=<railway_database_url>
JWT_SECRET=<random-hex-32>
CORS_ORIGINS=https://<your-vercel-domain>,http://localhost:3000
```

### 4.2 Node Backend Variables (Railway Dashboard)

Add these environment variables in the Railway dashboard for your Node.js project:
```
PORT=5003
NODE_ENV=production
DATABASE_URL=<same_railway_database_url>
JWT_SECRET=<random-hex-32>
REFRESH_SECRET=<random-hex-32>
GOOGLE_CLIENT_ID=<from_google_cloud_console>
GOOGLE_CLIENT_SECRET=<from_google_cloud_console>
GOOGLE_REDIRECT_URI=https://<your-vercel-domain>/auth/callback/google
CORS_ORIGINS=https://<your-vercel-domain>,http://localhost:3000
```

### 4.3 Generate Secrets

```bash
openssl rand -hex 32
```

## Step 5: Configure Google OAuth (Optional)

### 5.1 Create OAuth Credentials

1. Go to Google Cloud Console → APIs & Services → Credentials → Create OAuth Client ID
2. Application type → Web application
3. Authorized redirect URIs: 
   - `https://<your-vercel-domain>/auth/callback/google`
   - `http://localhost:3000/auth/callback/google` (for local testing)

### 5.2 Add Credentials to Railway

Copy GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET into Railway Node project env vars.

## Step 6: Deploy Frontend to Vercel

### 6.1 Deploy from Project Root

```bash
cd /path/to/gramsetu-ai
vercel login
vercel --prod
```

### 6.2 Add Environment Variables in Vercel Dashboard

Go to your Vercel project → Settings → Environment Variables:
```
REACT_APP_API_URL=https://<flask-railway-url>
REACT_APP_AUTH_API_URL=https://<auth-railway-url>
REACT_APP_GOOGLE_CLIENT_ID=<google_client_id>
```

## Step 7: Configure CORS & Security

In both backends, configure CORS to accept your frontend and local dev:

```javascript
// Express example
const cors = require('cors');
app.use(cors({
  origin: process.env.CORS_ORIGINS.split(','),
  credentials: true
}));
```

Add Helmet for security headers:
```javascript
const helmet = require('helmet');
app.use(helmet());
```

Add rate limiting:
```javascript
const rateLimit = require('express-rate-limit');
app.use(rateLimit({ windowMs: 60*1000, max: 100 }));
```

## Step 8: Smoke Tests and Verification

### 8.1 Test Auth Login
```bash
curl -X POST https://<auth-url>/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@user.in","password":"YourTestPassword"}'
```

### 8.2 Register a User and File a Complaint
```bash
# Register
curl -X POST https://<auth-url>/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Ravi","email":"ravi@demo.in","password":"123456","role":"CITIZEN"}'

# Login to get token
TOKEN=<token-returned>

# File complaint
curl -X POST https://<flask-url>/complaints \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"title":"No water","description":"Tap dry","lat":23.02,"lon":72.58}'
```

## Step 9: Monitoring & Logs

### 9.1 View Railway Logs
```bash
railway logs
# or filter service
railway logs -p gramsetu-auth-api
```

### 9.2 View Vercel Deployments & Logs
```bash
vercel inspect <deployment-url>
```

## Troubleshooting Common Problems

### CORS Errors
- Ensure CORS_ORIGINS includes Vercel domain and http://localhost:3000
- Ensure server sends Access-Control-Allow-Credentials: true if cookies used

### Database Connection Failure
- Confirm DATABASE_URL is set in Railway and that both projects have it
- Check railway logs for DB connection errors and run migrations

### OAuth Redirect Mismatch
- Ensure Google OAuth redirect URL exactly matches the one set in Google Cloud Console

### JWT Authorization Failing
- Confirm JWT_SECRET in Railway env matches code expectation
- Check token issuance and decoding functions

### Railway Deployment Failing
- Consider pushing to GitHub and connecting via Railway UI instead of railway up

## Useful Command Snippets

```bash
# Railway
railway login
cd flask-backend
railway init
railway up

cd ../replit-backend
railway init
railway up

# Add DB via Railway UI then:
export DATABASE_URL="<railway_db_url>"
cd replit-backend
npx drizzle-kit push

# Vercel
cd frontend
vercel --prod

# Logs
railway logs
vercel logs <deployment-url>
```

## Post-Deployment Checklist

- [ ] Frontend loads and animations render
- [ ] Login (email/password) works and returns JWT
- [ ] Google OAuth redirects & logs in users (if configured)
- [ ] Register → complaint → auto-assign works
- [ ] Officer can Accept / Reject / Resolve tasks
- [ ] Collector dashboard returns aggregated stats
- [ ] Files (evidence) upload to configured storage and URLs saved
- [ ] CORS issues: none in browser console
- [ ] Env variables set in Railway & Vercel

Your GramSetu AI application should now be successfully deployed with:
- Flask backend on Railway at: https://<flask-railway-url>
- Node.js backend on Railway at: https://<auth-railway-url>
- React frontend on Vercel at: https://<your-vercel-domain>