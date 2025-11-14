# 🎯 GramSetu AI - Quick Reference Guide

## 📍 CURRENT STATUS

✅ **Backend Running**: http://localhost:5001  
✅ **Frontend Running**: http://localhost:3000  
✅ **Mode**: Demo/Fallback (No AI libraries needed)  
✅ **Database**: SQLite (gramsetu_ai.db)  

---

## 🚀 Quick Commands

### Start Everything
```bash
./start.sh
```

### Start Manually
```bash
# Backend (Terminal 1)
python3 app.py

# Frontend (Terminal 2)
PORT=3000 npm start
```

### Stop Everything
```bash
# Kill backend
lsof -ti:5001 | xargs kill -9

# Kill frontend
lsof -ti:3000 | xargs kill -9
```

### Check Health
```bash
curl http://localhost:5001/healthz
```

---

## 🔐 Test Credentials

| Role | Username | Password |
|------|----------|----------|
| Citizen | citizen1 | password123 |
| District Officer | officer1 | password123 |
| Field Worker | worker1 | password123 |

---

## 📊 Key URLs

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5001
- **Health Check**: http://localhost:5001/healthz
- **Login**: http://localhost:3000/login

---

## 🎮 Demo Workflow

### As Citizen
1. Login → citizen1 / password123
2. Click "File New Complaint"
3. Enter complaint text
4. Upload image (optional)
5. Submit → See AI classification
6. View blockchain hash
7. Check CRS score

### As Officer
1. Login → officer1 / password123
2. View dashboard KPIs
3. See complaint trends
4. Export PDF report
5. Assign to field worker

### As Field Worker
1. Login → worker1 / password123
2. View assigned complaints
3. Update status
4. Add resolution notes

---

## 🛠️ Troubleshooting

### Port Already in Use
```bash
# Find and kill process
lsof -ti:5001 | xargs kill -9
lsof -ti:3000 | xargs kill -9
```

### Backend Won't Start
```bash
# Check Python version (need 3.8+)
python3 --version

# Install minimal dependencies
pip3 install flask flask-cors python-dotenv pyjwt werkzeug

# Check logs
tail -f backend.log
```

### Frontend Won't Start
```bash
# Clear cache
rm -rf node_modules package-lock.json
npm install

# Use different port
PORT=3001 npm start
```

### Database Issues
```bash
# Reset database
rm gramsetu_ai.db
python3 app.py  # Will recreate
```

---

## 📁 Important Files

| File | Purpose |
|------|---------|
| `app.py` | Backend server |
| `start.sh` | Quick start script |
| `.env` | Configuration |
| `README.md` | Main documentation |
| `DEPLOYMENT_GUIDE.md` | Deployment instructions |
| `package.json` | Frontend dependencies |
| `requirements.txt` | Python dependencies |

---

## 🔧 Configuration Quick Edit

Edit `.env`:
```bash
# Change backend port
PORT=5002

# Change API URL
REACT_APP_API_URL=http://localhost:5002

# Enable full AI (requires API key)
OPENAI_API_KEY=sk-your-key
DEMO_MODE=false
```

---

## 📦 Dependencies

### Minimal (Demo Mode)
```bash
pip3 install flask flask-cors python-dotenv pyjwt werkzeug
npm install
```

### Full AI Features
```bash
pip3 install transformers sentence-transformers torch numpy scikit-learn openai web3
```

---

## 🚀 Deployment Options

### 1. Vercel (Frontend) - FREE
```bash
vercel --prod
```

### 2. Render (Backend) - FREE
- Push to GitHub
- Connect to Render
- Auto-deploy

### 3. Docker
```bash
docker-compose up -d --build
```

---

## 📊 API Quick Reference

### Login
```bash
curl -X POST http://localhost:5001/api/login \
  -H "Content-Type: application/json" \
  -d '{"username":"citizen1","password":"password123"}'
```

### File Complaint
```bash
curl -X POST http://localhost:5001/api/complaints \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"text":"Water supply not working"}'
```

### Get Dashboard
```bash
curl http://localhost:5001/api/dashboard?role=citizen \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Health Check
```bash
curl http://localhost:5001/healthz
```

---

## 🎯 Features Status

| Feature | Status | Mode Required |
|---------|--------|---------------|
| User Login | ✅ | All |
| File Complaint | ✅ | All |
| View Dashboard | ✅ | All |
| CRS Scoring | ✅ | All |
| Basic Classification | ✅ | Fallback |
| AI Classification | ⚡ | Full AI |
| Duplicate Detection | ✅ | Fallback/AI |
| Blockchain Logging | ✅ | Mock/Real |
| PDF Export | ✅ | All |
| Excel Export | ✅ | All |
| AI Chat | ✅ | All (Mock/Real) |
| Voice Input | ⚠️ | Full AI |
| Multilingual | ⚠️ | Full AI |

---

## 💡 Tips

1. **Use Demo Mode** for presentations - faster, no API keys needed
2. **Check logs** if something fails: `tail -f backend.log`
3. **Clear browser cache** if UI looks broken
4. **Use Chrome/Firefox** for best compatibility
5. **Mobile responsive** - test on different screen sizes

---

## 🎓 For Techfest Demo

### What Works NOW (No Setup)
✅ All core features  
✅ Login/Register  
✅ File complaints  
✅ View dashboards  
✅ Export reports  
✅ AI chat (mock)  
✅ Blockchain (mock)  

### What Needs API Keys
⚡ OpenAI GPT responses  
⚡ Advanced ML classification  
⚡ Real blockchain transactions  
⚡ Voice transcription  

---

## 📞 Quick Help

**Problem**: Can't access frontend  
**Solution**: Check http://localhost:3000, clear cache, try incognito

**Problem**: API errors  
**Solution**: Check backend is running on 5001, verify .env

**Problem**: Login fails  
**Solution**: Use exact credentials: citizen1/password123

**Problem**: Slow performance  
**Solution**: Enable Redis, use production build

---

## ✅ Pre-Demo Checklist

- [ ] Both servers running
- [ ] Health check passes
- [ ] Can login as all roles
- [ ] File complaint works
- [ ] Dashboard loads
- [ ] Export PDF works
- [ ] AI chat responds
- [ ] Mobile view works

---

## 🎬 Demo Script (5 minutes)

**Minute 1**: Login as citizen, show CRS score  
**Minute 2**: File complaint with image  
**Minute 3**: Show AI classification + blockchain hash  
**Minute 4**: Login as officer, view dashboard  
**Minute 5**: Export PDF, show analytics  

---

## 📚 Documentation Links

- Full README: [`README.md`](README.md)
- Deployment: [`DEPLOYMENT_GUIDE.md`](DEPLOYMENT_GUIDE.md)
- Backend Docs: [`BACKEND_INTEGRATION_COMPLETE.md`](BACKEND_INTEGRATION_COMPLETE.md)
- Status: [`IMPLEMENTATION_STATUS.md`](IMPLEMENTATION_STATUS.md)

---

**Last Updated**: October 23, 2025  
**Version**: 1.0.0  
**Status**: ✅ Running & Ready

🎉 **You're all set for IIT Bombay Techfest 2024!**
