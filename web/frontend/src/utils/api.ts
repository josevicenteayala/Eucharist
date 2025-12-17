import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore';

// Access environment variable or default to localhost
const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

export const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle 401 (optional: logout on unauthorized)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Logic to handle token expiration could go here
      // For now, we might just let the UI handle the error
      useAuthStore.getState().logout();
    }
    if (error.response?.status && error.response.status >= 500) {
      console.error('Server Error:', error.response.data);
    }
    return Promise.reject(error);
  }
);
