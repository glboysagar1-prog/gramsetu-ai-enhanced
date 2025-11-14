"""
GramSetu AI - CSC/Agent Management Service
Service for managing Common Service Centers and agents for rural accessibility

Features:
- CSC registration and management
- Agent authentication and authorization
- Kiosk mode support
- Complaint filing assistance
"""

import logging
import sqlite3
from datetime import datetime
from typing import Dict, List, Optional
import hashlib
import secrets

logger = logging.getLogger(__name__)

# Database path (should match app.py)
DB_PATH = 'gramsetu_ai.db'

class CSCAgentService:
    """
    Service class for managing CSCs and agents
    """
    
    def __init__(self):
        """Initialize the CSC/Agent service"""
        logger.info("Initializing CSCAgentService")
        self._ensure_tables_exist()
    
    def _ensure_tables_exist(self):
        """Ensure required database tables exist"""
        try:
            conn = sqlite3.connect(DB_PATH)
            cursor = conn.cursor()
            
            # Create CSC table
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS cscs (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT NOT NULL,
                    location TEXT NOT NULL,
                    district TEXT NOT NULL,
                    state TEXT NOT NULL,
                    pincode TEXT,
                    contact_person TEXT,
                    phone TEXT,
                    email TEXT,
                    status TEXT DEFAULT 'active',
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            ''')
            
            # Create agents table
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS agents (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    csc_id INTEGER NOT NULL,
                    name TEXT NOT NULL,
                    phone TEXT NOT NULL,
                    email TEXT,
                    employee_id TEXT UNIQUE,
                    password_hash TEXT NOT NULL,
                    role TEXT DEFAULT 'agent',
                    status TEXT DEFAULT 'active',
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (csc_id) REFERENCES cscs (id)
                )
            ''')
            
            # Create kiosk_sessions table
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS kiosk_sessions (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    csc_id INTEGER NOT NULL,
                    agent_id INTEGER,
                    session_token TEXT UNIQUE,
                    ip_address TEXT,
                    user_agent TEXT,
                    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    ended_at TIMESTAMP,
                    status TEXT DEFAULT 'active',
                    FOREIGN KEY (csc_id) REFERENCES cscs (id),
                    FOREIGN KEY (agent_id) REFERENCES agents (id)
                )
            ''')
            
            conn.commit()
            conn.close()
            logger.info("CSC/Agent tables ensured")
            
        except Exception as e:
            logger.error(f"Error ensuring CSC/Agent tables: {str(e)}")
            raise
    
    def register_csc(self, csc_data: Dict) -> Dict:
        """
        Register a new CSC
        
        Args:
            csc_data: Dictionary with CSC information
            
        Returns:
            Dictionary with registration results
        """
        try:
            conn = sqlite3.connect(DB_PATH)
            cursor = conn.cursor()
            
            cursor.execute('''
                INSERT INTO cscs 
                (name, location, district, state, pincode, contact_person, phone, email)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                csc_data.get('name'),
                csc_data.get('location'),
                csc_data.get('district'),
                csc_data.get('state'),
                csc_data.get('pincode'),
                csc_data.get('contact_person'),
                csc_data.get('phone'),
                csc_data.get('email')
            ))
            
            csc_id = cursor.lastrowid
            conn.commit()
            conn.close()
            
            logger.info(f"CSC registered with ID: {csc_id}")
            return {
                'success': True,
                'csc_id': csc_id,
                'message': 'CSC registered successfully'
            }
            
        except Exception as e:
            logger.error(f"CSC registration error: {str(e)}")
            return {
                'success': False,
                'error': str(e)
            }
    
    def register_agent(self, agent_data: Dict) -> Dict:
        """
        Register a new agent
        
        Args:
            agent_data: Dictionary with agent information
            
        Returns:
            Dictionary with registration results
        """
        try:
            # Hash password
            password_hash = self._hash_password(agent_data.get('password', ''))
            
            conn = sqlite3.connect(DB_PATH)
            cursor = conn.cursor()
            
            cursor.execute('''
                INSERT INTO agents 
                (csc_id, name, phone, email, employee_id, password_hash, role)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            ''', (
                agent_data.get('csc_id'),
                agent_data.get('name'),
                agent_data.get('phone'),
                agent_data.get('email'),
                agent_data.get('employee_id'),
                password_hash,
                agent_data.get('role', 'agent')
            ))
            
            agent_id = cursor.lastrowid
            conn.commit()
            conn.close()
            
            logger.info(f"Agent registered with ID: {agent_id}")
            return {
                'success': True,
                'agent_id': agent_id,
                'message': 'Agent registered successfully'
            }
            
        except Exception as e:
            logger.error(f"Agent registration error: {str(e)}")
            return {
                'success': False,
                'error': str(e)
            }
    
    def authenticate_agent(self, employee_id: str, password: str) -> Dict:
        """
        Authenticate an agent
        
        Args:
            employee_id: Agent's employee ID
            password: Agent's password
            
        Returns:
            Dictionary with authentication results
        """
        try:
            conn = sqlite3.connect(DB_PATH)
            cursor = conn.cursor()
            
            cursor.execute('''
                SELECT id, csc_id, name, phone, email, employee_id, password_hash, role, status
                FROM agents 
                WHERE employee_id = ? AND status = 'active'
            ''', (employee_id,))
            
            agent = cursor.fetchone()
            conn.close()
            
            if not agent:
                return {
                    'success': False,
                    'error': 'Agent not found or inactive'
                }
            
            # Verify password
            if not self._verify_password(password, agent[6]):
                return {
                    'success': False,
                    'error': 'Invalid password'
                }
            
            # Return agent info (excluding password hash)
            agent_info = {
                'id': agent[0],
                'csc_id': agent[1],
                'name': agent[2],
                'phone': agent[3],
                'email': agent[4],
                'employee_id': agent[5],
                'role': agent[7],
                'status': agent[8]
            }
            
            logger.info(f"Agent authenticated: {employee_id}")
            return {
                'success': True,
                'agent': agent_info,
                'message': 'Authentication successful'
            }
            
        except Exception as e:
            logger.error(f"Agent authentication error: {str(e)}")
            return {
                'success': False,
                'error': str(e)
            }
    
    def start_kiosk_session(self, csc_id: int, agent_id: Optional[int] = None, 
                           ip_address: Optional[str] = None, user_agent: Optional[str] = None) -> Dict:
        """
        Start a kiosk session for CSC
        
        Args:
            csc_id: CSC ID
            agent_id: Optional agent ID
            ip_address: IP address of kiosk
            user_agent: User agent string
            
        Returns:
            Dictionary with session information
        """
        try:
            # Generate session token
            session_token = secrets.token_urlsafe(32)
            
            conn = sqlite3.connect(DB_PATH)
            cursor = conn.cursor()
            
            cursor.execute('''
                INSERT INTO kiosk_sessions 
                (csc_id, agent_id, session_token, ip_address, user_agent)
                VALUES (?, ?, ?, ?, ?)
            ''', (csc_id, agent_id, session_token, ip_address, user_agent))
            
            session_id = cursor.lastrowid
            conn.commit()
            conn.close()
            
            logger.info(f"Kiosk session started: {session_id}")
            return {
                'success': True,
                'session_id': session_id,
                'session_token': session_token,
                'message': 'Kiosk session started successfully'
            }
            
        except Exception as e:
            logger.error(f"Kiosk session start error: {str(e)}")
            return {
                'success': False,
                'error': str(e)
            }
    
    def get_csc_info(self, csc_id: int) -> Dict:
        """
        Get CSC information
        
        Args:
            csc_id: CSC ID
            
        Returns:
            Dictionary with CSC information
        """
        try:
            conn = sqlite3.connect(DB_PATH)
            cursor = conn.cursor()
            
            cursor.execute('''
                SELECT id, name, location, district, state, pincode, contact_person, phone, email, status
                FROM cscs 
                WHERE id = ?
            ''', (csc_id,))
            
            csc = cursor.fetchone()
            conn.close()
            
            if not csc:
                return {
                    'success': False,
                    'error': 'CSC not found'
                }
            
            csc_info = {
                'id': csc[0],
                'name': csc[1],
                'location': csc[2],
                'district': csc[3],
                'state': csc[4],
                'pincode': csc[5],
                'contact_person': csc[6],
                'phone': csc[7],
                'email': csc[8],
                'status': csc[9]
            }
            
            return {
                'success': True,
                'csc': csc_info
            }
            
        except Exception as e:
            logger.error(f"CSC info retrieval error: {str(e)}")
            return {
                'success': False,
                'error': str(e)
            }
    
    def get_csc_agents(self, csc_id: int) -> Dict:
        """
        Get agents for a CSC
        
        Args:
            csc_id: CSC ID
            
        Returns:
            Dictionary with agents list
        """
        try:
            conn = sqlite3.connect(DB_PATH)
            cursor = conn.cursor()
            
            cursor.execute('''
                SELECT id, name, phone, email, employee_id, role, status
                FROM agents 
                WHERE csc_id = ? AND status = 'active'
            ''', (csc_id,))
            
            agents = cursor.fetchall()
            conn.close()
            
            agents_list = []
            for agent in agents:
                agents_list.append({
                    'id': agent[0],
                    'name': agent[1],
                    'phone': agent[2],
                    'email': agent[3],
                    'employee_id': agent[4],
                    'role': agent[5],
                    'status': agent[6]
                })
            
            return {
                'success': True,
                'agents': agents_list
            }
            
        except Exception as e:
            logger.error(f"CSC agents retrieval error: {str(e)}")
            return {
                'success': False,
                'error': str(e)
            }
    
    def _hash_password(self, password: str) -> str:
        """
        Hash password using SHA-256
        
        Args:
            password: Plain text password
            
        Returns:
            Hashed password
        """
        return hashlib.sha256(password.encode()).hexdigest()
    
    def _verify_password(self, password: str, hash: str) -> bool:
        """
        Verify password against hash
        
        Args:
            password: Plain text password
            hash: Hashed password
            
        Returns:
            Boolean indicating if password matches hash
        """
        return self._hash_password(password) == hash

# Singleton instance
_csc_agent_service_instance = None

def get_csc_agent_service() -> CSCAgentService:
    """
    Get singleton instance of CSCAgentService
    
    Returns:
        CSCAgentService instance
    """
    global _csc_agent_service_instance
    
    if _csc_agent_service_instance is None:
        _csc_agent_service_instance = CSCAgentService()
    
    return _csc_agent_service_instance