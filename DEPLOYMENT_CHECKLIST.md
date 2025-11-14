# ✅ GramSetu AI - Complete Setup & Deployment Checklist

## 📋 Pre-Deployment Checklist

### 1. Supabase Setup

- [ ] **Create Supabase Account**
  - Go to: https://app.supabase.com
  - Sign up with GitHub or email
  
- [ ] **Create New Project**
  - Project name: `gramsetu-ai`
  - Database password: (save securely)
  - Region: Choose closest to your users
  
- [ ] **Get API Credentials**
  - Go to: Settings → API
  - Copy `Project URL` → Save to `.env` as `SUPABASE_URL`
  - Copy `anon/public key` → Save as `SUPABASE_ANON_KEY`
  - Copy `service_role key` → Save as `SUPABASE_SERVICE_KEY`
  
- [ ] **Create Storage Bucket**
  - Go to: Storage → New Bucket
  - Name: `user-files`
  - Privacy: **Private**
  - Click: Create Bucket
  
- [ ] **Get Database URL** (Optional - for external DB)
  - Go to: Settings → Database
  - Copy: Connection String (URI format)
  - Save as `DATABASE_URL`

### 2. Update Configuration Files

#### Replit Backend Configuration

- [ ] **Edit `replit-backend/.env`**
  ```env
  PORT=5003
  NODE_ENV=development
  
  SUPABASE_URL=https://xxxxx.supabase.co
  SUPABASE_ANON_KEY=eyJhbGc...
  SUPABASE_SERVICE_KEY=eyJhbGc...
  DATABASE_URL=postgresql://...
  ```

- [ ] **Install Dependencies**
  ```bash
  cd replit-backend
  npm install
  ```

- [ ] **Push Database Schema**
  ```bash
  npm run db:push
  ```

- [ ] **Test Locally**
  ```bash
  PORT=5003 npm run dev
  # Should start on http://localhost:5003
  ```

#### Flask Backend Configuration

- [ ] **Already Configured** ✅
  - Uses SQLite (auto-created)
  - AI models lazy-loaded
  - No additional setup needed

- [ ] **Test Locally**
  ```bash
  PORT=5002 python3 app.py
  # Should start on http://localhost:5002
  ```

#### React Frontend Configuration

- [ ] **Create `.env.production`**
  ```env
  REACT_APP_REPLIT_API_URL=https://your-replit-backend.railway.app
  REACT_APP_FLASK_API_URL=https://your-flask-backend.railway.app
  ```

- [ ] **Test Build**
  ```bash
  npm run build
  # Should create 'build' folder
  ```

---

## 🚀 Deployment Checklist

### Option A: Railway Deployment (Recommended)

#### Deploy Flask Backend

- [ ] **Go to Railway.app**
  - https://railway.app
  - Sign up with GitHub
  
- [ ] **New Project**
  - Click: New Project
  - Select: Deploy from GitHub repo
  - Choose your repository
  
- [ ] **Configure Flask Service**
  - Root Directory: `.` (project root)
  - Build Command: (auto-detected)
  - Start Command: `gunicorn --bind 0.0.0.0:$PORT app:app`
  
- [ ] **Add Environment Variables**
  ```
  PORT=5000
  FLASK_ENV=production
  DB_PATH=/app/gramsetu_ai.db
  ```
  
- [ ] **Deploy & Get URL**
  - Note URL: `https://gramsetu-flask-xxxxx.up.railway.app`

#### Deploy Replit Backend

- [ ] **New Project on Railway**
  
- [ ] **Configure Replit Service**
  - Root Directory: `replit-backend`
  - Build Command: `npm install && npm run build`
  - Start Command: `npm start`
  
- [ ] **Add Postgres Database**
  - Click: New → Database → PostgreSQL
  - Railway auto-sets `DATABASE_URL`
  
- [ ] **Add Environment Variables**
  ```
  NODE_ENV=production
  PORT=5000
  SUPABASE_URL=https://...
  SUPABASE_ANON_KEY=...
  SUPABASE_SERVICE_KEY=...
  ```
  
- [ ] **Run Database Migration**
  - In Railway console: `npm run db:push`
  
- [ ] **Deploy & Get URL**
  - Note URL: `https://gramsetu-replit-xxxxx.up.railway.app`

#### Deploy React Frontend

- [ ] **Update `.env.production`** with Railway URLs
  
- [ ] **Option 1: Vercel**
  - Install CLI: `npm install -g vercel`
  - Run: `vercel --prod`
  - Add environment variables in dashboard
  
- [ ] **Option 2: Netlify**
  - Connect GitHub repo
  - Build: `npm run build`
  - Publish: `build`
  - Add environment variables
  
- [ ] **Get Frontend URL**
  - Note URL: `https://gramsetu.vercel.app`

---

### Option B: Render Deployment

#### Deploy Flask Backend

- [ ] **Go to Render.com**
  - https://render.com
  - Sign up with GitHub
  
- [ ] **New Web Service**
  - Connect repository
  - Root: `.`
  - Build: `pip install -r requirements.txt`
  - Start: `gunicorn --bind 0.0.0.0:$PORT app:app`
  
- [ ] **Add Environment Variables**
  
- [ ] **Deploy & Get URL**

#### Deploy Replit Backend

