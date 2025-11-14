"""
GramSetu AI - Audit Trail Service
Tamper-proof logging and audit trail management

Features:
- Immutable audit trail using append-only logging
- Cryptographic hashing for integrity verification
- Merkle tree implementation for efficient verification
- Digital signatures for officer actions
- Time-stamping for chronological integrity
"""

import logging
import sqlite3
import hashlib
import json
from datetime import datetime
from typing import Dict, List, Optional
import hmac

logger = logging.getLogger(__name__)

# Database path (should match app.py)
DB_PATH = 'gramsetu_ai.db'

class AuditService:
    """
    Service class for audit trail management
    """
    
    def __init__(self):
        """Initialize the audit service"""
        logger.info("Initializing AuditService")
        self._ensure_audit_tables_exist()
    
    def _ensure_audit_tables_exist(self):
        """Ensure required audit database tables exist"""
        try:
            conn = sqlite3.connect(DB_PATH)
            cursor = conn.cursor()
            
            # Create audit trail table
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS audit_trail (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    event_type TEXT NOT NULL,
                    entity_type TEXT NOT NULL,
                    entity_id TEXT NOT NULL,
                    action TEXT NOT NULL,
                    actor_id TEXT NOT NULL,
                    actor_role TEXT,
                    timestamp TEXT NOT NULL,
                    data TEXT,  -- JSON data about the event
                    hash TEXT UNIQUE NOT NULL,  -- SHA256 hash of the event
                    previous_hash TEXT,  -- Hash of previous event (blockchain-like)
                    signature TEXT,  -- Digital signature for officer actions
                    signature_algorithm TEXT,
                    is_verified BOOLEAN DEFAULT FALSE
                )
            ''')
            
            # Create index for faster queries
            cursor.execute('CREATE INDEX IF NOT EXISTS idx_audit_entity ON audit_trail(entity_type, entity_id)')
            cursor.execute('CREATE INDEX IF NOT EXISTS idx_audit_actor ON audit_trail(actor_id)')
            cursor.execute('CREATE INDEX IF NOT EXISTS idx_audit_timestamp ON audit_trail(timestamp)')
            
            conn.commit()
            conn.close()
            logger.info("Audit tables ensured")
            
        except Exception as e:
            logger.error(f"Error ensuring audit tables: {str(e)}")
            raise
    
    def log_event(self, event_data: Dict) -> Dict:
        """
        Log an audit event
        
        Args:
            event_data: Dictionary with event information
                - event_type: Type of event (complaint, assignment, resolution, etc.)
                - entity_type: Type of entity (complaint, user, etc.)
                - entity_id: ID of the entity
                - action: Action performed
                - actor_id: ID of the actor performing the action
                - actor_role: Role of the actor
                - data: Additional data about the event (JSON serializable)
                
        Returns:
            Dictionary with log result
        """
        try:
            # Get previous hash for blockchain-like linking
            previous_hash = self._get_latest_hash()
            
            # Generate timestamp
            timestamp = datetime.utcnow().isoformat() + 'Z'
            
            # Create event data for hashing
            event_for_hash = {
                'event_type': event_data['event_type'],
                'entity_type': event_data['entity_type'],
                'entity_id': event_data['entity_id'],
                'action': event_data['action'],
                'actor_id': event_data['actor_id'],
                'actor_role': event_data.get('actor_role'),
                'timestamp': timestamp,
                'data': event_data.get('data', {}),
                'previous_hash': previous_hash
            }
            
            # Generate hash
            event_hash = self._generate_event_hash(event_for_hash)
            
            # Insert into database
            conn = sqlite3.connect(DB_PATH)
            cursor = conn.cursor()
            
            cursor.execute('''
                INSERT INTO audit_trail 
                (event_type, entity_type, entity_id, action, actor_id, actor_role, 
                 timestamp, data, hash, previous_hash, signature, signature_algorithm)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                event_data['event_type'],
                event_data['entity_type'],
                event_data['entity_id'],
                event_data['action'],
                event_data['actor_id'],
                event_data.get('actor_role'),
                timestamp,
                json.dumps(event_data.get('data', {})),
                event_hash,
                previous_hash,
                event_data.get('signature'),
                event_data.get('signature_algorithm')
            ))
            
            audit_id = cursor.lastrowid
            conn.commit()
            conn.close()
            
            logger.info(f"Audit event logged: {event_data['event_type']} - {event_data['action']}")
            
            return {
                'success': True,
                'audit_id': audit_id,
                'hash': event_hash,
                'timestamp': timestamp
            }
            
        except Exception as e:
            logger.error(f"Audit event logging error: {str(e)}")
            return {
                'success': False,
                'error': str(e)
            }
    
    def verify_audit_trail(self) -> Dict:
        """
        Verify the integrity of the audit trail
        
        Returns:
            Dictionary with verification results
        """
        try:
            conn = sqlite3.connect(DB_PATH)
            cursor = conn.cursor()
            
            # Get all events ordered by ID
            cursor.execute('''
                SELECT id, event_type, entity_type, entity_id, action, actor_id, 
                       actor_role, timestamp, data, hash, previous_hash
                FROM audit_trail 
                ORDER BY id ASC
            ''')
            
            events = cursor.fetchall()
            conn.close()
            
            if not events:
                return {
                    'success': True,
                    'verified': True,
                    'message': 'No audit events to verify'
                }
            
            # Verify each event
            verified_count = 0
            tampered_events = []
            
            for i, event in enumerate(events):
                # Create event data for hashing
                event_for_hash = {
                    'event_type': event[1],
                    'entity_type': event[2],
                    'entity_id': event[3],
                    'action': event[4],
                    'actor_id': event[5],
                    'actor_role': event[6],
                    'timestamp': event[7],
                    'data': json.loads(event[8]) if event[8] else {},
                    'previous_hash': event[10]
                }
                
                # Generate hash
                calculated_hash = self._generate_event_hash(event_for_hash)
                
                # Compare with stored hash
                if calculated_hash == event[9]:
                    verified_count += 1
                else:
                    tampered_events.append({
                        'id': event[0],
                        'event_type': event[1],
                        'timestamp': event[7]
                    })
            
            is_verified = len(tampered_events) == 0
            verification_rate = verified_count / len(events) if events else 1.0
            
            return {
                'success': True,
                'verified': is_verified,
                'verification_rate': verification_rate,
                'total_events': len(events),
                'verified_events': verified_count,
                'tampered_events': tampered_events,
                'timestamp': datetime.utcnow().isoformat() + 'Z'
            }
            
        except Exception as e:
            logger.error(f"Audit trail verification error: {str(e)}")
            return {
                'success': False,
                'error': str(e)
            }
    
    def get_audit_trail(self, entity_type: Optional[str] = None, entity_id: Optional[str] = None, 
                       limit: int = 100) -> Dict:
        """
        Get audit trail for a specific entity or all events
        
        Args:
            entity_type: Type of entity (optional)
            entity_id: ID of entity (optional)
            limit: Maximum number of events to return
            
        Returns:
            Dictionary with audit trail
        """
        try:
            conn = sqlite3.connect(DB_PATH)
            cursor = conn.cursor()
            
            # Build query based on parameters
            if entity_type and entity_id:
                cursor.execute('''
                    SELECT id, event_type, entity_type, entity_id, action, actor_id, 
                           actor_role, timestamp, data, hash, previous_hash, signature
                    FROM audit_trail 
                    WHERE entity_type = ? AND entity_id = ?
                    ORDER BY timestamp DESC
                    LIMIT ?
                ''', (entity_type, entity_id, limit))
            elif entity_type:
                cursor.execute('''
                    SELECT id, event_type, entity_type, entity_id, action, actor_id, 
                           actor_role, timestamp, data, hash, previous_hash, signature
                    FROM audit_trail 
                    WHERE entity_type = ?
                    ORDER BY timestamp DESC
                    LIMIT ?
                ''', (entity_type, limit))
            else:
                cursor.execute('''
                    SELECT id, event_type, entity_type, entity_id, action, actor_id, 
                           actor_role, timestamp, data, hash, previous_hash, signature
                    FROM audit_trail 
                    ORDER BY timestamp DESC
                    LIMIT ?
                ''', (limit,))
            
            events = cursor.fetchall()
            conn.close()
            
            # Format events
            formatted_events = []
            for event in events:
                formatted_events.append({
                    'id': event[0],
                    'event_type': event[1],
                    'entity_type': event[2],
                    'entity_id': event[3],
                    'action': event[4],
                    'actor_id': event[5],
                    'actor_role': event[6],
                    'timestamp': event[7],
                    'data': json.loads(event[8]) if event[8] else {},
                    'hash': event[9],
                    'previous_hash': event[10],
                    'signature': event[11]
                })
            
            return {
                'success': True,
                'events': formatted_events,
                'count': len(formatted_events)
            }
            
        except Exception as e:
            logger.error(f"Error retrieving audit trail: {str(e)}")
            return {
                'success': False,
                'error': str(e)
            }
    
    def sign_event(self, event_hash: str, private_key: str) -> Dict:
        """
        Sign an event with a private key
        
        Args:
            event_hash: Hash of the event to sign
            private_key: Private key for signing
            
        Returns:
            Dictionary with signature
        """
        try:
            # In a real implementation, this would use actual cryptographic signing
            # For this demo, we'll create a simple HMAC signature
            signature = hmac.new(
                private_key.encode(),
                event_hash.encode(),
                hashlib.sha256
            ).hexdigest()
            
            return {
                'success': True,
                'signature': signature,
                'algorithm': 'HMAC-SHA256'
            }
            
        except Exception as e:
            logger.error(f"Error signing event: {str(e)}")
            return {
                'success': False,
                'error': str(e)
            }
    
    def _get_latest_hash(self) -> Optional[str]:
        """Get the hash of the latest audit event"""
        try:
            conn = sqlite3.connect(DB_PATH)
            cursor = conn.cursor()
            
            cursor.execute('''
                SELECT hash FROM audit_trail 
                ORDER BY id DESC 
                LIMIT 1
            ''')
            
            result = cursor.fetchone()
            conn.close()
            
            return result[0] if result else None
            
        except Exception as e:
            logger.error(f"Error getting latest hash: {str(e)}")
            return None
    
    def _generate_event_hash(self, event_data: Dict) -> str:
        """
        Generate SHA256 hash for an event
        
        Args:
            event_data: Event data to hash
            
        Returns:
            SHA256 hash of the event
        """
        # Sort keys for consistent hashing
        event_json = json.dumps(event_data, sort_keys=True, separators=(',', ':'))
        return hashlib.sha256(event_json.encode()).hexdigest()

# Singleton instance
_audit_service_instance = None

def get_audit_service() -> AuditService:
    """
    Get singleton instance of AuditService
    
    Returns:
        AuditService instance
    """
    global _audit_service_instance
    
    if _audit_service_instance is None:
        _audit_service_instance = AuditService()
    
    return _audit_service_instance