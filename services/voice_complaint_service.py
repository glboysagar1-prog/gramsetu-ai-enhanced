"""
GramSetu AI - Voice Complaint Service
ASR (Automatic Speech Recognition) and Voice Processing Module

Features:
- Multi-language ASR using OpenAI Whisper
- Support for Indian languages (Hindi, Tamil, Gujarati, Bengali, Telugu, etc.)
- Audio file validation and preprocessing
- Integration with complaint classification system
- Secure API key management
"""

import os
import logging
import tempfile
import uuid
from datetime import datetime
from typing import Dict, Tuple, Optional
from pathlib import Path

# Audio processing
import whisper
from pydub import AudioSegment
import speech_recognition as sr

# Language detection
from langdetect import detect, DetectError

logger = logging.getLogger(__name__)


class VoiceComplaintService:
    """
    Service class for processing voice complaints using ASR
    """
    
    # Supported languages (ISO 639-1 codes)
    SUPPORTED_LANGUAGES = {
        'hi': 'Hindi',
        'ta': 'Tamil',
        'gu': 'Gujarati',
        'bn': 'Bengali',
        'te': 'Telugu',
        'mr': 'Marathi',
        'kn': 'Kannada',
        'ml': 'Malayalam',
        'pa': 'Punjabi',
        'or': 'Odia',
        'en': 'English'
    }
    
    # Supported audio formats
    SUPPORTED_FORMATS = ['wav', 'mp3', 'ogg', 'm4a', 'flac', 'webm']
    
    # Max file size (10 MB)
    MAX_FILE_SIZE = 10 * 1024 * 1024
    
    def __init__(self, model_size: str = 'base'):
        """
        Initialize the voice complaint service
        
        Args:
            model_size: Whisper model size ('tiny', 'base', 'small', 'medium', 'large')
                       - 'tiny': Fastest, least accurate
                       - 'base': Good balance (recommended for production)
                       - 'medium': Better accuracy, slower
                       - 'large': Best accuracy, requires GPU
        """
        self.model_size = model_size
        self.whisper_model = None
        self.speech_recognizer = sr.Recognizer()
        
        logger.info(f"Initializing VoiceComplaintService with model size: {model_size}")
        self._load_model()
    
    def _load_model(self):
        """Load Whisper ASR model"""
        try:
            logger.info(f"Loading Whisper model: {self.model_size}")
            self.whisper_model = whisper.load_model(self.model_size)
            logger.info("Whisper model loaded successfully!")
        except Exception as e:
            logger.error(f"Failed to load Whisper model: {str(e)}")
            raise
    
    def validate_audio_file(self, file_path: str) -> Tuple[bool, str]:
        """
        Validate audio file format and size
        
        Args:
            file_path: Path to the audio file
        
        Returns:
            Tuple of (is_valid, error_message)
        """
        try:
            # Check if file exists
            if not os.path.exists(file_path):
                return False, "File not found"
            
            # Check file size
            file_size = os.path.getsize(file_path)
            if file_size > self.MAX_FILE_SIZE:
                return False, f"File size exceeds maximum limit of {self.MAX_FILE_SIZE / (1024*1024):.1f} MB"
            
            if file_size == 0:
                return False, "File is empty"
            
            # Check file extension
            file_extension = Path(file_path).suffix.lower().lstrip('.')
            if file_extension not in self.SUPPORTED_FORMATS:
                return False, f"Unsupported format. Supported formats: {', '.join(self.SUPPORTED_FORMATS)}"
            
            # Try to load audio file
            try:
                audio = AudioSegment.from_file(file_path)
                
                # Check duration (min 1 second, max 5 minutes)
                duration_seconds = len(audio) / 1000
                if duration_seconds < 1:
                    return False, "Audio too short (minimum 1 second)"
                if duration_seconds > 300:  # 5 minutes
                    return False, "Audio too long (maximum 5 minutes)"
                
            except Exception as e:
                return False, f"Invalid audio file: {str(e)}"
            
            return True, "Valid audio file"
            
        except Exception as e:
            return False, f"Validation error: {str(e)}"
    
    def preprocess_audio(self, file_path: str) -> str:
        """
        Preprocess audio file for better ASR results
        
        Args:
            file_path: Path to the audio file
        
        Returns:
            Path to the preprocessed audio file
        """
        try:
            logger.info(f"Preprocessing audio file: {file_path}")
            
            # Load audio
            audio = AudioSegment.from_file(file_path)
            
            # Normalize audio
            # Convert to mono
            if audio.channels > 1:
                audio = audio.set_channels(1)
            
            # Set sample rate to 16kHz (optimal for Whisper)
            audio = audio.set_frame_rate(16000)
            
            # Normalize volume
            audio = audio.normalize()
            
            # Remove silence from start and end
            audio = audio.strip_silence(silence_thresh=-40, padding=100)
            
            # Create temporary file for preprocessed audio
            temp_file = tempfile.NamedTemporaryFile(delete=False, suffix='.wav')
            temp_path = temp_file.name
            temp_file.close()
            
            # Export preprocessed audio
            audio.export(temp_path, format='wav')
            
            logger.info(f"Audio preprocessed successfully: {temp_path}")
            return temp_path
            
        except Exception as e:
            logger.error(f"Audio preprocessing error: {str(e)}")
            raise
    
    def transcribe_audio(self, file_path: str, language: Optional[str] = None) -> Dict:
        """
        Transcribe audio file to text using Whisper
        
        Args:
            file_path: Path to the audio file
            language: Optional language code (auto-detect if None)
        
        Returns:
            Dictionary with transcription results
        """
        try:
            logger.info(f"Transcribing audio: {file_path}")
            
            # Validate audio file
            is_valid, validation_message = self.validate_audio_file(file_path)
            if not is_valid:
                raise ValueError(validation_message)
            
            # Preprocess audio
            preprocessed_path = self.preprocess_audio(file_path)
            
            try:
                # Transcribe using Whisper
                transcribe_options = {
                    'fp16': False,  # Use FP32 for CPU compatibility
                    'verbose': False
                }
                
                if language and language in self.SUPPORTED_LANGUAGES:
                    transcribe_options['language'] = language
                
                result = self.whisper_model.transcribe(preprocessed_path, **transcribe_options)
                
                # Extract transcription results
                text = result['text'].strip()
                detected_language = result.get('language', 'unknown')
                
                # Detect language if not provided
                try:
                    if not language:
                        detected_lang_code = detect(text)
                        detected_language = self.SUPPORTED_LANGUAGES.get(
                            detected_lang_code, 
                            detected_language
                        )
                except DetectError:
                    logger.warning("Language detection failed, using Whisper's detection")
                
                logger.info(f"Transcription successful: {len(text)} characters, Language: {detected_language}")
                
                return {
                    'success': True,
                    'text': text,
                    'language': detected_language,
                    'language_code': result.get('language', 'unknown'),
                    'segments': result.get('segments', []),
                    'duration': sum(seg['end'] - seg['start'] for seg in result.get('segments', []))
                }
                
            finally:
                # Clean up preprocessed file
                if os.path.exists(preprocessed_path):
                    os.remove(preprocessed_path)
            
        except Exception as e:
            logger.error(f"Transcription error: {str(e)}")
            return {
                'success': False,
                'error': str(e),
                'text': '',
                'language': 'unknown'
            }
    
    def process_voice_complaint(
        self, 
        file_path: str, 
        citizen_id: str,
        language: Optional[str] = None
    ) -> Dict:
        """
        Process complete voice complaint workflow
        
        Args:
            file_path: Path to the audio file
            citizen_id: ID of the citizen filing the complaint
            language: Optional language code
        
        Returns:
            Complete complaint data with transcription and metadata
        """
        try:
            logger.info(f"Processing voice complaint for citizen: {citizen_id}")
            
            # Transcribe audio
            transcription_result = self.transcribe_audio(file_path, language)
            
            if not transcription_result['success']:
                return {
                    'success': False,
                    'error': transcription_result.get('error', 'Transcription failed')
                }
            
            # Generate complaint ID
            complaint_id = self._generate_complaint_id()
            
            # Get timestamp
            timestamp = datetime.utcnow().isoformat() + 'Z'
            
            # Prepare complaint data
            complaint_data = {
                'success': True,
                'complaint_id': complaint_id,
                'citizen_id': citizen_id,
                'text': transcription_result['text'],
                'language': transcription_result['language'],
                'language_code': transcription_result['language_code'],
                'timestamp': timestamp,
                'source': 'voice',
                'audio_duration': transcription_result.get('duration', 0),
                'segments': transcription_result.get('segments', [])
            }
            
            logger.info(f"Voice complaint processed successfully: {complaint_id}")
            return complaint_data
            
        except Exception as e:
            logger.error(f"Voice complaint processing error: {str(e)}")
            return {
                'success': False,
                'error': str(e)
            }
    
    def _generate_complaint_id(self) -> str:
        """
        Generate unique complaint ID
        
        Returns:
            Formatted complaint ID (GSAI-YYYY-NNNN)
        """
        year = datetime.now().year
        unique_id = str(uuid.uuid4().int)[:4]
        return f"GSAI-{year}-{unique_id}"
    
    def get_supported_languages(self) -> Dict[str, str]:
        """
        Get list of supported languages
        
        Returns:
            Dictionary of language codes and names
        """
        return self.SUPPORTED_LANGUAGES.copy()


# Singleton instance (optional, for better performance)
_voice_service_instance = None

def get_voice_service(model_size: str = 'base') -> VoiceComplaintService:
    """
    Get singleton instance of VoiceComplaintService
    
    Args:
        model_size: Whisper model size
    
    Returns:
        VoiceComplaintService instance
    """
    global _voice_service_instance
    
    if _voice_service_instance is None:
        _voice_service_instance = VoiceComplaintService(model_size)
    
    return _voice_service_instance
