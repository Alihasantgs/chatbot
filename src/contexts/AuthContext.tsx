import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type {
  User,
  LoginCredentials,
  RegisterCredentials,
  ForgotPasswordData,
  ResetPasswordData,
  LoginResponse,
} from '../types';
import { authApi } from '../api/auth.api';
import { storage } from '../utils/storage';
import { STORAGE_KEYS } from '../utils/constants';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  register: (credentials: RegisterCredentials) => Promise<void>;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  forgotPassword: (data: ForgotPasswordData) => Promise<void>;
  resetPassword: (data: ResetPasswordData) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        // Get token directly from localStorage (not JSON parsed)
        const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
        
        if (token) {
          // Verify token and get fresh user data
          try {
            const currentUser = await authApi.getCurrentUser();
            storage.set(STORAGE_KEYS.USER, currentUser);
            setUser(currentUser);
          } catch (error) {
            // Token invalid or expired, clear storage
            console.error('Token verification failed:', error);
            localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
            storage.remove(STORAGE_KEYS.USER);
            setUser(null);
          }
        } else {
          // No token, ensure user is null
          setUser(null);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        // On error, clear everything to be safe
        localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
        storage.remove(STORAGE_KEYS.USER);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const register = async (credentials: RegisterCredentials): Promise<void> => {
    try {
      // Just register the user, don't auto-login
      await authApi.register(credentials);
      // User will need to login manually after registration
    } catch (error) {
      throw error;
    }
  };

  const login = async (credentials: LoginCredentials): Promise<void> => {
    try {
      const response: LoginResponse = await authApi.login(credentials);
      // Save access_token to localStorage
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, response.access_token);
      // Save user data to localStorage
      storage.set(STORAGE_KEYS.USER, response.user);
      setUser(response.user);
    } catch (error) {
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      storage.remove(STORAGE_KEYS.USER);
      setUser(null);
    }
  };

  const forgotPassword = async (data: ForgotPasswordData): Promise<void> => {
    await authApi.forgotPassword(data);
  };

  const resetPassword = async (data: ResetPasswordData): Promise<void> => {
    await authApi.resetPassword(data);
  };

  const refreshUser = async (): Promise<void> => {
    try {
      const updatedUser = await authApi.getCurrentUser();
      storage.set(STORAGE_KEYS.USER, updatedUser);
      setUser(updatedUser);
    } catch (error) {
      console.error('Error refreshing user:', error);
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    register,
    login,
    logout,
    forgotPassword,
    resetPassword,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
