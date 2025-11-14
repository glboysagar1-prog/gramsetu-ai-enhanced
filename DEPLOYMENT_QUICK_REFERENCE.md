# Deployment Quick Reference Card

## 🚀 Current Status
- **Frontend**: ✅ Deployed to Vercel
- **URL**: https://gramsetu-89lg3uz12-sagars-projects-ca23f511.vercel.app
- **Backends**: ⚠️ Pending deployment to Railway

## 📋 Essential Next Steps

### 1. Railway Projects to Create
- [ ] `gramsetu-flask-api` (Flask backend)
- [ ] `gramsetu-auth-api` (Node.js backend)
- [ ] `gramsetu-database` (PostgreSQL)

### 2. Environment Variables Needed

**Flask Backend (gramsetu-flask-api)**:
```
PORT=5001
FLASK_ENV=production
JWT_SECRET=generate-with-openssl
CORS_ORIGINS=https://gramsetu-89lg3uz12-sagars-projects-ca23f511.vercel.app,http://localhost:3000
```

**Node.js Backend (gramsetu-auth-api)**:
```
PORT=5003
NODE_ENV=production
JWT_SECRET=generate-with-openssl
REFRESH_SECRET=generate-with-openssl
CORS_ORIGINS=https://gramsetu-89lg3uz12-sagars-projects-ca23f511.vercel.app,http://localhost:3000
```

**Both Backends** (same value):
```
DATABASE_URL=postgresql://... (from Railway PostgreSQL add-on)
```

### 3. Generate Secure Secrets
```bash
openssl rand -hex 32
```

### 4. Vercel Environment Variables (After Railway Deployment)
```
REACT_APP_API_URL=https://<flask-railway-url>
REACT_APP_AUTH_API_URL=https://<auth-railway-url>
```

## 📚 Key Documentation

1. **[RAILWAY_WEB_UI_DEPLOYMENT_GUIDE.md](file:///Users/sagar/Documents/GramSetu%20AI%20–%20National%20Governance%20Intelligence%20Network/RAILWAY_WEB_UI_DEPLOYMENT_GUIDE.md)** - Primary deployment guide
2. **[MANUAL_DEPLOYMENT_GUIDE.md](file:///Users/sagar/Documents/GramSetu%20AI%20–%20National%20Governance%20Intelligence%20Network/MANUAL_DEPLOYMENT_GUIDE.md)** - Alternative CLI guide
3. **[FINAL_DEPLOYMENT_STATUS.md](file:///Users/sagar/Documents/GramSetu%20AI%20–%20National%20Governance%20Intelligence%20Network/FINAL_DEPLOYMENT_STATUS.md)** - Status summary

## ⚡ Quick Commands

**Check deployment status**:
```bash
./check-deployment.sh
```

**Generate secure secrets**:
```bash
openssl rand -hex 32
```

**Frontend build** (already done):
```bash
npm install --legacy-peer-deps
npm run build
```

**Backend build** (already done):
```bash
cd replit-backend
npm install
npm run build
```

## 🛠️ Troubleshooting

**Dependency Conflicts**: 
- Already resolved with [.npmrc](file:///Users/sagar/Documents/GramSetu%20AI%20–%20National%20Governance%20Intelligence%20Network/.npmrc) file

**Railway CLI Issues**:
- Use Web UI deployment method instead

**Database Connection**:
- Ensure DATABASE_URL is consistent across services

## 🎯 Success Criteria

When deployment is complete, you should be able to:
- [ ] Access frontend at Vercel URL
- [ ] Register new users
- [ ] Log in with email/password
- [ ] Submit complaints
- [ ] View dashboards based on user role
- [ ] Use AI chat functionality

## 📞 Support

- **Railway**: https://docs.railway.app
- **Vercel**: https://vercel.com/docs
- **Local files**: All documentation in current directory

**Estimated Time**: 30-45 minutes using Web UI method