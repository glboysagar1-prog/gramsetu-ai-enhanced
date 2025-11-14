# 🚀 GramSetu AI - Voice Complaint Module Integration Guide

## Quick Start (5 Minutes)

### 1. Install Dependencies

```bash
# Run the automated setup script
./setup_voice_module.sh
```

**OR manually:**

```bash
# Install Python packages
pip install -r requirements.txt

# Install FFmpeg
brew install ffmpeg  # macOS
# OR
sudo apt-get install ffmpeg  # Ubuntu/Debian

# Create directories
mkdir -p uploads/audio
```

### 2. Start the Server

```bash
python app.py
```

Server will start at: `http://localhost:5000`

### 3. Test It!

```bash
# Run the test suite
python test_voice_complaint.py

# OR try the sample client
python sample_voice_client.py
```

---

## 📱 Integration Examples

### For Flutter App (Citizen/Field Worker)

```dart
// lib/services/voice_complaint_service.dart

import 'dart:io';
import 'package:http/http.dart' as http;
import 'package:path/path.dart';
import 'dart:convert';

class VoiceComplaintService {
  final String baseUrl = 'http://localhost:5000/api/v1';
  
  Future<Map<String, dynamic>> submitVoiceComplaint({
    required String audioPath,
    required String citizenId,
    String? language,
  }) async {
    try {
      var request = http.MultipartRequest(
        'POST',
        Uri.parse('$baseUrl/voice/upload'),
      );
      
      // Add audio file
      request.files.add(
        await http.MultipartFile.fromPath('audio', audioPath),
      );
      
      // Add form fields
      request.fields['citizen_id'] = citizenId;
      if (language != null) {
        request.fields['language'] = language;
      }
      
      // Send request
      var response = await request.send();
      var responseData = await response.stream.bytesToString();
      var jsonResponse = json.decode(responseData);
      
      if (response.statusCode == 201) {
        return {
          'success': true,
          'data': jsonResponse['data'],
        };
      } else {
        return {
          'success': false,
          'error': jsonResponse['message'],
        };
      }
    } catch (e) {
      return {
        'success': false,
        'error': e.toString(),
      };
    }
  }
  
  Future<List<String>> getSupportedLanguages() async {
    try {
      var response = await http.get(
        Uri.parse('$baseUrl/voice/languages'),
      );
      
      if (response.statusCode == 200) {
        var data = json.decode(response.body);
        return List<String>.from(
          data['data']['languages'].keys
        );
      }
      return [];
    } catch (e) {
      print('Error getting languages: $e');
      return [];
    }
  }
}

// Usage in UI
class VoiceComplaintScreen extends StatefulWidget {
  @override
  _VoiceComplaintScreenState createState() => _VoiceComplaintScreenState();
}

class _VoiceComplaintScreenState extends State<VoiceComplaintScreen> {
  final VoiceComplaintService _service = VoiceComplaintService();
  bool _isRecording = false;
  bool _isUploading = false;
  String? _audioPath;
  
  Future<void> _recordVoice() async {
    // Use audio recording package
    // Example: record, audioplayers, etc.
    setState(() => _isRecording = true);
    
    // Record audio logic here
    // Save to _audioPath
    
    setState(() => _isRecording = false);
  }
  
  Future<void> _submitComplaint() async {
    if (_audioPath == null) return;
    
    setState(() => _isUploading = true);
    
    final result = await _service.submitVoiceComplaint(
      audioPath: _audioPath!,
      citizenId: 'CIT001',
      language: 'hi', // Hindi
    );
    
    setState(() => _isUploading = false);
    
    if (result['success']) {
      // Show success message
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Complaint filed: ${result['data']['complaint_id']}'),
          backgroundColor: Colors.green,
        ),
      );
    } else {
      // Show error
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Error: ${result['error']}'),
          backgroundColor: Colors.red,
        ),
      );
    }
  }
  
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Voice Complaint')),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            if (_isRecording)
              CircularProgressIndicator(),
            
            ElevatedButton.icon(
              icon: Icon(Icons.mic),
              label: Text(_isRecording ? 'Recording...' : 'Record Complaint'),
              onPressed: _isRecording ? null : _recordVoice,
            ),
            
            SizedBox(height: 20),
            
            if (_audioPath != null)
              ElevatedButton.icon(
                icon: Icon(Icons.upload),
                label: Text(_isUploading ? 'Uploading...' : 'Submit Complaint'),
                onPressed: _isUploading ? null : _submitComplaint,
              ),
          ],
        ),
      ),
    );
  }
}
```

### For React Dashboard

