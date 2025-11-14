import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

const VoiceComplaint = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('hi');
  const [audioBlob, setAudioBlob] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [supportedLanguages, setSupportedLanguages] = useState({});
  
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  // Fetch supported languages
  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/v1/voice/languages');
        if (response.data.status === 'success') {
          setSupportedLanguages(response.data.data.languages);
        }
      } catch (err) {
        // Use default languages if API fails
        setSupportedLanguages({
          'hi': 'Hindi',
          'en': 'English',
          'ta': 'Tamil',
          'gu': 'Gujarati',
          'bn': 'Bengali',
          'te': 'Telugu',
          'mr': 'Marathi',
          'kn': 'Kannada',
          'ml': 'Malayalam',
          'pa': 'Punjabi',
          'or': 'Odia'
        });
      }
    };
    fetchLanguages();
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioBlob(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setError(null);
      setResult(null);
    } catch (err) {
      setError('Microphone access denied. Please enable microphone permissions.');
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

    setIsProcessing(true);
    setError(null);

    const formData = new FormData();
    formData.append('audio', audioBlob, 'complaint.webm');
    formData.append('citizen_id', 'WEB001'); // This should come from user session
    formData.append('language', selectedLanguage);

    try {
      const response = await axios.post(
        'http://localhost:5000/api/v1/voice/upload',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          timeout: 60000,
        }
      );

      if (response.data.status === 'success') {
        setResult(response.data.data);
        setAudioBlob(null);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to process voice complaint. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const clearRecording = () => {
    setAudioBlob(null);
    setResult(null);
    setError(null);
  };

  return (
    <div className="voice-complaint-container">
      <div className="voice-complaint-header">
        <h2>🎤 Voice Complaint System</h2>
        <p>Speak in your native language - AI will understand and process your complaint</p>
      </div>

      {/* Language Selector */}
      <div className="language-selector">
        {Object.entries(supportedLanguages).map(([code, name]) => (
          <button
            key={code}
            className={`lang-btn ${selectedLanguage === code ? 'active' : ''}`}
            onClick={() => setSelectedLanguage(code)}
            disabled={isRecording}
          >
            {name}
          </button>
        ))}
      </div>

      {/* Recording Controls */}
      <div className="voice-controls">
        {!isRecording && !audioBlob && (
          <button className="voice-record-btn" onClick={startRecording}>
            <span className="voice-icon">🎤</span>
            <span>Start Recording</span>
          </button>
        )}

        {isRecording && (
          <button className="voice-record-btn recording" onClick={stopRecording}>
            <span className="voice-icon pulse">🔴</span>
            <span>Stop Recording</span>
          </button>
        )}

        {audioBlob && !isProcessing && !result && (
          <div className="audio-controls">
            <audio src={URL.createObjectURL(audioBlob)} controls />
            <div className="button-group">
              <button className="btn btn-primary" onClick={submitComplaint}>
                Submit Complaint
              </button>
              <button className="btn btn-secondary" onClick={clearRecording}>
                Re-record
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Processing Indicator */}
      {isProcessing && (
        <div className="processing-indicator">
          <div className="spinner"></div>
          <p>Processing your voice complaint...</p>
          <p className="processing-steps">
            🎙️ Transcribing audio → 🌐 Detecting language → 🤖 Classifying complaint → 📊 Analyzing urgency
          </p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          <p>{error}</p>
        </div>
      )}

      {/* Success Result */}
      {result && (
        <div className="result-card">
          <div className="result-header">
            <span className="success-icon">✅</span>
            <h3>Complaint Registered Successfully!</h3>
          </div>
          
          <div className="result-details">
            <div className="result-row">
              <span className="label">Complaint ID:</span>
              <span className="value highlight">{result.complaint_id}</span>
            </div>
            
            <div className="result-row">
              <span className="label">Transcribed Text:</span>
              <span className="value">{result.text}</span>
            </div>
            
            <div className="result-row">
              <span className="label">Category:</span>
              <span className={`badge badge-${result.category.toLowerCase().replace(/\s+/g, '-')}`}>
                {result.category}
              </span>
            </div>
            
            <div className="result-row">
              <span className="label">Urgency:</span>
              <span className={`badge badge-urgency-${result.urgency.toLowerCase()}`}>
                {result.urgency}
              </span>
            </div>
            
            <div className="result-row">
              <span className="label">Language:</span>
              <span className="value">{result.language}</span>
            </div>
            
            <div className="result-row">
              <span className="label">Timestamp:</span>
              <span className="value">{new Date(result.timestamp).toLocaleString()}</span>
            </div>

            {result.keywords && result.keywords.length > 0 && (
              <div className="result-row">
                <span className="label">Keywords:</span>
                <div className="keywords">
                  {result.keywords.map((keyword, idx) => (
                    <span key={idx} className="keyword-tag">{keyword}</span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <button className="btn btn-primary" onClick={clearRecording}>
            File Another Complaint
          </button>
        </div>
      )}

      <style jsx>{`
        .voice-complaint-container {
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          border-radius: 24px;
          padding: 3rem;
          margin: 2rem 0;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        }

        .voice-complaint-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .voice-complaint-header h2 {
          font-size: 2rem;
          color: white;
          margin-bottom: 0.5rem;
        }

        .voice-complaint-header p {
          color: rgba(255, 255, 255, 0.9);
          font-size: 1.125rem;
        }

        .voice-controls {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2rem;
          margin: 2rem 0;
        }

        .audio-controls {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          width: 100%;
          max-width: 500px;
        }

        .audio-controls audio {
          width: 100%;
          border-radius: 12px;
        }

        .button-group {
          display: flex;
          gap: 1rem;
        }

        .btn {
          padding: 0.75rem 2rem;
          border: none;
          border-radius: 50px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 1rem;
        }

        .btn-primary {
          background: white;
          color: #6366f1;
        }

        .btn-primary:hover {
          transform: scale(1.05);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        }

        .btn-secondary {
          background: rgba(255, 255, 255, 0.2);
          color: white;
          border: 2px solid white;
        }

        .btn-secondary:hover {
          background: rgba(255, 255, 255, 0.3);
        }

        .processing-indicator {
          text-align: center;
          padding: 2rem;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          color: white;
        }

        .spinner {
          width: 50px;
          height: 50px;
          border: 4px solid rgba(255, 255, 255, 0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 1rem;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .processing-steps {
          margin-top: 1rem;
          font-size: 0.9rem;
          opacity: 0.8;
        }

        .error-message {
          background: rgba(239, 68, 68, 0.2);
          border: 2px solid #ef4444;
          border-radius: 16px;
          padding: 1.5rem;
          color: white;
          text-align: center;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
        }

        .error-icon {
          font-size: 2rem;
        }

        .result-card {
          background: white;
          border-radius: 20px;
          padding: 2rem;
          color: #0f172a;
          margin-top: 2rem;
        }

        .result-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 2rem;
          padding-bottom: 1rem;
          border-bottom: 2px solid #e2e8f0;
        }

        .success-icon {
          font-size: 2.5rem;
        }

        .result-header h3 {
          font-size: 1.5rem;
          color: #10b981;
          margin: 0;
        }

        .result-details {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .result-row {
          display: flex;
          gap: 1rem;
          align-items: center;
          padding: 0.75rem;
          background: #f8fafc;
          border-radius: 12px;
        }

        .label {
          font-weight: 600;
          color: #64748b;
          min-width: 150px;
        }

        .value {
          color: #0f172a;
          flex: 1;
        }

        .value.highlight {
          font-size: 1.25rem;
          font-weight: 700;
          color: #6366f1;
        }

        .badge {
          padding: 0.5rem 1rem;
          border-radius: 50px;
          font-size: 0.875rem;
          font-weight: 700;
          text-transform: uppercase;
        }

        .badge-water { background: #06b6d4; color: white; }
        .badge-health { background: #ef4444; color: white; }
        .badge-electricity { background: #f59e0b; color: white; }
        .badge-road { background: #64748b; color: white; }
        .badge-sanitation { background: #8b5cf6; color: white; }
        .badge-education { background: #3b82f6; color: white; }
        .badge-agriculture { background: #10b981; color: white; }
        .badge-law-&-order { background: #dc2626; color: white; }
        .badge-other { background: #6b7280; color: white; }

        .badge-urgency-high { background: #ef4444; color: white; }
        .badge-urgency-medium { background: #f59e0b; color: white; }
        .badge-urgency-low { background: #10b981; color: white; }

        .keywords {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .keyword-tag {
          padding: 0.25rem 0.75rem;
          background: #e0e7ff;
          color: #4f46e5;
          border-radius: 50px;
          font-size: 0.875rem;
          font-weight: 500;
        }

        @media (max-width: 768px) {
          .voice-complaint-container {
            padding: 1.5rem;
          }

          .language-selector {
            grid-template-columns: repeat(2, 1fr);
          }

          .result-row {
            flex-direction: column;
            align-items: flex-start;
          }

          .label {
            min-width: auto;
          }
        }
      `}</style>
    </div>
  );
};

export default VoiceComplaint;
