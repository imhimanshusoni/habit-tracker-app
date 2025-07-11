import AsyncStorage from '@react-native-async-storage/async-storage';

// API Configuration
export const API_BASE_URL = 'http://192.168.0.186:3002/api';

// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    PROFILE: '/auth/me',
  },
  HABITS: {
    BASE: '/habits',
    BY_ID: (id) => `/habits/${id}`,
  },
};

// Helper function to get full API URL
export const getApiUrl = (endpoint) => {
  if (typeof endpoint === 'function') {
    return `${API_BASE_URL}${endpoint()}`;
  }
  return `${API_BASE_URL}${endpoint}`;
};

// Create a wrapper for API calls with common error handling
export const apiRequest = async (url, options = {}) => {
  const token = await AsyncStorage.getItem('token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...options.headers,
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      if (response.status === 401) {
        // Token expired or invalid
        await AsyncStorage.removeItem('token');
        // You might want to redirect to login here
        throw new Error('Session expired. Please log in again.');
      }
      
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Something went wrong');
    }

    // For DELETE requests that might not return content
    if (response.status === 204) return null;
    
    return await response.json();
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
};
