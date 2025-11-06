/**
 * Get API Base URL from environment variable
 * Falls back to default if not set
 */
export const getApiBaseUrl = (): string => {
  return import.meta.env.VITE_API_BASE_URL || 'http://192.168.0.142:8000/api';
};

// For backward compatibility
export const API_BASE_URL = getApiBaseUrl();

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER: 'user',
} as const;

export const ROUTES = {
  LOGIN: '/login',
  SIGNUP: '/signup',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  CHAT: '/chat',
  HOME: '/',
} as const;