- [ ] **New Web Service**
  - Root: `replit-backend`
  - Build: `npm install && npm run build`
  - Start: `npm start`
  
- [ ] **Add Postgres Database**
  - New → PostgreSQL
  - Copy connection string
  
- [ ] **Add Environment Variables**
  
- [ ] **Deploy & Get URL**

---

## 🔧 Post-Deployment Configuration

### 1. Update CORS Settings

- [ ] **Replit Backend CORS**
  - Edit `server/index.ts` if needed
  - Add frontend URL to allowed origins
  
- [ ] **Flask Backend CORS**
  - Already configured with `flask-cors`
  - No changes needed

### 2. Test API Endpoints

#### Test Replit Backend

- [ ] **Signup Endpoint**
  ```bash
  curl -X POST https://your-replit-backend/api/auth/signup \
    -H "Content-Type: application/json" \
    -d '{"username":"test","email":"test@example.com","password":"test123"}'
  ```
  Expected: `{"message":"User created successfully","token":"..."}`

- [ ] **Login Endpoint**
  ```bash
  curl -X POST https://your-replit-backend/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"test@example.com","password":"test123"}'
  ```
  Expected: `{"message":"Login successful","token":"..."}`

#### Test Flask Backend

- [ ] **Dashboard Endpoint**
  ```bash
  curl https://your-flask-backend/api/dashboard
  ```
  Expected: JSON with dashboard data

- [ ] **Submit Complaint**
  ```bash
  curl -X POST https://your-flask-backend/api/complaint \
    -H "Content-Type: application/json" \
    -d '{"text":"Water supply issue","citizen_id":"TEST001"}'
  ```
  Expected: `{"message":"Complaint submitted successfully",...}`

### 3. Frontend Integration

- [ ] **Update API URLs** in `src/utils/apiConfig.ts`
  
- [ ] **Test Login Flow**
  - Open frontend URL
  - Try signup/login
  - Verify token storage
  
- [ ] **Test Complaint Submission**
  - Submit a complaint
  - Check classification
  - Verify in dashboard

---

## 🔐 Security Checklist

- [ ] **Environment Variables Secure**
  - Never commit `.env` files
  - Use platform secrets (Railway/Render/Vercel)
  
- [ ] **API Keys Protected**
  - Supabase service key only on backend
  - Never expose in frontend code
  
- [ ] **HTTPS Enabled**
  - Railway/Render auto-provide SSL
  - Verify all URLs use `https://`
  
- [ ] **CORS Properly Configured**
  - Only allow your frontend domain
  - No wildcard (`*`) in production

---

## 📊 Monitoring Setup

- [ ] **Check Logs**
  - Railway: Dashboard → Logs
  - Render: Service → Logs
  - Vercel: Deployments → View Logs
  
- [ ] **Set Up Alerts** (Optional)
  - Railway: Integrations → Add Slack/Discord
  - Render: Settings → Notifications
  
- [ ] **Monitor Usage**
  - Check free tier limits
  - Set up billing alerts

---

## 🎯 Final Testing

### Complete User Flow Test

- [ ] **User Registration**
  1. Go to frontend
  2. Sign up with new account
  3. Verify success message
  4. Check Supabase auth dashboard

- [ ] **File Upload**
  1. Login
  2. Upload a file
  3. Verify file appears in list
  4. Check Supabase storage bucket

- [ ] **Complaint Submission**
  1. Submit complaint text
  2. Wait for AI classification
  3. Check category assigned
  4. Verify in dashboard

- [ ] **Dashboard Views**
  1. Test citizen dashboard
  2. Test district dashboard
  3. Check data displays correctly
  4. Verify charts render

---

## 📝 Documentation Updates

- [ ] **Update README.md** with live URLs
  
- [ ] **Document API Endpoints** with production URLs
  
- [ ] **Create User Guide** for your application

---

## 🎉 Launch Checklist

- [ ] All backends deployed and running
- [ ] Frontend deployed and accessible
- [ ] API endpoints tested and working
- [ ] User authentication working
- [ ] Complaint submission working
- [ ] Dashboard loading data
- [ ] Mobile responsive
- [ ] No console errors
- [ ] Performance acceptable (<3s load time)
- [ ] SSL certificates active

---

## 🆘 Troubleshooting Guide

### Backend Not Starting

- [ ] Check logs for errors
- [ ] Verify environment variables set
- [ ] Check database connection
- [ ] Ensure dependencies installed

### CORS Errors

- [ ] Add frontend URL to backend CORS
- [ ] Verify no trailing slashes in URLs
- [ ] Check credentials flag if needed

### Database Errors

- [ ] Verify `DATABASE_URL` format
- [ ] Run migrations: `npm run db:push`
- [ ] Check database exists

### AI Models Not Loading

- [ ] Check timeout settings (120s)
- [ ] Verify enough memory allocated
- [ ] Models load on first request (be patient)

---

## 📞 Support Resources

- Railway: https://docs.railway.app
- Render: https://render.com/docs  
- Vercel: https://vercel.com/docs
- Supabase: https://supabase.com/docs

---

## ✅ Completion

Once all checkboxes are checked:

🎉 **Congratulations! Your GramSetu AI system is live in production!**

**Your URLs:**
- Frontend: `https://________________`
- Replit API: `https://________________`
- Flask API: `https://________________`

**Share your application and make an impact! 🚀**
