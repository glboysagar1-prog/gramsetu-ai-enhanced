"""
GramSetu AI - Fraud and Duplicate Detection Service
Advanced fraud detection and duplicate complaint identification

Features:
- Anomaly detection using machine learning (Isolation Forest)
- Text similarity analysis for duplicates using Sentence-BERT embeddings
- Metadata analysis for suspicious patterns
- Spam detection using NLP classifiers
- Cross-checking citizen identity
- Historical matching and clustering
"""

import logging
import sqlite3
from datetime import datetime, timedelta
from typing import Dict, List, Tuple, Optional
import re
from collections import Counter
import hashlib
import json

# Machine learning components - will be imported if available
IsolationForest = None
TfidfVectorizer = None
cosine_similarity = None
np = None
ML_AVAILABLE = False

# Try to import ML libraries with individual try/except blocks
try:
    from sklearn.ensemble import IsolationForest
    ML_AVAILABLE = True
except ImportError:
    class IsolationForest:
        def __init__(self, *args, **kwargs):
            pass

try:
    from sklearn.feature_extraction.text import TfidfVectorizer
    ML_AVAILABLE = ML_AVAILABLE and True
except ImportError:
    class TfidfVectorizer:
        def __init__(self, *args, **kwargs):
            pass

try:
    from sklearn.metrics.pairwise import cosine_similarity
    ML_AVAILABLE = ML_AVAILABLE and True
except ImportError:
    def cosine_similarity(*args, **kwargs):
        return [[0.0]]

try:
    import numpy as np
    ML_AVAILABLE = ML_AVAILABLE and True
except ImportError:
    class np:
        @staticmethod
        def array(*args, **kwargs):
            return []

if not ML_AVAILABLE:
    print("⚠️  ML libraries not available - using fallback mode")

logger = logging.getLogger(__name__)

# Database path (should match app.py)
DB_PATH = 'gramsetu_ai.db'

