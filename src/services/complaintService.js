// Complaint service for interacting with the InsForge backend
const API_BASE_URL = process.env.REACT_APP_INSFORGE_URL || 'https://89gp4et3.us-east.insforge.app';
const COMPLAINTS_API_URL = `${API_BASE_URL}/functions/complaints`;

// Create a new complaint
export const createComplaint = async (complaintData, token) => {
  const response = await fetch(COMPLAINTS_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(complaintData)
  });
  
  const result = await response.json();
  
  if (!response.ok) {
    throw new Error(result.error || 'Failed to create complaint');
  }
  
  return result;
};

// Get complaints for the current user
export const getUserComplaints = async (token, filters = {}) => {
  const params = new URLSearchParams(filters);
  const url = `${COMPLAINTS_API_URL}?${params.toString()}`;
  
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  const result = await response.json();
  
  if (!response.ok) {
    throw new Error(result.error || 'Failed to fetch complaints');
  }
  
  return result;
};

// Get a specific complaint by ID
export const getComplaintById = async (complaintId, token) => {
  const response = await fetch(`${COMPLAINTS_API_URL}/${complaintId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  const result = await response.json();
  
  if (!response.ok) {
    throw new Error(result.error || 'Failed to fetch complaint');
  }
  
  return result;
};

// Update a complaint
export const updateComplaint = async (complaintId, complaintData, token) => {
  const response = await fetch(`${COMPLAINTS_API_URL}/${complaintId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(complaintData)
  });
  
  const result = await response.json();
  
  if (!response.ok) {
    throw new Error(result.error || 'Failed to update complaint');
  }
  
  return result;
};

// Delete a complaint
export const deleteComplaint = async (complaintId, token) => {
  const response = await fetch(`${COMPLAINTS_API_URL}/${complaintId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  const result = await response.json();
  
  if (!response.ok) {
    throw new Error(result.error || 'Failed to delete complaint');
  }
  
  return result;
};

// Upload evidence file
export const uploadEvidence = async (file, token) => {
  // This would use the InsForge storage API
  // Implementation would depend on how you want to handle file uploads
  throw new Error('File upload not yet implemented');
};

export default {
  createComplaint,
  getUserComplaints,
  getComplaintById,
  updateComplaint,
  deleteComplaint,
  uploadEvidence
};