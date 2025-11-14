"""
GramSetu AI - IVR/SMS Complaint Service
Service for handling complaints via IVR calls and SMS

Features:
- SMS complaint parsing and processing
- IVR integration with telephony providers
- USSD gateway support
- Structured complaint input handling
"""

import logging
import re
from datetime import datetime
from typing import Dict, Optional
import sqlite3
from services.multilingual_classifier import get_classifier

logger = logging.getLogger(__name__)

# Database path (should match app.py)
DB_PATH = 'gramsetu_ai.db'

class IVRSMSService:
    """
    Service class for processing complaints via IVR and SMS
    """
    
    def __init__(self):
        """Initialize the IVR/SMS service"""
        logger.info("Initializing IVRSMSService")
        self.classifier = get_classifier()
    
    def process_sms_complaint(self, sms_content: str, sender_number: str) -> Dict:
        """
        Process SMS complaint
        
        Expected format: "156Complaint#Water supply issue in sector 5"
        Or just free text: "Water supply issue in sector 5"
        
        Args:
            sms_content: SMS message content
            sender_number: Sender's phone number
            
        Returns:
            Dictionary with processing results
        """
        try:
            logger.info(f"Processing SMS complaint from {sender_number}")
            
            # Parse SMS content
            complaint_text = self._parse_sms_content(sms_content)
            
            if not complaint_text:
                return {
                    'success': False,
                    'error': 'Could not extract complaint text from SMS'
                }
            
            # Generate citizen ID from phone number
            citizen_id = f"SMS_{sender_number.replace('+', '').replace(' ', '')}"
            
            # Process complaint using existing logic
            return self._process_complaint_text(complaint_text, citizen_id)
            
        except Exception as e:
            logger.error(f"SMS complaint processing error: {str(e)}")
            return {
                'success': False,
                'error': str(e)
            }
    
    def _parse_sms_content(self, sms_content: str) -> Optional[str]:
        """
        Parse SMS content to extract complaint text
        
        Args:
            sms_content: Raw SMS content
            
        Returns:
            Extracted complaint text or None
        """
        # Remove extra whitespace
        content = sms_content.strip()
        
        # Check for structured format (156Complaint#...)
        if '#' in content:
            parts = content.split('#', 1)
            if len(parts) == 2 and parts[0].strip().lower() in ['156complaint', 'complaint']:
                return parts[1].strip()
        
        # Check for common prefixes
        prefixes = ['complaint:', 'issue:', 'problem:']
        for prefix in prefixes:
            if content.lower().startswith(prefix):
                return content[len(prefix):].strip()
        
        # If no structured format, return content as is (if meaningful)
        if len(content) > 5:  # Minimum length check
            return content
        
        return None
    
    def process_ussd_complaint(self, ussd_input: str, session_id: str, sender_number: str) -> Dict:
        """
        Process USSD complaint input
        
        Args:
            ussd_input: USSD input string
            session_id: USSD session ID
            sender_number: Sender's phone number
            
        Returns:
            Dictionary with processing results
        """
        try:
            logger.info(f"Processing USSD complaint from {sender_number}")
            
            # Parse USSD input (structured format expected)
            complaint_data = self._parse_ussd_input(ussd_input)
            
            if not complaint_data:
                return {
                    'success': False,
                    'error': 'Could not parse USSD input'
                }
            
            # Generate citizen ID from phone number
            citizen_id = f"USSD_{sender_number.replace('+', '').replace(' ', '')}"
            
            # Process complaint
            return self._process_complaint_data(complaint_data, citizen_id)
            
        except Exception as e:
            logger.error(f"USSD complaint processing error: {str(e)}")
            return {
                'success': False,
                'error': str(e)
            }
    
    def _parse_ussd_input(self, ussd_input: str) -> Optional[Dict]:
        """
        Parse USSD input to extract complaint data
        
        Expected format: "category#description#location"
        Example: "Water#No water supply in sector 5#Sector 5"
        
        Args:
            ussd_input: Raw USSD input
            
        Returns:
            Dictionary with complaint data or None
        """
        parts = ussd_input.split('#')
        
        if len(parts) >= 2:
            return {
                'category': parts[0].strip() if parts[0].strip() else 'Other',
                'description': parts[1].strip(),
                'location': parts[2].strip() if len(parts) > 2 and parts[2].strip() else None
            }
        
        return None
    
    def _process_complaint_text(self, complaint_text: str, citizen_id: str) -> Dict:
        """
        Process complaint text using existing complaint processing logic
        
        Args:
            complaint_text: Complaint text
            citizen_id: Citizen ID
            
        Returns:
            Dictionary with processing results
        """
        try:
            # Use classifier to analyze complaint
            analysis = self.classifier.analyze_complaint(complaint_text)
            
            # Generate timestamp and hash
            timestamp = datetime.utcnow().isoformat() + 'Z'
            hash_value = self._generate_complaint_hash(complaint_text, timestamp)
            
            # Determine urgency
            urgency = analysis['urgency']
            
            # Save to database
            complaint_id = self._save_complaint(
                complaint_text, 
                analysis['category'], 
                urgency, 
                citizen_id, 
                hash_value, 
                timestamp
            )
            
            return {
                'success': True,
                'complaint_id': complaint_id,
                'category': analysis['category'],
                'urgency': urgency,
                'timestamp': timestamp,
                'hash': hash_value
            }
            
        except Exception as e:
            logger.error(f"Complaint text processing error: {str(e)}")
            return {
                'success': False,
                'error': str(e)
            }
    
    def _process_complaint_data(self, complaint_data: Dict, citizen_id: str) -> Dict:
        """
        Process structured complaint data
        
        Args:
            complaint_data: Dictionary with complaint data
            citizen_id: Citizen ID
            
        Returns:
            Dictionary with processing results
        """
        try:
            # Combine description and location for better analysis
            full_text = complaint_data['description']
            if complaint_data.get('location'):
                full_text += f" Location: {complaint_data['location']}"
            
            # Use classifier to analyze complaint
            analysis = self.classifier.analyze_complaint(full_text)
            
            # Override category if provided in structured data
            category = complaint_data.get('category', analysis['category'])
            
            # Generate timestamp and hash
            timestamp = datetime.utcnow().isoformat() + 'Z'
            hash_value = self._generate_complaint_hash(full_text, timestamp)
            
            # Determine urgency
            urgency = analysis['urgency']
            
            # Save to database
            complaint_id = self._save_complaint(
                full_text, 
                category, 
                urgency, 
                citizen_id, 
                hash_value, 
                timestamp
            )
            
            return {
                'success': True,
                'complaint_id': complaint_id,
                'category': category,
                'urgency': urgency,
                'timestamp': timestamp,
                'hash': hash_value
            }
            
        except Exception as e:
            logger.error(f"Structured complaint processing error: {str(e)}")
            return {
                'success': False,
                'error': str(e)
            }
    
    def _generate_complaint_hash(self, text: str, timestamp: str) -> str:
        """
        Generate complaint hash (simplified version)
        
        Args:
            text: Complaint text
            timestamp: Timestamp
            
        Returns:
            Hash string
        """
        import hashlib
        data = f"{text}{timestamp}"
        return hashlib.sha256(data.encode()).hexdigest()
    
    def _save_complaint(self, text: str, category: str, urgency: str, 
                       citizen_id: str, hash_value: str, timestamp: str) -> str:
        """
        Save complaint to database
        
        Args:
            text: Complaint text
            category: Complaint category
            urgency: Urgency level
            citizen_id: Citizen ID
            hash_value: Complaint hash
            timestamp: Timestamp
            
        Returns:
            Complaint ID
        """
        try:
            conn = sqlite3.connect(DB_PATH)
            cursor = conn.cursor()
            
            # Insert complaint
            cursor.execute('''
                INSERT INTO complaints 
                (text, category, urgency, citizen_id, hash, timestamp, status)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            ''', (text, category, urgency, citizen_id, hash_value, timestamp, 'Pending'))
            
            complaint_id = cursor.lastrowid
            conn.commit()
            conn.close()
            
            logger.info(f"Complaint saved with ID: {complaint_id}")
            return f"GSAI-{datetime.now().year}-{str(complaint_id).zfill(4)}"
            
        except Exception as e:
            logger.error(f"Database error: {str(e)}")
            raise

# Singleton instance
_ivr_sms_service_instance = None

def get_ivr_sms_service() -> IVRSMSService:
    """
    Get singleton instance of IVRSMSService
    
    Returns:
        IVRSMSService instance
    """
    global _ivr_sms_service_instance
    
    if _ivr_sms_service_instance is None:
        _ivr_sms_service_instance = IVRSMSService()
    
    return _ivr_sms_service_instance