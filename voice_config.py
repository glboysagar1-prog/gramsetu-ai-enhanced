"""
GramSetu AI - Voice Complaint Configuration
Extended configuration for voice processing module
"""

import os
from config import Config


class VoiceConfig(Config):
    """Voice complaint module configuration"""
    
    # Whisper ASR settings
    WHISPER_MODEL_SIZE = os.environ.get('WHISPER_MODEL_SIZE', 'base')
    # Options: 'tiny', 'base', 'small', 'medium', 'large'
    # - tiny: ~39M params, fastest, least accurate
    # - base: ~74M params, good balance (recommended)
    # - small: ~244M params, better accuracy
    # - medium: ~769M params, very good accuracy, requires GPU
    # - large: ~1550M params, best accuracy, requires powerful GPU
    
    # Audio upload settings
    UPLOAD_FOLDER = os.environ.get('UPLOAD_FOLDER', 'uploads/audio')
    MAX_AUDIO_SIZE = int(os.environ.get('MAX_AUDIO_SIZE', 10 * 1024 * 1024))  # 10 MB
    ALLOWED_AUDIO_FORMATS = ['wav', 'mp3', 'ogg', 'm4a', 'flac', 'webm', 'aac']
    
    # Audio processing settings
    AUDIO_SAMPLE_RATE = 16000  # 16kHz optimal for Whisper
    AUDIO_CHANNELS = 1  # Mono
    AUDIO_MIN_DURATION = 1  # seconds
    AUDIO_MAX_DURATION = 300  # 5 minutes
    
    # Language settings for Indian languages
    SUPPORTED_INDIAN_LANGUAGES = {
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
    
    # Default language if detection fails
    DEFAULT_LANGUAGE = 'hi'  # Hindi
    
    # ASR processing settings
    ASR_FP16 = False  # Use FP32 for CPU compatibility
    ASR_VERBOSE = False  # Reduce logging during transcription
    ASR_BEST_OF = 5  # Number of candidates when sampling
    ASR_BEAM_SIZE = 5  # Beam size for beam search
    
    # Translation settings (for future enhancement)
    USE_TRANSLATION = os.environ.get('USE_TRANSLATION', 'false').lower() == 'true'
    TRANSLATION_API_KEY = os.environ.get('TRANSLATION_API_KEY', '')
    
    # Complaint classification settings for voice
    VOICE_COMPLAINT_CATEGORIES = [
        'Water',
        'Health',
        'Electricity',
        'Road',
        'Sanitation',
        'Education',
        'Agriculture',
        'Law & Order',
        'Other'
    ]
    
    # Multi-language urgency keywords
    URGENCY_KEYWORDS_MULTILANG = {
        'en': ['urgent', 'emergency', 'immediate', 'critical', 'help', 'asap', 'danger'],
        'hi': ['तुरंत', 'आपातकाल', 'जरूरी', 'मदद', 'खतरा', 'जल्दी', 'तत्काल'],
        'ta': ['அவசரம்', 'உடனடி', 'உதவி', 'ஆபத்து'],
        'gu': ['તાત્કાલિક', 'તાકીદે', 'મદદ', 'સંકટ'],
        'bn': ['জরুরি', 'সাহায্য', 'তাড়াতাড়ি', 'বিপদ'],
        'te': ['తక్షణం', 'అత్యవసరం', 'సహాయం'],
        'mr': ['तातडीचे', 'मदत', 'धोका'],
        'kn': ['ತುರ್ತು', 'ಸಹಾಯ', 'ಅಪಾಯ'],
        'ml': ['അത്യാവശ്യം', 'സഹായം', 'അപകടം'],
        'pa': ['ਤੁਰੰਤ', 'ਮਦਦ', 'ਖਤਰਾ'],
        'or': ['ତୁରନ୍ତ', 'ସାହାଯ୍ୟ', 'ବିପଦ']
    }
    
    # Temp file cleanup settings
    TEMP_FILE_MAX_AGE_HOURS = 24
    CLEANUP_ENABLED = True
    
    # Performance settings
    LAZY_LOAD_MODELS = True  # Load Whisper model on first use
    MODEL_CACHE_DIR = os.environ.get('MODEL_CACHE_DIR', '~/.cache/whisper')
    
    # Logging settings for voice module
    VOICE_LOG_LEVEL = os.environ.get('VOICE_LOG_LEVEL', 'INFO')
    LOG_TRANSCRIPTIONS = True  # Log all transcriptions for debugging
    
    # Rate limiting (future enhancement)
    RATE_LIMIT_ENABLED = False
    RATE_LIMIT_PER_CITIZEN = 10  # Max 10 voice complaints per hour per citizen
    
    # Quality settings
    TRANSCRIPTION_CONFIDENCE_THRESHOLD = 0.5  # Minimum confidence score
    AUTO_LANGUAGE_DETECTION = True  # Automatically detect language


class DevelopmentVoiceConfig(VoiceConfig):
    """Development configuration for voice module"""
    WHISPER_MODEL_SIZE = 'base'  # Faster for development
    LAZY_LOAD_MODELS = True
    LOG_TRANSCRIPTIONS = True
    ASR_VERBOSE = True


class ProductionVoiceConfig(VoiceConfig):
    """Production configuration for voice module"""
    WHISPER_MODEL_SIZE = 'medium'  # Better accuracy
    LAZY_LOAD_MODELS = True
    LOG_TRANSCRIPTIONS = False
    ASR_VERBOSE = False
    CLEANUP_ENABLED = True
    RATE_LIMIT_ENABLED = True


class TestingVoiceConfig(VoiceConfig):
    """Testing configuration for voice module"""
    WHISPER_MODEL_SIZE = 'tiny'  # Fastest for testing
    UPLOAD_FOLDER = 'test_uploads/audio'
    MAX_AUDIO_SIZE = 5 * 1024 * 1024  # 5 MB for testing


# Configuration mapping
voice_config = {
    'development': DevelopmentVoiceConfig,
    'production': ProductionVoiceConfig,
    'testing': TestingVoiceConfig,
    'default': DevelopmentVoiceConfig
}
