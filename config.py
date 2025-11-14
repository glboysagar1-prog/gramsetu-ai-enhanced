"""
GramSetu AI - Configuration Settings
Centralized configuration for the backend API
"""

import os

class Config:
    """Base configuration class"""
    
    # Flask settings
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'gramsetu-ai-secret-key-2024'
    DEBUG = os.environ.get('FLASK_DEBUG', 'True').lower() == 'true'
    
    # Database settings
    DATABASE_PATH = os.environ.get('DATABASE_PATH', 'gramsetu_ai.db')
    
    # AI Model settings
    ZERO_SHOT_MODEL = 'facebook/bart-large-mnli'
    SENTENCE_MODEL = 'all-MiniLM-L6-v2'
    
    # Complaint categories for classification
    COMPLAINT_CATEGORIES = [
        "Water supply issues",
        "Health and medical services", 
        "Electricity and power problems",
        "Road and infrastructure",
        "Other government services"
    ]
    
    # Invalid context patterns (spam detection)
    INVALID_PATTERNS = [
        "rain not coming", "weather", "cricket", "movie", "food delivery",
        "shopping", "entertainment", "personal relationship", "love",
        "sports", "gaming", "social media", "dating"
    ]
    
    # Urgency detection keywords
    URGENT_KEYWORDS = [
        'urgent', 'emergency', 'critical', 'immediate', 'asap',
        'help', 'emergency', 'crisis', 'disaster', 'accident'
    ]
    
    # CRS (Citizen Rating System) settings
    CRS_DEFAULT_SCORE = 100
    CRS_MAX_SCORE = 100
    CRS_MIN_SCORE = 0
    CRS_PENALTY_INVALID = 10
    CRS_PENALTY_DUPLICATE = 5
    CRS_REWARD_VALID = 2
    
    # Duplicate detection settings
    DUPLICATE_SIMILARITY_THRESHOLD = 0.9
    DUPLICATE_CHECK_DAYS = 30
    
    # API settings
    API_HOST = os.environ.get('API_HOST', '0.0.0.0')
    API_PORT = int(os.environ.get('API_PORT', 5000))
    
    # Pagination settings
    DEFAULT_PAGE_SIZE = 20
    MAX_PAGE_SIZE = 100
    
    # Validation settings
    MIN_COMPLAINT_LENGTH = 10
    MAX_COMPLAINT_LENGTH = 1000
    
    # Status options
    VALID_STATUSES = ['Pending', 'In Progress', 'Resolved', 'Rejected']
    
    # Logging settings
    LOG_LEVEL = os.environ.get('LOG_LEVEL', 'INFO')
    LOG_FORMAT = '%(asctime)s - %(name)s - %(levelname)s - %(message)s'

class DevelopmentConfig(Config):
    """Development configuration"""
    DEBUG = True
    LOG_LEVEL = 'DEBUG'

class ProductionConfig(Config):
    """Production configuration"""
    DEBUG = False
    LOG_LEVEL = 'WARNING'

class TestingConfig(Config):
    """Testing configuration"""
    TESTING = True
    DATABASE_PATH = 'test_gramsetu_ai.db'

# Configuration mapping
config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'testing': TestingConfig,
    'default': DevelopmentConfig
}


