# 🎤 GramSetu AI - Voice Complaint Module

## Overview

The Voice Complaint Module enables citizens to file complaints in their native Indian languages using voice input. It uses state-of-the-art ASR (Automatic Speech Recognition) and NLP to transcribe, classify, and process voice complaints automatically.

## 🌟 Features

- **Multi-language ASR**: Support for 11 Indian languages (Hindi, Tamil, Gujarati, Bengali, Telugu, Marathi, Kannada, Malayalam, Punjabi, Odia, English)
- **Automatic Language Detection**: Detects spoken language automatically
- **Smart Classification**: AI-powered categorization into governance categories (Water, Health, Electricity, etc.)
- **Urgency Detection**: Automatically identifies urgent complaints
- **Duplicate Detection**: Prevents duplicate complaint submissions
- **Blockchain Audit**: Tamper-proof logging with SHA256 hashing
- **Format Support**: WAV, MP3, OGG, M4A, FLAC, WebM, AAC
- **Offline Capability**: Can process audio files without requiring constant internet connection

## 📋 Requirements

### System Requirements
- Python 3.8+
- FFmpeg (for audio processing)
- 4GB+ RAM (8GB recommended for medium model)
- GPU (optional, for faster processing)

### Python Dependencies
Install all dependencies:
```bash
pip install -r requirements.txt
```

### Install FFmpeg
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
Download from https://ffmpeg.org/download.html

## 🚀 Quick Start

### 1. Installation

```bash
# Clone the repository
cd "GramSetu AI – National Governance Intelligence Network"

# Install dependencies
pip install -r requirements.txt

# Create necessary directories
mkdir -p uploads/audio
```

### 2. Start the Server

```bash
python app.py
```

The server will start on `http://localhost:5000`

### 3. Test the Module

```bash
python test_voice_complaint.py
```

## 📡 API Endpoints

### 1. Upload Voice Complaint

**Endpoint:** `POST /api/v1/voice/upload`

**Request:**
- Method: POST (multipart/form-data)
- Headers: None required
- Form Data:
  - `audio`: Audio file (WAV, MP3, etc.)
  - `citizen_id`: Citizen identifier (required)
  - `language`: Language code (optional, auto-detected if not provided)

**Example (Python):**
```python
import requests

files = {'audio': open('complaint.mp3', 'rb')}
data = {'citizen_id': 'CIT001', 'language': 'hi'}

response = requests.post(
    'http://localhost:5000/api/v1/voice/upload',
    files=files,
    data=data
)

print(response.json())
```

**Example (cURL):**
```bash
curl -X POST http://localhost:5000/api/v1/voice/upload \
  -F "audio=@complaint.mp3" \
  -F "citizen_id=CIT001" \
  -F "language=hi"
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "complaint_id": "GSAI-2025-0001",
    "text": "Pani nahi aa raha hai do din se",
    "category": "Water",
    "urgency": "High",
    "language": "Hindi",
    "timestamp": "2025-10-22T14:22:31Z",
    "hash": "a8b9c0d1e2f3...",
    "is_valid": true,
    "is_duplicate": false,
    "crs_score": 102,
    "audio_duration": 5.2,
    "keywords": ["pani", "nahi", "raha"]
  }
}
```

### 2. Get Supported Languages

**Endpoint:** `GET /api/v1/voice/languages`

**Response:**
```json
{
  "status": "success",
  "data": {
    "languages": {
      "hi": "Hindi",
      "ta": "Tamil",
      "gu": "Gujarati",
      "bn": "Bengali",
      "te": "Telugu",
      "mr": "Marathi",
      "kn": "Kannada",
      "ml": "Malayalam",
      "pa": "Punjabi",
      "or": "Odia",
      "en": "English"
    },
    "count": 11
  }
}
```

### 3. Test Voice Service Status

**Endpoint:** `GET /api/v1/voice/test`

**Response:**
```json
{
  "status": "success",
  "data": {
    "available": true,
    "model_size": "base",
    "supported_formats": ["wav", "mp3", "ogg", "m4a", "flac", "webm"]
  }
}
```

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                   Voice Complaint Flow                   │
└─────────────────────────────────────────────────────────┘

1. Audio Upload (Citizen)
   ↓
2. File Validation & Storage
   ↓
3. Audio Preprocessing (Normalization, Format Conversion)
   ↓
4. ASR Transcription (OpenAI Whisper)
   ↓
5. Language Detection
   ↓
6. NLP Classification
   ├── Category Classification (Water, Health, etc.)
   ├── Urgency Detection
   └── Keyword Extraction
   ↓
