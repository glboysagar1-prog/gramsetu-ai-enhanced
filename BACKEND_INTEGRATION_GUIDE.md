# GramSetu AI - Backend Integration Guide

## 🔗 Dual Backend Architecture

Your GramSetu AI system now runs **TWO backends** working together:

### **1. Replit Backend (Port 5001)** - Node.js/Express
**Purpose**: Modern authentication and file management
- ✅ User Authentication (JWT-based via Supabase)
- ✅ File Upload & Storage (Supabase Storage)
- ✅ Analytics Dashboard
- ✅ PostgreSQL Database (User data, file metadata)

**Technology Stack**:
- Node.js 20 + Express.js
- TypeScript
- Supabase (Auth & Storage)
- Drizzle ORM + PostgreSQL
- React frontend (separate client)

### **2. Flask Backend (Port 5002)** - Python
**Purpose**: AI-powered complaint management system
- ✅ Complaint Submission & Classification
- ✅ AI/NLP Processing (Zero-shot classification, duplicate detection)
- ✅ Citizen Rating System (CRS)
- ✅ Blockchain Audit Trail (SHA256 hashing)
- ✅ Field Worker Assignment
- ✅ Dashboard APIs (Citizen, District, State, National)

**Technology Stack**:
- Python 3.13 + Flask
- Transformers (Hugging Face)
- Sentence Transformers
- PyTorch
- SQLite Database

---

## 📁 Project Structure

```
GramSetu AI/
├── replit-backend/          # Replit Backend (Auth & Files)
│   ├── server/              # Express API
│   ├── client/              # React frontend (optional)
│   └── .env                 # Replit config
│
├── app.py                   # Flask Backend (Complaints & AI)
├── services/                # AI services
│   ├── voice_complaint_service.py
│   └── multilingual_classifier.py
│
├── src/                     # Main React Dashboard
│   ├── components/          # React components
│   ├── utils/
│   │   └── apiConfig.ts    # ✨ API integration layer
│   └── ...
│
├── scripts/
│   ├── start-all.sh        # 🚀 Start both backends
│   └── stop-all.sh         # 🛑 Stop all services
│
└── logs/                    # Backend logs
    ├── replit-backend.log
    └── flask-backend.log
```

---

## 🚀 Quick Start

### **Option 1: Start Both Backends Automatically**

```bash
# Make sure you're in the project root
./scripts/start-all.sh
```

This will start:
- ✅ Replit Backend on http://localhost:5001
- ✅ Flask Backend on http://localhost:5002

### **Option 2: Start Manually**

**Terminal 1 - Replit Backend:**
```bash
cd replit-backend
PORT=5001 npm run dev
```

**Terminal 2 - Flask Backend:**
```bash
PORT=5002 python3 app.py
```

**Terminal 3 - React Frontend:**
```bash
npm start
```

### **Stop All Services**

```bash
./scripts/stop-all.sh
```

---

## 🔧 Configuration

### **Replit Backend Setup**

1. **Edit `replit-backend/.env`** with your Supabase credentials:

```env
PORT=5001
NODE_ENV=development

# Get these from https://app.supabase.com
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-role-key

# PostgreSQL database
DATABASE_URL=postgresql://user:password@localhost:5432/gramsetu
```

2. **Set up Supabase Storage**:
   - Go to Supabase Dashboard → Storage
   - Create bucket: `user-files` (Private)

3. **Initialize Database**:
```bash
cd replit-backend
npm run db:push
```

### **Flask Backend Setup**

Already configured! The Flask backend uses:
- SQLite database (`gramsetu_ai.db`)
- AI models (lazy-loaded on first use)
- No additional config needed

---

## 📡 API Integration

The frontend uses `src/utils/apiConfig.ts` to communicate with both backends:

### **Usage in React Components:**

