/**
 * API Configuration for GramSetu AI
 * 
 * This file manages connections to multiple backends:
 * - Replit Backend (Auth, Files, Analytics) - Port 5001
 * - Flask Backend (Complaints, AI, CRS, Blockchain) - Port 5002
 */

// Backend URLs
export const API_CONFIG = {
  // Replit Backend - Authentication & File Management
  REPLIT_BASE_URL: process.env.REACT_APP_REPLIT_API_URL || 'http://localhost:5001',
  
  // Flask Backend - Complaint Management & AI
  FLASK_BASE_URL: process.env.REACT_APP_FLASK_API_URL || 'http://localhost:5002',
};

// API Endpoints organized by backend
export const API_ENDPOINTS = {
  // Replit Backend Endpoints
  REPLIT: {
    AUTH: {
      SIGNUP: `${API_CONFIG.REPLIT_BASE_URL}/api/auth/signup`,
      LOGIN: `${API_CONFIG.REPLIT_BASE_URL}/api/auth/login`,
    },
    FILES: {
      UPLOAD: `${API_CONFIG.REPLIT_BASE_URL}/api/files/upload`,
      LIST: `${API_CONFIG.REPLIT_BASE_URL}/api/files`,
      DELETE: (id: string) => `${API_CONFIG.REPLIT_BASE_URL}/api/files/${id}`,
    },
    ANALYTICS: {
      GET: `${API_CONFIG.REPLIT_BASE_URL}/api/analytics`,
    },
  },
  
  // Flask Backend Endpoints
  FLASK: {
    COMPLAINTS: {
      SUBMIT: `${API_CONFIG.FLASK_BASE_URL}/api/complaint`,
      LIST: `${API_CONFIG.FLASK_BASE_URL}/api/complaints`,
      GET_BY_ID: (id: string) => `${API_CONFIG.FLASK_BASE_URL}/api/complaint/${id}`,
      GET_BY_CITIZEN: (citizenId: string) => `${API_CONFIG.FLASK_BASE_URL}/api/complaints/citizen/${citizenId}`,
    },
    DASHBOARD: {
      GET: `${API_CONFIG.FLASK_BASE_URL}/api/dashboard`,
    },
    CRS: {
      GET_SCORE: (citizenId: string) => `${API_CONFIG.FLASK_BASE_URL}/api/crs/${citizenId}`,
    },
    ASSIGNMENTS: {
      LIST: `${API_CONFIG.FLASK_BASE_URL}/api/assignments`,
      CREATE: `${API_CONFIG.FLASK_BASE_URL}/api/assignments`,
      UPDATE_STATUS: (id: string) => `${API_CONFIG.FLASK_BASE_URL}/api/assignments/${id}`,
    },
  },
};

// Helper function to get auth token
export const getAuthToken = () => {
  return localStorage.getItem('authToken') || localStorage.getItem('token');
};

// Helper function to create authenticated headers
export const getAuthHeaders = () => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };
};

// API Helper Functions
export const api = {
  // Replit Backend Calls
  replit: {
    async signup(username: string, email: string, password: string) {
      const response = await fetch(API_ENDPOINTS.REPLIT.AUTH.SIGNUP, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });
      return response.json();
    },
    
    async login(email: string, password: string) {
      const response = await fetch(API_ENDPOINTS.REPLIT.AUTH.LOGIN, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (data.token) {
        localStorage.setItem('authToken', data.token);
      }
      return data;
    },
    
    async getFiles() {
      const response = await fetch(API_ENDPOINTS.REPLIT.FILES.LIST, {
        headers: getAuthHeaders(),
      });
      return response.json();
    },
    
    async uploadFile(filename: string, fileType: string, fileSize: number) {
      const response = await fetch(API_ENDPOINTS.REPLIT.FILES.UPLOAD, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ filename, fileType, fileSize }),
      });
      return response.json();
    },
    
    async getAnalytics(useDummy = false) {
      const url = useDummy 
        ? `${API_ENDPOINTS.REPLIT.ANALYTICS.GET}?dummy=true`
        : API_ENDPOINTS.REPLIT.ANALYTICS.GET;
      const response = await fetch(url, {
        headers: getAuthHeaders(),
      });
      return response.json();
    },
  },
  
  // Flask Backend Calls
  flask: {
    async submitComplaint(text: string, citizenId: string, evidence?: string) {
      const response = await fetch(API_ENDPOINTS.FLASK.COMPLAINTS.SUBMIT, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ text, citizen_id: citizenId, evidence }),
      });
      return response.json();
    },
    
    async getComplaints(citizenId?: string) {
      const url = citizenId 
        ? API_ENDPOINTS.FLASK.COMPLAINTS.GET_BY_CITIZEN(citizenId)
        : API_ENDPOINTS.FLASK.COMPLAINTS.LIST;
      const response = await fetch(url, {
        headers: getAuthHeaders(),
      });
      return response.json();
    },
    
    async getDashboard(role?: string) {
      const url = role 
        ? `${API_ENDPOINTS.FLASK.DASHBOARD.GET}?role=${role}`
        : API_ENDPOINTS.FLASK.DASHBOARD.GET;
      const response = await fetch(url, {
        headers: getAuthHeaders(),
      });
      return response.json();
    },
    
    async getCRSScore(citizenId: string) {
      const response = await fetch(API_ENDPOINTS.FLASK.CRS.GET_SCORE(citizenId), {
        headers: getAuthHeaders(),
      });
      return response.json();
    },
  },
};

export default api;