7. Complaint Validation
   ├── Context Validation (Spam Detection)
   └── Duplicate Detection
   ↓
8. CRS Score Update
   ↓
9. Blockchain Hash Generation
   ↓
10. Database Storage
   ↓
11. Response to Citizen
```

## 🗂️ Project Structure

```
GramSetu AI/
├── services/
│   ├── voice_complaint_service.py    # Voice processing core
│   ├── multilingual_classifier.py    # Multi-language NLP
│   └── __init__.py
├── utils/
│   ├── audio_utils.py                # Audio utilities
│   └── __init__.py
├── uploads/
│   └── audio/                        # Temporary audio storage
├── app.py                            # Main Flask application
├── config.py                         # Base configuration
├── voice_config.py                   # Voice module configuration
├── requirements.txt                  # Python dependencies
├── test_voice_complaint.py           # Test script
└── VOICE_MODULE_README.md            # This file
```

## 🔧 Configuration

### Model Selection

Edit `voice_config.py` to choose Whisper model size:

```python
WHISPER_MODEL_SIZE = 'base'  # Options: tiny, base, small, medium, large
```

**Model Comparison:**

| Model  | Size   | Speed | Accuracy | Use Case |
|--------|--------|-------|----------|----------|
| tiny   | 39M    | ⚡⚡⚡⚡⚡ | ⭐⭐     | Development/Testing |
| base   | 74M    | ⚡⚡⚡⚡  | ⭐⭐⭐    | **Recommended** |
| small  | 244M   | ⚡⚡⚡   | ⭐⭐⭐⭐   | Better accuracy |
| medium | 769M   | ⚡⚡    | ⭐⭐⭐⭐⭐  | Production (GPU) |
| large  | 1550M  | ⚡     | ⭐⭐⭐⭐⭐  | Best quality (GPU) |

### Environment Variables

```bash
export WHISPER_MODEL_SIZE=base
export UPLOAD_FOLDER=uploads/audio
export MAX_AUDIO_SIZE=10485760  # 10 MB
export VOICE_LOG_LEVEL=INFO
```

## 📝 Example Usage

### Python Client

```python
import requests

def submit_voice_complaint(audio_path, citizen_id):
    """Submit a voice complaint"""
    
    with open(audio_path, 'rb') as audio_file:
        files = {'audio': audio_file}
        data = {'citizen_id': citizen_id}
        
        response = requests.post(
            'http://localhost:5000/api/v1/voice/upload',
            files=files,
            data=data
        )
        
        if response.status_code == 201:
            result = response.json()
            print(f"✅ Complaint Filed!")
            print(f"ID: {result['data']['complaint_id']}")
            print(f"Category: {result['data']['category']}")
            print(f"Text: {result['data']['text']}")
        else:
            print(f"❌ Error: {response.json()}")

# Usage
submit_voice_complaint('my_complaint.mp3', 'CIT12345')
```

### JavaScript/React Client

```javascript
async function submitVoiceComplaint(audioBlob, citizenId) {
  const formData = new FormData();
  formData.append('audio', audioBlob, 'complaint.webm');
  formData.append('citizen_id', citizenId);
  
  try {
    const response = await fetch('http://localhost:5000/api/v1/voice/upload', {
      method: 'POST',
      body: formData
    });
    
    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ Complaint Filed!', result.data);
      return result.data;
    } else {
      console.error('❌ Error:', result.message);
      throw new Error(result.message);
    }
  } catch (error) {
    console.error('Upload failed:', error);
    throw error;
  }
}

// Usage with MediaRecorder API
navigator.mediaDevices.getUserMedia({ audio: true })
  .then(stream => {
    const mediaRecorder = new MediaRecorder(stream);
    const chunks = [];
    
    mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'audio/webm' });
      submitVoiceComplaint(blob, 'CIT001');
    };
    
    mediaRecorder.start();
    setTimeout(() => mediaRecorder.stop(), 5000); // Record 5 seconds
  });
```

### Flutter Integration

```dart
import 'package:http/http.dart' as http;
import 'package:path/path.dart';

Future<Map<String, dynamic>> submitVoiceComplaint(
  String audioPath, 
  String citizenId
) async {
  var request = http.MultipartRequest(
    'POST',
    Uri.parse('http://localhost:5000/api/v1/voice/upload'),
  );
  
  request.files.add(
    await http.MultipartFile.fromPath('audio', audioPath)
  );
  request.fields['citizen_id'] = citizenId;
  
  var response = await request.send();
  var responseData = await response.stream.bytesToString();
  
  if (response.statusCode == 201) {
    print('✅ Complaint Filed!');
    return json.decode(responseData);
  } else {
    throw Exception('Upload failed: $responseData');
  }
}
```

## 🧪 Testing

### Run Tests

```bash
python test_voice_complaint.py
```

### Manual Testing with cURL

```bash
# Test health check
curl http://localhost:5000/health

