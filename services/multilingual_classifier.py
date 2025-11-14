"""
GramSetu AI - Multilingual Complaint Classifier
NLP classifier supporting Indian languages

Features:
- Multi-language support (Hindi, Tamil, Gujarati, English, etc.)
- Category classification for governance issues
- Urgency detection
- Translation to English for unified processing
"""

import logging
from typing import Dict, List, Optional
from transformers import pipeline, MarianMTModel, MarianTokenizer
import re

logger = logging.getLogger(__name__)


class MultilingualComplaintClassifier:
    """
    Classifier for complaints in multiple Indian languages
    """
    
    # Complaint categories
    CATEGORIES = {
        'Water': [
            'water', 'pani', 'jal', 'neeru', 'thanni', 'paani',
            'supply', 'tank', 'tap', 'well', 'bore', 'pipeline'
        ],
        'Health': [
            'health', 'hospital', 'doctor', 'medicine', 'swasth',
            'dawakhana', 'aushadhi', 'vaccination', 'clinic', 'medical'
        ],
        'Electricity': [
            'electricity', 'power', 'light', 'bijli', 'vidyut',
            'transformer', 'wire', 'pole', 'outage', 'current'
        ],
        'Road': [
            'road', 'sadak', 'rasta', 'marg', 'street',
            'pothole', 'bridge', 'traffic', 'repair', 'construction'
        ],
        'Sanitation': [
            'sanitation', 'garbage', 'kachra', 'safai', 'drainage',
            'toilet', 'sewer', 'waste', 'cleanliness', 'dump'
        ],
        'Education': [
            'school', 'education', 'shiksha', 'vidyalaya', 'teacher',
            'student', 'class', 'books', 'uniform', 'scholarship'
        ],
        'Agriculture': [
            'agriculture', 'farming', 'krishi', 'crop', 'kisan',
            'fertilizer', 'seed', 'irrigation', 'subsidy', 'loan'
        ],
        'Law & Order': [
            'police', 'crime', 'theft', 'safety', 'kanoon',
            'security', 'violence', 'harassment', 'dispute'
        ],
        'Other': []
    }
    
    # Urgency keywords (multilingual)
    URGENT_KEYWORDS = {
        'en': ['urgent', 'emergency', 'immediate', 'critical', 'help', 'asap'],
        'hi': ['तुरंत', 'आपातकाल', 'जरूरी', 'मदद', 'खतरा'],
        'ta': ['அவசரம்', 'உடனடி', 'உதவி'],
        'gu': ['તાત્કાલિક', 'તાકીદે', 'મદદ'],
        'bn': ['জরুরি', 'সাহায্য', 'তাড়াতাড়ি']
    }
    
    def __init__(self, use_translation: bool = True):
        """
        Initialize the multilingual classifier
        
        Args:
            use_translation: Whether to use translation for better classification
        """
        self.use_translation = use_translation
        self.zero_shot_classifier = None
        self.translator_models = {}
        
        logger.info("Initializing MultilingualComplaintClassifier")
        self._load_models()
    
    def _load_models(self):
        """Load NLP models"""
        try:
            # Load zero-shot classifier
            logger.info("Loading zero-shot classification model")
            self.zero_shot_classifier = pipeline(
                "zero-shot-classification",
                model="facebook/bart-large-mnli"
            )
            
            logger.info("Multilingual classifier loaded successfully!")
            
        except Exception as e:
            logger.error(f"Failed to load classifier models: {str(e)}")
            raise
    
    def _translate_to_english(self, text: str, source_lang: str) -> str:
        """
        Translate text to English for better classification
        
        Args:
            text: Input text
            source_lang: Source language code
        
        Returns:
            Translated English text
        """
        try:
            # If already English, return as is
            if source_lang == 'en':
                return text
            
            # For demonstration, return original text
            # In production, integrate with Google Translate API or similar
            logger.warning(f"Translation not implemented for {source_lang}, using original text")
            return text
            
        except Exception as e:
            logger.error(f"Translation error: {str(e)}")
            return text
    
    def classify_category(self, text: str, language: str = 'en') -> str:
        """
        Classify complaint into category
        
        Args:
            text: Complaint text
            language: Language of the text
        
        Returns:
            Category name
        """
        try:
            # Translate to English if needed
            if self.use_translation and language != 'en':
                english_text = self._translate_to_english(text, language)
            else:
                english_text = text
            
            # Keyword-based classification (fast and effective for multilingual)
            text_lower = text.lower()
            category_scores = {}
            
            for category, keywords in self.CATEGORIES.items():
                score = sum(1 for keyword in keywords if keyword in text_lower)
                category_scores[category] = score
            
            # Get category with highest score
            max_category = max(category_scores, key=category_scores.get)
            
            # If no keywords match, use zero-shot classification on English text
            if category_scores[max_category] == 0:
                result = self.zero_shot_classifier(
                    english_text,
                    list(self.CATEGORIES.keys())
                )
                max_category = result['labels'][0]
            
            logger.info(f"Classified complaint as: {max_category}")
            return max_category
            
        except Exception as e:
            logger.error(f"Classification error: {str(e)}")
            return "Other"
    
    def detect_urgency(self, text: str, language: str = 'en') -> str:
        """
        Detect urgency level from complaint text
        
        Args:
            text: Complaint text
            language: Language of the text
        
        Returns:
            Urgency level ('Low', 'Medium', 'High')
        """
        try:
            text_lower = text.lower()
            
            # Check for urgent keywords in all languages
            urgent_found = False
            for lang_keywords in self.URGENT_KEYWORDS.values():
                if any(keyword in text_lower for keyword in lang_keywords):
                    urgent_found = True
                    break
            
            if urgent_found:
                return "High"
            
            # Check for time-sensitive phrases
            time_patterns = [
                r'\d+\s*(day|days|din|दिन)',
                r'not working',
                r'nahi\s+aa\s+raha',
                r'बंद है'
            ]
            
            for pattern in time_patterns:
                if re.search(pattern, text_lower):
                    return "Medium"
            
            return "Medium"  # Default to medium
            
        except Exception as e:
            logger.error(f"Urgency detection error: {str(e)}")
            return "Medium"
    
    def extract_keywords(self, text: str, top_k: int = 5) -> List[str]:
        """
        Extract key phrases from complaint text
        
        Args:
            text: Complaint text
            top_k: Number of keywords to extract
        
        Returns:
            List of keywords
        """
        try:
            # Simple keyword extraction (can be enhanced with NER)
            words = re.findall(r'\b\w+\b', text.lower())
            
            # Filter stop words (basic list)
            stop_words = {'the', 'is', 'are', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for'}
            keywords = [w for w in words if w not in stop_words and len(w) > 3]
            
            # Get unique keywords
            unique_keywords = list(set(keywords))
            
            return unique_keywords[:top_k]
            
        except Exception as e:
            logger.error(f"Keyword extraction error: {str(e)}")
            return []
    
    def analyze_complaint(self, text: str, language: str = 'en') -> Dict:
        """
        Complete complaint analysis
        
        Args:
            text: Complaint text
            language: Language of the text
        
        Returns:
            Analysis results dictionary
        """
        try:
            logger.info("Analyzing complaint")
            
            # Classify category
            category = self.classify_category(text, language)
            
            # Detect urgency
            urgency = self.detect_urgency(text, language)
            
            # Extract keywords
            keywords = self.extract_keywords(text)
            
            return {
                'category': category,
                'urgency': urgency,
                'keywords': keywords,
                'language': language
            }
            
        except Exception as e:
            logger.error(f"Complaint analysis error: {str(e)}")
            return {
                'category': 'Other',
                'urgency': 'Medium',
                'keywords': [],
                'language': language
            }


# Singleton instance
_classifier_instance = None

def get_classifier() -> MultilingualComplaintClassifier:
    """
    Get singleton instance of MultilingualComplaintClassifier
    
    Returns:
        MultilingualComplaintClassifier instance
    """
    global _classifier_instance
    
    if _classifier_instance is None:
        _classifier_instance = MultilingualComplaintClassifier()
    
    return _classifier_instance
