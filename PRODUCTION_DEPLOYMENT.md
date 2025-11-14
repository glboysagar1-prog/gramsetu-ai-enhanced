# 🚀 GramSetu AI - Production Deployment Guide

Complete guide for deploying both backends to production.

---

## 📋 Table of Contents

1. [Deployment Architecture](#deployment-architecture)
2. [Deploy Replit Backend (Node.js)](#deploy-replit-backend)
3. [Deploy Flask Backend (Python)](#deploy-flask-backend)
4. [Deploy React Frontend](#deploy-react-frontend)
5. [Post-Deployment Configuration](#post-deployment)

---

## 🏗️ Deployment Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    PRODUCTION SETUP                      │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Frontend (Vercel/Netlify)                              │
│  └─> https://gramsetu.vercel.app                        │
│       │                                                  │
│       ├──> Replit Backend (Railway/Render)              │
│       │    └─> https://gramsetu-auth.railway.app        │
│       │        • Authentication (Supabase)               │
│       │        • File Management                         │
│       │        • Analytics                               │
│       │                                                  │
│       └──> Flask Backend (Railway/Render)               │
│            └─> https://gramsetu-api.railway.app         │
│                • Complaint Management                    │
│                • AI Classification                       │
│                • CRS System                              │
│                • Blockchain Audit                        │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

## 🔵 Deploy Replit Backend (Node.js)

### **Option 1: Railway** (Recommended - Free tier available)

#### Step 1: Prepare for Deployment

1. **Create `Dockerfile` for Replit Backend:**

```dockerfile
# Save as: replit-backend/Dockerfile
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Expose port
EXPOSE 5000

# Start the server
CMD ["npm", "start"]
```

2. **Create `.dockerignore`:**

```
# Save as: replit-backend/.dockerignore
node_modules
.git
.env
*.log
dist
```

#### Step 2: Deploy to Railway

1. **Visit** [https://railway.app](https://railway.app)
2. **Sign up** with GitHub
3. **New Project** → **Deploy from GitHub repo**
4. **Select** your repository
5. **Set Root Directory**: `replit-backend`
6. **Add Environment Variables**:
   ```
   NODE_ENV=production
   PORT=5000
   SUPABASE_URL=your-supabase-url
   SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_KEY=your-service-key
   DATABASE_URL=postgresql://...  (Railway provides this)
   ```
7. **Deploy** → Railway auto-deploys!
8. **Get your URL**: `https://your-app.up.railway.app`

#### Step 3: Set Up Database

```bash
# Railway automatically provisions PostgreSQL
# Run migrations:
railway run npm run db:push
```

---

### **Option 2: Render**

1. **Visit** [https://render.com](https://render.com)
2. **New** → **Web Service**
3. **Connect GitHub** repository
4. **Settings**:
   - **Root Directory**: `replit-backend`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Environment**: Node
5. **Environment Variables**: Same as Railway
6. **Create PostgreSQL Database** (Render provides this)
7. **Deploy**

---

### **Option 3: Vercel** (Serverless)

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Create `vercel.json` in `replit-backend/`**:
   ```json
   {
     "version": 2,
     "builds": [
       {
         "src": "server/index.ts",
         "use": "@vercel/node"
       }
     ],
     "routes": [
       {
         "src": "/api/(.*)",
         "dest": "server/index.ts"
       }
     ],
     "env": {
       "NODE_ENV": "production"
     }
   }
   ```

3. **Deploy**:
   ```bash
   cd replit-backend
   vercel --prod
   ```

4. **Add Environment Variables** in Vercel Dashboard

---

## 🐍 Deploy Flask Backend (Python)

### **Option 1: Railway** (Recommended)

#### Step 1: Create Dockerfile

```dockerfile
# Save as: Dockerfile.flask
FROM python:3.13-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application
COPY app.py .
COPY config.py .
COPY services/ ./services/
COPY utils/ ./utils/
COPY mocks/ ./mocks/

# Create necessary directories
RUN mkdir -p uploads/audio logs

# Expose port
EXPOSE 5000

# Start the application
CMD ["python", "app.py"]
```

#### Step 2: Update `requirements.txt`

```txt
# Save as: requirements.txt
Flask==2.3.3
flask-cors==4.0.0
transformers==4.57.1
sentence-transformers==5.1.2
torch==2.9.0
numpy==2.3.4
scikit-learn==1.7.2
gunicorn==21.2.0
```

#### Step 3: Create `Procfile`

```
# Save as: Procfile
web: gunicorn --bind 0.0.0.0:$PORT --workers 2 --timeout 120 app:app
```

#### Step 4: Deploy to Railway

1. **New Project** on Railway
2. **Deploy from GitHub**
3. **Select** main repository
4. **Root Directory**: `.` (project root)
5. **Add Environment Variables**:
   ```
   PORT=5000
   FLASK_ENV=production
   DB_PATH=/app/gramsetu_ai.db
   ```
6. **Deploy**

---

### **Option 2: Render**

1. **New** → **Web Service**
2. **Build Command**: `pip install -r requirements.txt`
3. **Start Command**: `gunicorn --bind 0.0.0.0:$PORT app:app`
4. **Environment Variables**: Same as Railway
5. **Deploy**

---

### **Option 3: PythonAnywhere**

1. **Sign up** at [https://www.pythonanywhere.com](https://www.pythonanywhere.com)
2. **Upload code** via Git or Files tab
3. **Create virtual environment**:
   ```bash
   mkvirtualenv --python=/usr/bin/python3.10 gramsetu
   pip install -r requirements.txt
   ```
4. **Configure WSGI**:
   ```python
   import sys
   path = '/home/yourusername/gramsetu-ai'
   if path not in sys.path:
       sys.path.append(path)
   
   from app import app as application
   ```
5. **Reload** web app

---

## ⚛️ Deploy React Frontend

### **Option 1: Vercel** (Recommended)

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Create `.env.production`**:
   ```env
   REACT_APP_REPLIT_API_URL=https://your-replit-backend.railway.app
   REACT_APP_FLASK_API_URL=https://your-flask-backend.railway.app
   ```

3. **Deploy**:
   ```bash
   vercel --prod
   ```

Or **connect GitHub** on Vercel Dashboard for auto-deploy.

---

### **Option 2: Netlify**

1. **Visit** [https://netlify.com](https://netlify.com)
2. **New site from Git**
3. **Build settings**:
   - **Build command**: `npm run build`
   - **Publish directory**: `build`
4. **Environment variables**: Add API URLs
5. **Deploy**

---

### **Option 3: GitHub Pages**

1. **Install** `gh-pages`:
   ```bash
   npm install --save-dev gh-pages
   ```

2. **Add to `package.json`**:
   ```json
   {
     "homepage": "https://yourusername.github.io/gramsetu-ai",
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d build"
     }
   }
   ```

3. **Deploy**:
   ```bash
   npm run deploy
   ```

---

## ⚙️ Post-Deployment Configuration

### 1. **Update Frontend API URLs**

Edit `src/utils/apiConfig.ts`:

```typescript
export const API_CONFIG = {
  REPLIT_BASE_URL: process.env.REACT_APP_REPLIT_API_URL || 'https://gramsetu-auth.railway.app',
  FLASK_BASE_URL: process.env.REACT_APP_FLASK_API_URL || 'https://gramsetu-api.railway.app',
};
```

### 2. **Configure CORS on Backends**

**Replit Backend** - Add to `server/index.ts`:
```typescript
import cors from 'cors';

app.use(cors({
  origin: ['https://gramsetu.vercel.app', 'http://localhost:3000'],
  credentials: true
}));
```

**Flask Backend** - Already configured in `app.py`:
```python
from flask_cors import CORS
CORS(app)  # Already present
```

### 3. **Set Up Supabase Storage**

1. **Go to** Supabase Dashboard → Storage
2. **Create bucket**: `user-files` (Private)
3. **Configure policies** (optional for additional security)

### 4. **Database Migrations**

**Replit Backend**:
```bash
# On Railway/Render console:
npm run db:push
```

**Flask Backend**:
```bash
# Database auto-initializes on first run
# No manual migration needed
```

### 5. **Environment Variables Checklist**

#### Replit Backend:
- ✅ `SUPABASE_URL`
- ✅ `SUPABASE_ANON_KEY`
- ✅ `SUPABASE_SERVICE_KEY`
- ✅ `DATABASE_URL`
- ✅ `NODE_ENV=production`

#### Flask Backend:
- ✅ `PORT`
- ✅ `FLASK_ENV=production`
- ✅ `DB_PATH`

#### React Frontend:
- ✅ `REACT_APP_REPLIT_API_URL`
- ✅ `REACT_APP_FLASK_API_URL`

---

## 🔍 Testing Production Deployment

### Test Replit Backend:

```bash
# Health check
curl https://your-replit-backend.railway.app/api/auth/signup \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@example.com","password":"test123"}'
```

### Test Flask Backend:

```bash
# Health check
curl https://your-flask-backend.railway.app/api/dashboard

# Submit complaint
curl https://your-flask-backend.railway.app/api/complaint \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"text":"Test complaint","citizen_id":"TEST001"}'
```

---

## 📊 Monitoring & Logs

### Railway:
- **View logs**: Railway Dashboard → Your Service → Logs
- **Metrics**: Built-in CPU/Memory monitoring

### Render:
- **Logs**: Service Dashboard → Logs tab
- **Alerts**: Configure in Settings

### Vercel:
- **Logs**: Project → Deployments → View Logs
- **Analytics**: Built-in analytics dashboard

---

## 💰 Cost Estimates

| Service | Free Tier | Paid Plans |
|---------|-----------|------------|
| **Railway** | $5 free credit/month | $5/month |
| **Render** | 750 hours/month | $7/month |
| **Vercel** | Unlimited deployments | $20/month |
| **Netlify** | 100GB bandwidth | $19/month |
| **Supabase** | 500MB DB, 1GB storage | $25/month |
| **PythonAnywhere** | 1 web app (slow) | $5/month |

**Recommended Free Setup**:
- Frontend: Vercel (Free)
- Replit Backend: Railway ($5 credit)
- Flask Backend: Render (Free tier)
- Database: Supabase (Free tier)

**Total Cost**: $0/month (within free tiers)

---

## 🚨 Troubleshooting

### Issue: "CORS Error"
**Solution**: Update CORS origins in both backends to include your frontend URL

### Issue: "Database connection failed"
**Solution**: Check `DATABASE_URL` is correctly set in environment variables

### Issue: "AI models taking too long to load"
**Solution**: Models load lazily on first request. Increase timeout to 120s in gunicorn

### Issue: "File upload not working"
**Solution**: Verify Supabase bucket exists and credentials are correct

---

## ✅ Deployment Checklist

- [ ] Supabase project created and configured
- [ ] Storage bucket `user-files` created
- [ ] Replit backend deployed to Railway/Render
- [ ] Flask backend deployed to Railway/Render
- [ ] React frontend deployed to Vercel/Netlify
- [ ] Environment variables set on all platforms
- [ ] Database migrations run successfully
- [ ] CORS configured correctly
- [ ] API endpoints tested and working
- [ ] Frontend connected to production APIs
- [ ] Custom domain configured (optional)
- [ ] SSL certificates active (auto on Railway/Vercel)

---

## 🎉 You're Live!

Your GramSetu AI system is now deployed to production!

**Access your application**:
- Frontend: https://your-app.vercel.app
- Auth API: https://your-replit-backend.railway.app
- Complaint API: https://your-flask-backend.railway.app

---

## 📞 Need Help?

- Railway Docs: https://docs.railway.app
- Render Docs: https://render.com/docs
- Vercel Docs: https://vercel.com/docs
- Supabase Docs: https://supabase.com/docs