```javascript
// src/services/voiceComplaintService.js

import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api/v1';

export const voiceComplaintService = {
  /**
   * Submit a voice complaint
   * @param {File} audioFile - Audio file blob
   * @param {string} citizenId - Citizen ID
   * @param {string} language - Optional language code
   */
  async submitVoiceComplaint(audioFile, citizenId, language = null) {
    try {
      const formData = new FormData();
      formData.append('audio', audioFile);
      formData.append('citizen_id', citizenId);
      
      if (language) {
        formData.append('language', language);
      }
      
      const response = await axios.post(
        `${API_BASE_URL}/voice/upload`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          timeout: 60000, // 60 second timeout
        }
      );
      
      return {
        success: true,
        data: response.data.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message,
      };
    }
  },
  
  /**
   * Get supported languages
   */
  async getSupportedLanguages() {
    try {
      const response = await axios.get(`${API_BASE_URL}/voice/languages`);
      return response.data.data.languages;
    } catch (error) {
      console.error('Error getting languages:', error);
      return {};
    }
  },
  
  /**
   * Check if voice service is available
   */
  async checkVoiceService() {
    try {
      const response = await axios.get(`${API_BASE_URL}/voice/test`);
      return response.data.data.available;
    } catch (error) {
      return false;
    }
  },
};

// React component example
import React, { useState, useRef } from 'react';
import { voiceComplaintService } from './services/voiceComplaintService';

function VoiceComplaintRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      mediaRecorderRef.current = new MediaRecorder(stream);
      chunksRef.current = [];
      
      mediaRecorderRef.current.ondataavailable = (e) => {
        chunksRef.current.push(e.data);
      };
      
      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Recording error:', error);
      alert('Failed to start recording. Please check microphone permissions.');
    }
  };
  
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };
  
  const submitComplaint = async () => {
    if (!audioBlob) return;
    
    setIsUploading(true);
    
    // Create File object from Blob
    const audioFile = new File([audioBlob], 'complaint.webm', {
      type: 'audio/webm'
    });
    
    const result = await voiceComplaintService.submitVoiceComplaint(
      audioFile,
      'CIT001', // Replace with actual citizen ID
      'hi' // Hindi
    );
    
    setIsUploading(false);
    
    if (result.success) {
      alert(`Complaint filed! ID: ${result.data.complaint_id}\nCategory: ${result.data.category}`);
      setAudioBlob(null);
    } else {
      alert(`Error: ${result.error}`);
    }
  };
  
  return (
    <div className="voice-complaint-recorder">
      <h3>Voice Complaint</h3>
      
      <div className="controls">
        {!isRecording ? (
          <button 
            onClick={startRecording}
            className="btn btn-primary"
            disabled={isUploading}
          >
            🎤 Start Recording
          </button>
        ) : (
          <button 
            onClick={stopRecording}
            className="btn btn-danger"
          >
            ⏹️ Stop Recording
          </button>
        )}
        
        {audioBlob && !isRecording && (
          <button 
            onClick={submitComplaint}
            className="btn btn-success"
            disabled={isUploading}
          >
            {isUploading ? '⏳ Uploading...' : '📤 Submit Complaint'}
          </button>
        )}
      </div>
      
      {isRecording && (
        <div className="recording-indicator">
          <span className="pulse">🔴</span> Recording...
        </div>
      )}
      
      {audioBlob && !isRecording && (
        <div className="audio-preview">
          <audio src={URL.createObjectURL(audioBlob)} controls />
        </div>
      )}
    </div>
  );
}

export default VoiceComplaintRecorder;
```

### For Python Backend Integration

```python
# your_app.py - Integrate into your existing Flask app

from services.voice_complaint_service import get_voice_service
from services.multilingual_classifier import get_classifier

# Initialize services
voice_service = get_voice_service(model_size='base')
classifier = get_classifier()

@app.route('/process-voice', methods=['POST'])
def process_voice():
    """Process voice complaint"""
    
    # Get uploaded file
    audio_file = request.files.get('audio')
    citizen_id = request.form.get('citizen_id')
    
    # Save temporarily
    temp_path = f'/tmp/{citizen_id}_{datetime.now().timestamp()}.wav'
    audio_file.save(temp_path)
    
    try:
        # Process voice
        result = voice_service.process_voice_complaint(
            file_path=temp_path,
            citizen_id=citizen_id
        )
        
        if result['success']:
            # Classify
            analysis = classifier.analyze_complaint(
                result['text'],
                result['language']
            )
            
            # Merge results
            complaint_data = {
                **result,
                **analysis
            }
            
            # Save to database
            save_complaint(complaint_data)
            
            return jsonify({
                'success': True,
                'data': complaint_data
            })
        else:
            return jsonify({
                'success': False,
                'error': result['error']
            }), 500
            
    finally:
        # Cleanup
        if os.path.exists(temp_path):
            os.remove(temp_path)
```

---

## 🔌 API Integration Reference

### Complete API Specification

#### 1. Upload Voice Complaint

```http
POST /api/v1/voice/upload
Content-Type: multipart/form-data

Parameters:
- audio (file, required): Audio file
- citizen_id (string, required): Citizen identifier
- language (string, optional): Language code

Response (201 Created):
{
  "status": "success",
  "data": {
    "complaint_id": "GSAI-2025-0001",
    "text": "Transcribed text",
    "category": "Water",
    "urgency": "High",
    "language": "Hindi",
    "timestamp": "2025-10-22T14:22:31Z",
    "hash": "abc123...",
    "is_valid": true,
    "is_duplicate": false,
    "crs_score": 102,
    "audio_duration": 5.2,
    "keywords": ["pani", "nahi"]
  }
}
```

