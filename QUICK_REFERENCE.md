# 🎯 GramSetu AI - Quick Reference Card

## 📍 Your Current Setup

```
✅ Replit Backend (Copied & Integrated)
✅ Flask Backend (AI-powered)
✅ React Frontend (Main dashboard)
✅ Dual API Configuration (src/utils/apiConfig.ts)
✅ Deployment Files Ready
```

---

## 🚀 Local Development

### Start All Services
```bash
./scripts/start-all.sh
```

### Stop All Services
```bash
./scripts/stop-all.sh
```

### Individual Services
```bash
# Replit Backend (Auth & Files)
cd replit-backend && PORT=5003 npm run dev

# Flask Backend (Complaints & AI)
PORT=5002 python3 app.py

# React Frontend
npm start
```

---

## 🔑 Supabase Setup (Step-by-Step)

### 1. Create Account & Project
1. Go to: **https://app.supabase.com**
2. Sign up with GitHub
3. **New Project**:
   - Name: `gramsetu-ai`
   - Database Password: (save it!)
   - Region: Select closest

### 2. Get API Keys
1. Go to: **Settings** → **API**
2. Copy these 3 values:

```
Project URL:        https://xxxxx.supabase.co
anon/public key:    eyJhbGc...
service_role key:   eyJhbGc...
```

### 3. Create Storage Bucket
1. Go to: **Storage**
2. **New Bucket**:
   - Name: `user-files`
   - Privacy: **Private** ✓
3. **Create**

### 4. Update .env File
Edit: `replit-backend/.env`

```env
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGc...your-anon-key...
SUPABASE_SERVICE_KEY=eyJhbGc...your-service-key...
```

### 5. Initialize Database
```bash
cd replit-backend
npm run db:push
```

✅ **Done! Supabase configured!**

---

## 🌐 Quick Deploy to Railway

### 1. Install Railway CLI
```bash
npm install -g @railway/cli
```

### 2. Login
```bash
railway login
```

### 3. Deploy Flask Backend
```bash
railway init
railway up
```
- Add env vars in Railway dashboard
- Get URL: `https://your-app.up.railway.app`

### 4. Deploy Replit Backend
```bash
cd replit-backend
railway up
```
- Add env vars (including Supabase)
- Create PostgreSQL database (Railway provides)
- Run: `railway run npm run db:push`

### 5. Deploy Frontend to Vercel
```bash
npm install -g vercel
vercel --prod
```
- Add env vars (both API URLs)

✅ **Live in minutes!**

---

## 🔗 API Usage Examples

### In Your React Components:

```typescript
import api from '../utils/apiConfig';

// ✅ Login (Replit Backend)
const login = async () => {
  const result = await api.replit.login(email, password);
  // Token auto-saved to localStorage
};

// ✅ Upload File (Replit Backend)  
const upload = async (file) => {
  const result = await api.replit.uploadFile(
    file.name, 
    file.type, 
    file.size
  );
  // Use result.uploadUrl to upload to Supabase
};

// ✅ Submit Complaint (Flask Backend)
const submitComplaint = async (text) => {
  const result = await api.flask.submitComplaint(
    text, 
    userId
  );
  // AI classifies automatically
};

// ✅ Get Dashboard (Flask Backend)
const loadDashboard = async () => {
  const data = await api.flask.getDashboard('citizen');
  // Returns analytics, complaints, etc.
};
```

---

## 📂 Important Files

| File | Purpose |
|------|---------|
| `replit-backend/.env` | Supabase credentials |
| `src/utils/apiConfig.ts` | Unified API client |
| `scripts/start-all.sh` | Start both backends |
| `DEPLOYMENT_CHECKLIST.md` | Step-by-step deployment |
| `PRODUCTION_DEPLOYMENT.md` | Full deployment guide |
| `BACKEND_INTEGRATION_GUIDE.md` | Integration details |

---

## 🆘 Quick Fixes

### Port Already in Use
```bash
./scripts/stop-all.sh
```

### Replit Backend Won't Start
```bash
cd replit-backend
npm install
npm run db:push
```

### Check Logs
```bash
tail -f logs/replit-backend.log
tail -f logs/flask-backend.log
```

### Reset Everything
```bash
./scripts/stop-all.sh
rm -rf replit-backend/node_modules
cd replit-backend && npm install
cd .. && ./scripts/start-all.sh
```

---

## 📊 Service URLs (Local)

| Service | URL | Status |
|---------|-----|--------|
| React Frontend | http://localhost:5001 | ✅ |
| Flask Backend | http://localhost:5002 | ✅ |
| Replit Backend | http://localhost:5003 | Configure .env |

---

## 🎯 Next Steps

**For Supabase Setup:**
1. ✅ Create Supabase project
2. ✅ Copy credentials to `.env`
3. ✅ Create storage bucket `user-files`
4. ✅ Run `npm run db:push`
5. ✅ Test locally

**For Production Deployment:**
1. ✅ Follow DEPLOYMENT_CHECKLIST.md
2. ✅ Deploy to Railway/Render
3. ✅ Update frontend env vars
4. ✅ Test live URLs
5. ✅ Launch! 🚀

---

## 📞 Documentation

- **Full Setup**: `DEPLOYMENT_CHECKLIST.md`
- **Deploy Guide**: `PRODUCTION_DEPLOYMENT.md`
- **Integration**: `BACKEND_INTEGRATION_GUIDE.md`
- **Replit Backend**: `replit-backend/README.md`

---

**Need help? Check the docs above or create an issue!** 🎉
