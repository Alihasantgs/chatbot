import axios from 'axios';
import type { AxiosInstance, InternalAxiosRequestConfig, AxiosError } from 'axios';
import { STORAGE_KEYS, getApiBaseUrl } from '../utils/constants';

/**
 * Create and configure Axios instance with interceptors
 */
export const createAxiosInstance = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: getApiBaseUrl(),
   
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Request Interceptor: Add auth token to requests
  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      
      return config;
    },
    (error: AxiosError) => {
      return Promise.reject(error);
    }
  );

  // Response Interceptor: Handle errors globally
  instance.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error: AxiosError) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

      // Handle 401 Unauthorized - Clear auth and redirect to login
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        
      // Clear stored auth data
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      try {
        localStorage.removeItem(STORAGE_KEYS.USER);
      } catch {
        // User might be stored differently, ignore
      }
        
        // Only redirect if not already on login page
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }

      // Handle network errors
      if (!error.response) {
        console.error('Network Error:', error.message);
      }

      return Promise.reject(error);
    }
  );

  return instance;
};

// Export singleton instance
export const axiosInstance = createAxiosInstance();