#### 2. Get Supported Languages

```http
GET /api/v1/voice/languages

Response (200 OK):
{
  "status": "success",
  "data": {
    "languages": {
      "hi": "Hindi",
      "ta": "Tamil",
      ...
    },
    "count": 11
  }
}
```

#### 3. Test Voice Service

```http
GET /api/v1/voice/test

Response (200 OK):
{
  "status": "success",
  "data": {
    "available": true,
    "model_size": "base",
    "supported_formats": ["wav", "mp3", ...]
  }
}
```

---

## 🔥 Production Deployment

### Docker Compose

```yaml
# docker-compose.yml
version: '3.8'

services:
  gramsetu-api:
    build: .
    ports:
      - "5000:5000"
    environment:
      - WHISPER_MODEL_SIZE=medium
      - FLASK_ENV=production
      - MAX_AUDIO_SIZE=10485760
    volumes:
      - ./uploads:/app/uploads
      - model-cache:/root/.cache/whisper
    restart: unless-stopped
  
  gramsetu-db:
    image: postgres:14
    environment:
      - POSTGRES_DB=gramsetu
      - POSTGRES_PASSWORD=secure_password
    volumes:
      - db-data:/var/lib/postgresql/data

volumes:
  model-cache:
  db-data:
```

### Kubernetes Deployment

```yaml
# k8s-deployment.yml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: gramsetu-voice-api
spec:
  replicas: 3
  selector:
    matchLabels:
      app: gramsetu-voice
  template:
    metadata:
      labels:
        app: gramsetu-voice
    spec:
      containers:
      - name: api
        image: gramsetu/voice-api:latest
        ports:
        - containerPort: 5000
        env:
        - name: WHISPER_MODEL_SIZE
          value: "medium"
        resources:
          requests:
            memory: "2Gi"
            cpu: "1000m"
          limits:
            memory: "4Gi"
            cpu: "2000m"
        volumeMounts:
        - name: model-cache
          mountPath: /root/.cache/whisper
      volumes:
      - name: model-cache
        persistentVolumeClaim:
          claimName: whisper-models-pvc
```

---

## 📊 Monitoring & Logging

### Setup Logging

```python
# Add to app.py
import logging
from logging.handlers import RotatingFileHandler

# Configure logging
handler = RotatingFileHandler(
    'logs/voice_complaints.log',
    maxBytes=10485760,  # 10MB
    backupCount=10
)

formatter = logging.Formatter(
    '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

handler.setFormatter(formatter)
logger.addHandler(handler)
```

### Track Metrics

```python
# metrics.py
from prometheus_client import Counter, Histogram

voice_complaints_total = Counter(
    'voice_complaints_total',
    'Total voice complaints processed'
)

transcription_duration = Histogram(
    'transcription_duration_seconds',
    'Time spent transcribing audio'
)
```

---

## 🛠️ Troubleshooting

### Common Issues

**Issue: ModuleNotFoundError: No module named 'whisper'**
```bash
pip install openai-whisper
```

**Issue: FFmpeg not found**
```bash
# macOS
brew install ffmpeg

# Ubuntu
sudo apt-get install ffmpeg
```

**Issue: CUDA out of memory**
```python
# Use smaller model
WHISPER_MODEL_SIZE = 'base'  # or 'tiny'
```

**Issue: Slow transcription**
```python
# Use GPU if available
import torch
print(torch.cuda.is_available())  # Should return True

# Or use smaller model
WHISPER_MODEL_SIZE = 'tiny'
```

---

## 📈 Performance Tuning

### Optimize for Production

1. **Use GPU**: 10x faster processing
2. **Model Caching**: Keep models in memory
3. **Async Processing**: Use Celery for background tasks
4. **CDN**: Store audio files in cloud storage
5. **Rate Limiting**: Prevent API abuse

### Scaling Strategy

- **Horizontal**: Add more API servers
- **Vertical**: Use GPU instances
- **Caching**: Redis for frequent queries
- **Queue**: RabbitMQ for async processing

---

## ✅ Testing Checklist

Before going to production:

- [ ] Test with all supported languages
- [ ] Test with different audio formats
- [ ] Test file size limits
- [ ] Test error handling
- [ ] Load testing (100+ concurrent requests)
- [ ] Security audit
- [ ] Monitor resource usage
- [ ] Setup logging and alerts
- [ ] Backup strategy
- [ ] Disaster recovery plan

---

## 📞 Support & Resources

- **Documentation**: See `VOICE_MODULE_README.md`
- **Test Suite**: Run `python test_voice_complaint.py`
- **Sample Client**: Run `python sample_voice_client.py`
- **Setup Script**: Run `./setup_voice_module.sh`

---

**Built with ❤️ for Digital India**