# Test voice service
curl http://localhost:5000/api/v1/voice/test

# Get supported languages
curl http://localhost:5000/api/v1/voice/languages

# Upload audio file
curl -X POST http://localhost:5000/api/v1/voice/upload \
  -F "audio=@test_audio.mp3" \
  -F "citizen_id=TEST001"
```

## 🎯 Supported Languages & Examples

### Hindi (हिंदी)
```
"पानी की सप्लाई दो दिन से बंद है"
→ Category: Water, Urgency: High
```

### Tamil (தமிழ்)
```
"இரண்டு நாட்களாக தண்ணீர் வரவில்லை"
→ Category: Water, Urgency: High
```

### Gujarati (ગુજરાતી)
```
"બે દિવસથી પાણી આવતું નથી"
→ Category: Water, Urgency: High
```

### Bengali (বাংলা)
```
"দুই দিন ধরে পানি আসছে না"
→ Category: Water, Urgency: High
```

## 🔒 Security Best Practices

1. **File Validation**: All uploaded files are validated for format and size
2. **Temp File Cleanup**: Audio files are deleted after processing
3. **Rate Limiting**: Implement rate limiting in production
4. **Input Sanitization**: All text is sanitized before storage
5. **Blockchain Audit**: Every complaint is hashed for tamper-proof logging

## ⚡ Performance Optimization

### For Production

1. **Use GPU**: Install CUDA for 10x faster processing
```bash
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu118
```

2. **Model Caching**: Models are cached after first load
3. **Lazy Loading**: Whisper model loads on first use
4. **Batch Processing**: Process multiple complaints together
5. **CDN for Audio**: Store processed audio in cloud storage

### Performance Benchmarks

| Model | Audio Length | Processing Time (CPU) | Processing Time (GPU) |
|-------|--------------|----------------------|----------------------|
| tiny  | 10s          | ~2s                  | ~0.5s                |
| base  | 10s          | ~3s                  | ~1s                  |
| small | 10s          | ~8s                  | ~2s                  |
| medium| 10s          | ~20s                 | ~4s                  |

## 🐛 Troubleshooting

### Issue: FFmpeg not found
```bash
# Install FFmpeg
brew install ffmpeg  # macOS
sudo apt install ffmpeg  # Ubuntu
```

### Issue: Whisper model download fails
```bash
# Set cache directory
export TRANSFORMERS_CACHE=/path/to/cache
export WHISPER_CACHE=/path/to/cache
```

### Issue: Out of memory
```bash
# Use smaller model
export WHISPER_MODEL_SIZE=tiny
```

### Issue: Import errors
```bash
# Reinstall dependencies
pip install --upgrade -r requirements.txt
```

## 🚀 Deployment

### Production Checklist

- [ ] Set `WHISPER_MODEL_SIZE=medium` or `large`
- [ ] Enable HTTPS
- [ ] Configure rate limiting
- [ ] Set up cloud storage for audio files
- [ ] Enable logging and monitoring
- [ ] Configure auto-scaling
- [ ] Set up CDN
- [ ] Enable GPU acceleration
- [ ] Configure backup strategy

### Docker Deployment

```dockerfile
FROM python:3.9-slim

# Install FFmpeg
RUN apt-get update && apt-get install -y ffmpeg

# Install dependencies
COPY requirements.txt .
RUN pip install -r requirements.txt

# Copy application
COPY . /app
WORKDIR /app

# Expose port
EXPOSE 5000

# Run application
CMD ["python", "app.py"]
```

## 📊 Monitoring & Analytics

Track these metrics in production:
- Transcription accuracy rate
- Average processing time
- Language distribution
- Category distribution
- Error rate
- API response times

## 🔮 Future Enhancements

- [ ] Real-time streaming ASR
- [ ] Speaker diarization (multiple speakers)
- [ ] Sentiment analysis
- [ ] Translation to English for all complaints
- [ ] Voice activity detection (VAD)
- [ ] Noise reduction
- [ ] Regional accent adaptation
- [ ] Integration with WhatsApp/Telegram bots

## 📞 Support

For issues or questions:
- Open an issue on GitHub
- Check existing documentation
- Review test cases in `test_voice_complaint.py`

## 📄 License

This module is part of GramSetu AI - National Governance Intelligence Network.

---

**Built with ❤️ for Bharat's Digital Governance**
