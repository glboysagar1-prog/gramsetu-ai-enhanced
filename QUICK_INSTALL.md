# ⚡ GramSetu AI - Voice Module - 5-Minute Setup

## 🎯 One-Command Setup

```bash
./setup_voice_module.sh && python app.py
```

**That's it!** Your voice complaint system is running! 🎉

---

## 📋 Manual Setup (If needed)

### Step 1: Install FFmpeg (Required)

**macOS:**
```bash
brew install ffmpeg
```

**Ubuntu/Debian:**
```bash
sudo apt-get update
sudo apt-get install ffmpeg
```

**Windows:**
Download from: https://ffmpeg.org/download.html

---

### Step 2: Install Python Dependencies

```bash
pip install -r requirements.txt
```

This installs:
- OpenAI Whisper (ASR)
- pydub (audio processing)
- Flask (backend)
- All ML/NLP libraries

---

### Step 3: Create Directories

```bash
mkdir -p uploads/audio
mkdir -p logs
```

---

### Step 4: Start the Server

```bash
python app.py
```

Server starts at: **http://localhost:5000**

---

## ✅ Verify Installation

### Test 1: Health Check
```bash
curl http://localhost:5000/health
```

Expected: `{"status": "healthy"}`

### Test 2: Voice Service
```bash
curl http://localhost:5000/api/v1/voice/test
```

Expected: Service status info

### Test 3: Run Test Suite
```bash
python test_voice_complaint.py
```

Expected: All tests pass ✅

---

## 🎤 Quick Test with Audio

```bash
# Upload a voice complaint
curl -X POST http://localhost:5000/api/v1/voice/upload \
  -F "audio=@your_audio.mp3" \
  -F "citizen_id=TEST001" \
  -F "language=hi"
```

**Response:**
```json
{
  "complaint_id": "GSAI-2025-0001",
  "text": "Transcribed text",
  "category": "Water",
  "urgency": "High",
  "language": "Hindi",
  "timestamp": "2025-10-22T14:22:31Z"
}
```

---

## 🐛 Troubleshooting

### Issue: FFmpeg not found
```bash
# Verify installation
ffmpeg -version

# If not installed, install it (see Step 1)
```

### Issue: Python dependencies failed
```bash
# Upgrade pip first
pip install --upgrade pip

# Then retry
pip install -r requirements.txt
```

### Issue: Port 5000 already in use
```bash
# Change port in app.py or use environment variable
export API_PORT=8000
python app.py
```

### Issue: Import errors
```bash
# Make sure you're in the project directory
cd "GramSetu AI – National Governance Intelligence Network"

# Then start server
python app.py
```

---

## 📱 Next Steps

### 1. Test All Languages
```bash
python test_voice_complaint.py
```

### 2. Integrate with Flutter
See: `INTEGRATION_GUIDE.md` (Flutter section)

### 3. Add to React Dashboard
See: `INTEGRATION_GUIDE.md` (React section)

### 4. Deploy to Production
See: `INTEGRATION_GUIDE.md` (Deployment section)

---

## 📚 Full Documentation

- **Overview**: `README_VOICE_MODULE.md`
- **Integration**: `INTEGRATION_GUIDE.md`
- **Quick Ref**: `VOICE_MODULE_SUMMARY.md`
- **Examples**: `EXAMPLE_OUTPUT.md`
- **Architecture**: `ARCHITECTURE.md`

---

## 🎯 Supported Features

✅ 11 Indian Languages (Hindi, Tamil, Gujarati, etc.)  
✅ 7 Audio Formats (WAV, MP3, OGG, etc.)  
✅ 9 Complaint Categories (Water, Health, etc.)  
✅ Auto Language Detection  
✅ AI Classification  
✅ Urgency Detection  
✅ Duplicate Prevention  
✅ Spam Filtering  

---

## 🚀 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/voice/upload` | POST | Upload voice complaint |
| `/api/v1/voice/languages` | GET | Get languages |
| `/api/v1/voice/test` | GET | Test service |
| `/health` | GET | Health check |

---

## 💡 Pro Tips

1. **Use `base` model** for production (good balance)
2. **Test with sample audio** before deploying
3. **Enable GPU** for 10x faster processing
4. **Read docs** for advanced features
5. **Monitor logs** in production

---

## ⏱️ Installation Time

- Automated setup: **~5 minutes**
- Manual setup: **~10 minutes**
- Model download (first use): **~2 minutes**
- **Total**: **~15 minutes** to production-ready!

---

## 🎉 Success!

If you see this, you're ready:

```
Starting GramSetu AI backend server on http://localhost:5000
Loading AI models...
AI models loaded successfully!
```

🎊 **Congratulations!** Voice complaint module is running!

---

**Quick Command Reference:**

```bash
# Setup
./setup_voice_module.sh

# Start server
python app.py

# Run tests
python test_voice_complaint.py

# Test API
curl http://localhost:5000/health

# Upload audio
curl -X POST http://localhost:5000/api/v1/voice/upload \
  -F "audio=@test.mp3" -F "citizen_id=TEST001"
```

---

**Need help?** Check `VOICE_MODULE_README.md` for detailed docs!

🇮🇳 **Built for Digital India** 🇮🇳