```typescript
import api from '../utils/apiConfig';

// Replit Backend - Authentication
const loginUser = async (email, password) => {
  const response = await api.replit.login(email, password);
  console.log('Logged in:', response.user);
};

// Replit Backend - File Upload
const uploadFile = async (file) => {
  const response = await api.replit.uploadFile(
    file.name, 
    file.type, 
    file.size
  );
  console.log('Upload URL:', response.uploadUrl);
};

// Flask Backend - Submit Complaint
const submitComplaint = async (text, citizenId) => {
  const response = await api.flask.submitComplaint(text, citizenId);
  console.log('Complaint:', response);
};

// Flask Backend - Get Dashboard Data
const getDashboard = async (role) => {
  const response = await api.flask.getDashboard(role);
  console.log('Dashboard:', response.data);
};
```

---

## 🌐 API Endpoints

### **Replit Backend (Port 5001)**

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/signup` | Create user account | No |
| POST | `/api/auth/login` | Login user | No |
| GET | `/api/files` | List user files | Yes |
| POST | `/api/files/upload` | Upload file metadata | Yes |
| DELETE | `/api/files/:id` | Delete file | Yes |
| GET | `/api/analytics` | Get analytics data | Yes |

### **Flask Backend (Port 5002)**

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/complaint` | Submit complaint | Optional |
| GET | `/api/complaints` | List all complaints | Optional |
| GET | `/api/complaints/citizen/:id` | Get citizen complaints | Optional |
| GET | `/api/dashboard` | Get dashboard data | Optional |
| GET | `/api/crs/:citizenId` | Get CRS score | Optional |
| GET | `/api/assignments` | List assignments | Optional |

---

## 🔐 Authentication Flow

1. **User signs up/logs in** → Replit Backend (`/api/auth/login`)
2. **Receives JWT token** → Stored in `localStorage` as `authToken`
3. **Token used for**:
   - Replit API calls (file management, analytics)
   - Flask API calls (complaint submission, dashboard)

---

## 📊 Monitoring & Logs

**View Real-time Logs:**

```bash
# Replit Backend logs
tail -f logs/replit-backend.log

# Flask Backend logs  
tail -f logs/flask-backend.log
```

**Check Service Status:**

```bash
# Check which ports are running
lsof -i :5001  # Replit Backend
lsof -i :5002  # Flask Backend
lsof -i :3000  # React Frontend
```

---

## 🐛 Troubleshooting

### **Replit Backend Not Starting**

1. Check if dependencies are installed:
   ```bash
   cd replit-backend && npm install
   ```

2. Verify `.env` file exists with correct credentials

3. Check logs:
   ```bash
   cat logs/replit-backend.log
   ```

### **Flask Backend Not Starting**

1. Check Python dependencies:
   ```bash
   pip3 install -r requirements.txt
   ```

2. Check logs:
   ```bash
   cat logs/flask-backend.log
   ```

### **Port Already in Use**

```bash
# Kill process on specific port
lsof -ti:5001 | xargs kill -9
lsof -ti:5002 | xargs kill -9
```

Or use:
```bash
./scripts/stop-all.sh
```

### **CORS Errors**

Both backends have CORS enabled. If you encounter issues:
- Replit: Check `server/index.ts` CORS config
- Flask: CORS is enabled via `flask_cors`

---

## 🚢 Deployment

### **Deploy Replit Backend**

1. Push to Replit or deploy to:
   - Vercel
   - Railway
   - Render
   - Any Node.js hosting

2. Set environment variables in hosting platform

3. Update frontend `REACT_APP_REPLIT_API_URL`

### **Deploy Flask Backend**

1. Deploy to:
   - Railway
   - Render
   - PythonAnywhere
   - AWS/GCP/Azure

2. Update frontend `REACT_APP_FLASK_API_URL`

---

## 🎯 Next Steps

1. ✅ **Configure Supabase** credentials in `replit-backend/.env`
2. ✅ **Start backends** with `./scripts/start-all.sh`
3. ✅ **Test authentication** through Replit API
4. ✅ **Submit complaints** through Flask API
5. ✅ **Monitor logs** for any issues

---

## 📞 Need Help?

Check the logs in `logs/` directory for detailed error messages.

**Common Files to Check:**
- `replit-backend/README.md` - Replit backend documentation
- `DEPLOYMENT_GUIDE.md` - Main deployment guide
- `INTEGRATION_GUIDE.md` - Integration details