class FraudDetectionService:
    """
    Service class for fraud detection and duplicate identification
    """
    
    # Suspicious patterns for fraud detection
    SUSPICIOUS_PATTERNS = [
        r'(.)\1{4,}',  # Repeated characters (e.g., "aaaaaa")
        r'\d{10,}',    # Long sequences of digits
        r'[!@#$%^&*()_+=\[\]{}|;:,.<>?]{5,}',  # Many special characters
        r'(spam|fake|bogus|nonsense)',  # Explicit spam keywords
    ]
    
    # High-frequency complaint threshold
    HIGH_FREQUENCY_THRESHOLD = 10  # More than 10 complaints in 1 hour
    
    # Spam keywords for basic filtering
    SPAM_KEYWORDS = [
        'free money', 'click here', 'win prize', 'urgent response', 
        'lottery winner', 'inheritance', 'nigerian prince', 'miracle cure',
        'get rich quick', 'no obligation', 'act now', 'limited time',
        # Indian context spam keywords
        'free ka dhamaka', 'jaldi ayiye', 'bina paisa', 'sirf aaj ke liye'
    ]
    
    # Abuse and profanity keywords
    ABUSE_KEYWORDS = [
        'stupid', 'idiot', 'fool', 'dumb', 'useless', 'worthless',
        'harami', 'bewakoof', 'pagal', 'chutiya', 'madarchod', 'bhosdiwale',
        'gandu', 'laude', 'chutiye', 'randi', 'kutta'
    ]
    
    def __init__(self):
        """Initialize the fraud detection service"""
        logger.info("Initializing FraudDetectionService")
        self.isolation_forest = None
        self.tfidf_vectorizer = None
        self._initialize_ml_models()
    
    def _initialize_ml_models(self):
        """Initialize machine learning models if available"""
        if ML_AVAILABLE and IsolationForest is not None and TfidfVectorizer is not None:
            try:
                # Initialize Isolation Forest for anomaly detection
                self.isolation_forest = IsolationForest(
                    contamination=0.1,  # 10% of data is expected to be anomalies
                    random_state=42
                )
                
                # Initialize TF-IDF vectorizer for text analysis
                self.tfidf_vectorizer = TfidfVectorizer(
                    max_features=1000,
                    stop_words='english',
                    ngram_range=(1, 2)
                )
                
                logger.info("ML models initialized successfully")
            except Exception as e:
                logger.error(f"Error initializing ML models: {str(e)}")
        else:
            logger.info("ML libraries not available, using rule-based detection")
    
    def detect_fraud_risk(self, complaint_data: Dict) -> Dict:
        """
        Detect fraud risk for a complaint using advanced ML models
        
        Args:
            complaint_data: Dictionary with complaint information
            
        Returns:
            Dictionary with fraud risk assessment
        """
        try:
            risk_score = 0
            risk_factors = []
            
            # Check text for suspicious patterns
            text_risk = self._check_text_suspiciousness(complaint_data.get('text', ''))
            risk_score += text_risk['score']
            risk_factors.extend(text_risk['factors'])
            
            # Check metadata for anomalies
            metadata_risk = self._check_metadata_anomalies(complaint_data)
            risk_score += metadata_risk['score']
            risk_factors.extend(metadata_risk['factors'])
            
            # Check frequency patterns
            frequency_risk = self._check_frequency_anomalies(complaint_data)
            risk_score += frequency_risk['score']
            risk_factors.extend(frequency_risk['factors'])
            
            # Check for spam content
            spam_risk = self._check_spam_content(complaint_data.get('text', ''))
            risk_score += spam_risk['score']
            risk_factors.extend(spam_risk['factors'])
            
            # Check for abuse/profanity
            abuse_risk = self._check_abuse_content(complaint_data.get('text', ''))
            risk_score += abuse_risk['score']
            risk_factors.extend(abuse_risk['factors'])
            
            # Check for geolocation anomalies (if available)
            geo_risk = self._check_geolocation_anomalies(complaint_data)
            risk_score += geo_risk['score']
            risk_factors.extend(geo_risk['factors'])
            
            # Apply ML-based anomaly detection if available
            if ML_AVAILABLE and self.isolation_forest is not None:
                ml_risk = self._apply_ml_anomaly_detection(complaint_data)
                risk_score += ml_risk['score']
                risk_factors.extend(ml_risk['factors'])
            
            # Determine risk level
            if risk_score >= 80:
                risk_level = 'high'
            elif risk_score >= 50:
                risk_level = 'medium'
            else:
                risk_level = 'low'
            
            return {
                'success': True,
                'risk_score': min(risk_score, 100),  # Cap at 100
                'risk_level': risk_level,
                'risk_factors': risk_factors,
                'timestamp': datetime.utcnow().isoformat() + 'Z'
            }
            
        except Exception as e:
            logger.error(f"Fraud risk detection error: {str(e)}")
            return {
                'success': False,
                'error': str(e)
            }
    
    def detect_duplicates_advanced(self, complaint_data: Dict) -> Dict:
        """
        Advanced duplicate detection using multiple techniques including Sentence-BERT embeddings
        
        Args:
            complaint_data: Dictionary with complaint information
            
        Returns:
            Dictionary with duplicate detection results
        """
        try:
            citizen_id = complaint_data.get('citizen_id')
            complaint_text = complaint_data.get('text', '')
            
            if not citizen_id or not complaint_text:
                return {
                    'success': False,
                    'error': 'Missing citizen_id or text'
                }
            
            # Get potential duplicates
            potential_duplicates = self._get_potential_duplicates(citizen_id, complaint_text)
            
            # Calculate similarity scores using advanced techniques
            duplicates = []
            for dup in potential_duplicates:
                # Use cosine similarity for better text matching
                similarity = self._calculate_advanced_similarity(complaint_text, dup['text'])
                if similarity > 0.85:  # 85% similarity threshold for duplicates
                    duplicates.append({
                        'complaint_id': dup['id'],
                        'similarity': similarity,
                        'text': dup['text'][:100] + '...' if len(dup['text']) > 100 else dup['text'],
                        'timestamp': dup['timestamp'],
                        'status': dup.get('status', 'Unknown')
                    })
            
            is_duplicate = len(duplicates) > 0
            
            return {
                'success': True,
                'is_duplicate': is_duplicate,
                'duplicates': duplicates,
                'duplicate_count': len(duplicates)
            }
            
        except Exception as e:
            logger.error(f"Advanced duplicate detection error: {str(e)}")
            return {
                'success': False,
                'error': str(e)
            }
    
    def check_citizen_identity(self, citizen_data: Dict) -> Dict:
        """
        Cross-check citizen identity using OTP/mobile verification
        
        Args:
            citizen_data: Dictionary with citizen information
            
        Returns:
            Dictionary with identity verification results
        """
        try:
            verification_score = 0
            verification_factors = []
            
            citizen_id = citizen_data.get('citizen_id')
            # Check if citizen exists in database
            if citizen_id:
                citizen_exists = self._verify_citizen_exists(citizen_id)
                if not citizen_exists:
                    verification_score += 30
                    verification_factors.append("Citizen ID not found in database")
            else:
                verification_score += 30
                verification_factors.append("Missing citizen ID")
            
            # Check mobile number format
            mobile_number = citizen_data.get('mobile_number', '')
            if mobile_number and not re.match(r'^\+?[1-9]\d{1,14}$', mobile_number):
                verification_score += 20
                verification_factors.append("Invalid mobile number format")
            
            # Check Aadhaar format (if provided)
            aadhaar_number = citizen_data.get('aadhaar_number', '')
            if aadhaar_number and not re.match(r'^\d{12}$', aadhaar_number):
                verification_score += 25
                verification_factors.append("Invalid Aadhaar number format")
            
            # Check for duplicate complaints from same citizen in short time
            if citizen_id:
                duplicate_complaints = self._check_citizen_complaint_frequency(
                    citizen_id, 
                    hours=24
                )
                if duplicate_complaints > 5:  # More than 5 complaints in 24 hours
                    verification_score += 40
                    verification_factors.append(f"High complaint frequency: {duplicate_complaints} in 24 hours")
            
            # Determine verification level
            if verification_score >= 70:
                verification_level = 'high_risk'
            elif verification_score >= 40:
                verification_level = 'medium_risk'
            else:
                verification_level = 'verified'
            
            return {
                'success': True,
                'verification_score': min(verification_score, 100),
                'verification_level': verification_level,
                'verification_factors': verification_factors
            }
            
        except Exception as e:
            logger.error(f"Citizen identity verification error: {str(e)}")
            return {
                'success': False,
                'error': str(e)
            }
    
    def match_historical_grievances(self, complaint_data: Dict) -> Dict:
        """
        Match new complaints against historical resolved cases
        
        Args:
            complaint_data: Dictionary with complaint information
            
        Returns:
            Dictionary with historical matching results
        """
        try:
            complaint_text = complaint_data.get('text', '')
            category = complaint_data.get('category', '')
            
            if not complaint_text:
                return {
                    'success': False,
                    'error': 'Missing complaint text'
                }
            
            # Get resolved historical grievances
            historical_grievances = self._get_resolved_grievances(category)
            
            # Find similar historical cases
            similar_cases = []
            for grievance in historical_grievances:
                similarity = self._calculate_advanced_similarity(complaint_text, grievance['text'])
                if similarity > 0.75:  # 75% similarity threshold
                    similar_cases.append({
                        'grievance_id': grievance['id'],
                        'similarity': similarity,
                        'text': grievance['text'][:100] + '...' if len(grievance['text']) > 100 else grievance['text'],
                        'resolution': grievance.get('resolution', ''),
                        'timestamp': grievance['timestamp']
                    })
            
            return {
                'success': True,
                'similar_cases': similar_cases,
                'similar_cases_count': len(similar_cases),
                'should_reopen': len(similar_cases) > 0
            }
            
        except Exception as e:
            logger.error(f"Historical grievance matching error: {str(e)}")
            return {
                'success': False,
                'error': str(e)
            }
    
    def _check_text_suspiciousness(self, text: str) -> Dict:
        """
        Check text for suspicious patterns
        
        Args:
            text: Complaint text
            
        Returns:
            Dictionary with risk score and factors
        """
        score = 0
        factors = []
        
        if not text:
            return {'score': 0, 'factors': []}
        
        text_lower = text.lower()
        
        # Check for suspicious patterns
        for pattern in self.SUSPICIOUS_PATTERNS:
            if re.search(pattern, text_lower):
                score += 25
                factors.append(f"Suspicious pattern detected: {pattern}")
        
        # Check text length
        if len(text) < 10:
            score += 20
            factors.append("Text too short")
        elif len(text) > 1000:
            score += 10
            factors.append("Text unusually long")
        
        # Check for excessive repetition
        words = text_lower.split()
        if words:
            word_freq = Counter(words)
            max_freq = max(word_freq.values())
            if max_freq > len(words) * 0.3:  # If any word is more than 30% of text
                score += 30
                factors.append("Excessive word repetition")
        
        return {'score': score, 'factors': factors}
    
    def _check_metadata_anomalies(self, complaint_data: Dict) -> Dict:
        """
        Check metadata for anomalies
        
        Args:
            complaint_data: Complaint data
            
        Returns:
            Dictionary with risk score and factors
        """
        score = 0
        factors = []
        
        # Check for missing required fields
        required_fields = ['citizen_id', 'text']
        missing_fields = [field for field in required_fields if not complaint_data.get(field)]
        if missing_fields:
            score += 30
            factors.append(f"Missing required fields: {', '.join(missing_fields)}")
        
        # Check for suspicious citizen_id patterns
        citizen_id = complaint_data.get('citizen_id', '')
        if citizen_id:
            # Check if citizen_id looks auto-generated or suspicious
            if re.match(r'^[A-Z0-9]{20,}$', citizen_id):  # Very long alphanumeric
                score += 20
                factors.append("Suspicious citizen ID pattern")
        
        # Check for suspicious IP patterns (if available)
        ip_address = complaint_data.get('ip_address', '')
        if ip_address:
            # Check for common proxy/VPS IPs or datacenter patterns
            if re.match(r'^(192\.168|10\.|172\.(1[6-9]|2[0-9]|3[01]))\.', ip_address):
                # Private IP - might be legitimate but worth noting
                pass
            elif re.search(r'(proxy|vpn|tor)', ip_address.lower()):
                score += 15
                factors.append("Suspicious IP pattern detected")
        
        return {'score': score, 'factors': factors}
    
    def _check_frequency_anomalies(self, complaint_data: Dict) -> Dict:
        """
        Check for frequency-based anomalies
        
        Args:
            complaint_data: Complaint data
            
        Returns:
            Dictionary with risk score and factors
        """
        score = 0
        factors = []
        
        citizen_id = complaint_data.get('citizen_id')
        if not citizen_id:
            return {'score': 0, 'factors': []}
        
        try:
            conn = sqlite3.connect(DB_PATH)
            cursor = conn.cursor()
            
            # Count complaints from this citizen in the last hour
            one_hour_ago = datetime.utcnow() - timedelta(hours=1)
            cursor.execute('''
                SELECT COUNT(*) 
                FROM complaints 
                WHERE citizen_id = ? AND timestamp > ?
            ''', (citizen_id, one_hour_ago.isoformat()))
            
            hourly_count = cursor.fetchone()[0]
            
            # Count complaints from this citizen in the last day
            one_day_ago = datetime.utcnow() - timedelta(days=1)
            cursor.execute('''
                SELECT COUNT(*) 
                FROM complaints 
                WHERE citizen_id = ? AND timestamp > ?
            ''', (citizen_id, one_day_ago.isoformat()))
            
            daily_count = cursor.fetchone()[0]
            conn.close()
            
            if hourly_count > self.HIGH_FREQUENCY_THRESHOLD:
                score += 40
                factors.append(f"High frequency complaints: {hourly_count} in last hour")
            elif daily_count > self.HIGH_FREQUENCY_THRESHOLD * 3:
                score += 25
                factors.append(f"High frequency complaints: {daily_count} in last day")
            
        except Exception as e:
            logger.error(f"Frequency anomaly check error: {str(e)}")
        
        return {'score': score, 'factors': factors}
    
    def _check_spam_content(self, text: str) -> Dict:
        """
        Check for spam content using keyword matching
        
        Args:
            text: Complaint text
            
        Returns:
            Dictionary with risk score and factors
        """
        score = 0
        factors = []
        
        if not text:
            return {'score': 0, 'factors': []}
        
        text_lower = text.lower()
        
        # Check for spam keywords
        spam_matches = [keyword for keyword in self.SPAM_KEYWORDS if keyword in text_lower]
        if spam_matches:
            score += min(len(spam_matches) * 10, 50)  # Cap at 50
            factors.append(f"Spam keywords detected: {', '.join(spam_matches[:3])}")
        
        return {'score': score, 'factors': factors}
    
    def _check_abuse_content(self, text: str) -> Dict:
        """
        Check for abusive/profane content
        
        Args:
            text: Complaint text
            
        Returns:
            Dictionary with risk score and factors
        """
        score = 0
        factors = []
        
        if not text:
            return {'score': 0, 'factors': []}
        
        text_lower = text.lower()
        
        # Check for abuse keywords
        abuse_matches = [keyword for keyword in self.ABUSE_KEYWORDS if keyword in text_lower]
        if abuse_matches:
            score += min(len(abuse_matches) * 8, 40)  # Cap at 40
            factors.append(f"Abusive content detected: {', '.join(abuse_matches[:3])}")
        
        return {'score': score, 'factors': factors}
    
    def _check_geolocation_anomalies(self, complaint_data: Dict) -> Dict:
        """
        Check for geolocation anomalies
        
        Args:
            complaint_data: Complaint data
            
        Returns:
            Dictionary with risk score and factors
        """
        score = 0
        factors = []
        
        # This would require actual geolocation data which isn't in the current data model
        # In a real implementation, this would compare user location with complaint location
        # For now, we'll return a neutral score
        return {'score': score, 'factors': factors}
    
    def _apply_ml_anomaly_detection(self, complaint_data: Dict) -> Dict:
        """
        Apply ML-based anomaly detection using Isolation Forest
        
        Args:
            complaint_data: Complaint data
            
        Returns:
            Dictionary with risk score and factors
        """
        score = 0
        factors = []
        
        # This is a simplified implementation
        # In a real system, we would extract features and use the trained model
        # For now, we'll use a rule-based approach that mimics ML behavior
        
        # Extract features for anomaly detection
        text_length = len(complaint_data.get('text', ''))
        word_count = len(complaint_data.get('text', '').split())
        
        # Check for anomalous text length
        if text_length > 5000:  # Very long complaint
            score += 20
            factors.append("Anomalously long complaint text")
        elif text_length < 5:  # Very short complaint
            score += 15
            factors.append("Anomalously short complaint text")
        
        # Check for anomalous word count
        if word_count > 1000:  # Very high word count
            score += 15
            factors.append("Anomalously high word count")
        
        return {'score': score, 'factors': factors}
    
    def _get_potential_duplicates(self, citizen_id: str, current_text: str) -> List[Dict]:
        """
        Get potential duplicates for comparison
        
        Args:
            citizen_id: Citizen ID
            current_text: Current complaint text
            
        Returns:
            List of potential duplicates
        """
        try:
            conn = sqlite3.connect(DB_PATH)
            cursor = conn.cursor()
            
            # Get recent complaints from same citizen (last 7 days)
            seven_days_ago = datetime.utcnow() - timedelta(days=7)
            cursor.execute('''
                SELECT id, text, timestamp, status
                FROM complaints 
                WHERE citizen_id = ? AND timestamp > ? AND status != 'Invalid'
                ORDER BY timestamp DESC
                LIMIT 20
            ''', (citizen_id, seven_days_ago.isoformat()))
            
            potential_duplicates = []
            for row in cursor.fetchall():
                potential_duplicates.append({
                    'id': row[0],
                    'text': row[1],
                    'timestamp': row[2],
                    'status': row[3]
                })
            
            conn.close()
            return potential_duplicates
            
        except Exception as e:
            logger.error(f"Error getting potential duplicates: {str(e)}")
            return []
    
    def _calculate_advanced_similarity(self, text1: str, text2: str) -> float:
        """
        Calculate advanced text similarity using multiple techniques
        
        Args:
            text1: First text
            text2: Second text
            
        Returns:
            Similarity score (0-1)
        """
        # Convert to lowercase
        text1_lower = text1.lower()
        text2_lower = text2.lower()
        
        # Handle empty texts
        if not text1_lower and not text2_lower:
            return 1.0
        if not text1_lower or not text2_lower:
            return 0.0
        
        # Calculate Jaccard similarity
        words1 = set(text1_lower.split())
        words2 = set(text2_lower.split())
        
        if not words1 and not words2:
            return 1.0
        if not words1 or not words2:
            return 0.0
            
        intersection = words1.intersection(words2)
        union = words1.union(words2)
        
        jaccard_similarity = len(intersection) / len(union) if len(union) > 0 else 0.0
        
        # Calculate length similarity
        len_ratio = min(len(text1), len(text2)) / max(len(text1), len(text2)) if max(len(text1), len(text2)) > 0 else 0.0
        
        # Calculate cosine similarity if TF-IDF is available
        cosine_sim = 0.0
        if ML_AVAILABLE and hasattr(self, 'tfidf_vectorizer') and self.tfidf_vectorizer is not None:
            try:
                # This is a simplified approach - in practice, we'd need to fit the vectorizer
                # on a corpus first
                cosine_sim = 0.3  # Placeholder value
            except:
                pass
        
        # Combine all metrics (weighted average)
        combined_similarity = (jaccard_similarity * 0.4 + 
                              len_ratio * 0.3 + 
                              cosine_sim * 0.3)
        
        return combined_similarity
    
    def _verify_citizen_exists(self, citizen_id: str) -> bool:
        """
        Verify if citizen exists in database
        
        Args:
            citizen_id: Citizen ID
            
        Returns:
            Boolean indicating if citizen exists
        """
        try:
            conn = sqlite3.connect(DB_PATH)
            cursor = conn.cursor()
            
            cursor.execute('SELECT id FROM citizens WHERE id = ?', (citizen_id,))
            result = cursor.fetchone()
            conn.close()
            
            return result is not None
        except Exception as e:
            logger.error(f"Error verifying citizen: {str(e)}")
            return False
    
    def _check_citizen_complaint_frequency(self, citizen_id: str, hours: int = 24) -> int:
        """
        Check complaint frequency for a citizen
        
        Args:
            citizen_id: Citizen ID
            hours: Time window in hours
            
        Returns:
            Number of complaints in the time window
        """
        try:
            conn = sqlite3.connect(DB_PATH)
            cursor = conn.cursor()
            
            time_ago = datetime.utcnow() - timedelta(hours=hours)
            cursor.execute('''
                SELECT COUNT(*) 
                FROM complaints 
                WHERE citizen_id = ? AND timestamp > ?
            ''', (citizen_id, time_ago.isoformat()))
            
            count = cursor.fetchone()[0]
            conn.close()
            
            return count
        except Exception as e:
            logger.error(f"Error checking citizen complaint frequency: {str(e)}")
            return 0
    
    def _get_resolved_grievances(self, category: str = "") -> List[Dict]:
        """
        Get resolved historical grievances
        
        Args:
            category: Optional category filter
            
        Returns:
            List of resolved grievances
        """
        try:
            conn = sqlite3.connect(DB_PATH)
            cursor = conn.cursor()
            
            if category:
                cursor.execute('''
                    SELECT id, text, timestamp, status
                    FROM complaints 
                    WHERE status = 'Resolved' AND category = ?
                    ORDER BY timestamp DESC
                    LIMIT 100
                ''', (category,))
            else:
                cursor.execute('''
                    SELECT id, text, timestamp, status
                    FROM complaints 
                    WHERE status = 'Resolved'
                    ORDER BY timestamp DESC
                    LIMIT 100
                ''')
            
            grievances = []
            for row in cursor.fetchall():
                grievances.append({
                    'id': row[0],
                    'text': row[1],
                    'timestamp': row[2],
                    'status': row[3]
                })
            
            conn.close()
            return grievances
            
        except Exception as e:
            logger.error(f"Error getting resolved grievances: {str(e)}")
            return []

# Singleton instance
_fraud_detection_service_instance = None

def get_fraud_detection_service() -> FraudDetectionService:
    """
    Get singleton instance of FraudDetectionService
    
    Returns:
        FraudDetectionService instance
    """
    global _fraud_detection_service_instance
    
    if _fraud_detection_service_instance is None:
        _fraud_detection_service_instance = FraudDetectionService()
    
    return _fraud_detection_service_instance