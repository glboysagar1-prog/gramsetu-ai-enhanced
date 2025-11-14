// User service for interacting with the InsForge backend
const API_BASE_URL = process.env.REACT_APP_INSFORGE_URL || 'https://89gp4et3.us-east.insforge.app';
const USERS_API_URL = `${API_BASE_URL}/functions/users`;

// Get user profile
export const getUserProfile = async (token) => {
  const response = await fetch(`${USERS_API_URL}/profile`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  const result = await response.json();
  
  if (!response.ok) {
    throw new Error(result.error || 'Failed to fetch profile');
  }
  
  return result;
};

// Update user profile
export const updateUserProfile = async (profileData, token) => {
  const response = await fetch(`${USERS_API_URL}/profile`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(profileData)
  });
  
  const result = await response.json();
  
  if (!response.ok) {
    throw new Error(result.error || 'Failed to update profile');
  }
  
  return result;
};

// Get user reputation score
export const getUserReputation = async (token) => {
  const response = await fetch(`${USERS_API_URL}/reputation`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  const result = await response.json();
  
  if (!response.ok) {
    throw new Error(result.error || 'Failed to fetch reputation score');
  }
  
  return result;
};

export default {
  getUserProfile,
  updateUserProfile,
  getUserReputation
};