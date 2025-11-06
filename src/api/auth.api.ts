import { axiosInstance } from './axios.instance';
import type {
  LoginResponse,
  RegisterResponse,
  LoginCredentials,
  RegisterCredentials,
  ForgotPasswordData,
  ResetPasswordData,
  User,
} from '../types';

/**
 * Authentication API Service
 * Handles all authentication-related API calls
 */
export const authApi = {
  /**
   * Register a new user
   */
  register: async (credentials: RegisterCredentials): Promise<RegisterResponse> => {
    const { data } = await axiosInstance.post<RegisterResponse>('/auth/register', {
      email: credentials.email,
      username: credentials.username,
      first_name: credentials.first_name,
      last_name: credentials.last_name,
      password: credentials.password,
    });

    return data;
  },

  /**
   * Login with email and password
   */
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const { data } = await axiosInstance.post<LoginResponse>('/auth/login', {
      email: credentials.email,
      password: credentials.password,
    });

    return data;
  },

  /**
   * Request password reset email
   */
  forgotPassword: async (data: ForgotPasswordData): Promise<{ message: string }> => {
    const response = await axiosInstance.post<{ message: string }>(
      '/auth/forgot-password',
      { email: data.email }
    );

    return response.data;
  },

  /**
   * Reset password using token from email
   */
  resetPassword: async (data: ResetPasswordData): Promise<{ message: string }> => {
    const response = await axiosInstance.post<{ message: string }>(
      '/auth/reset-password',
      {
        token: data.token,
        new_password: data.new_password,
      }
    );

    return response.data;
  },

  /**
   * Get current authenticated user information
   */
  getCurrentUser: async (): Promise<User> => {
    const { data } = await axiosInstance.get<User>('/auth/me');
    return data;
  },

  /**
   * Verify if JWT token is valid
   */
  verifyToken: async (): Promise<string> => {
    const { data } = await axiosInstance.get<string>('/auth/verify-token');
    return data;
  },

  /**
   * Logout user (clears local storage, backend doesn't have logout endpoint)
   */
  logout: async (): Promise<void> => {
    // Backend doesn't have logout endpoint
    // Auth state is cleared in AuthContext
  },
};
