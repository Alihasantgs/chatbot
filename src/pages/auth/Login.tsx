import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { AuthLayout } from '../../components/layout/AuthLayout';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { PasswordInput } from '../../components/auth/PasswordInput';
import { ErrorAlert } from '../../components/auth/ErrorAlert';
import { ROUTES } from '../../utils/constants';

export const Login = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated, isLoading: authLoading } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Redirect to chat if already authenticated
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      navigate(ROUTES.CHAT, { replace: true });
    }
  }, [isAuthenticated, authLoading, navigate]);

  const validateEmail = (email: string): string | undefined => {
    if (!email) {
      return 'Email is required';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return 'Please enter a valid email address';
    }
    return undefined;
  };

  const validatePassword = (password: string): string | undefined => {
    if (!password) {
      return 'Password is required';
    }
    if (password.length < 6) {
      return 'Password must be at least 6 characters';
    }
    return undefined;
  };

  const validate = () => {
    const newErrors: { email?: string; password?: string } = {};
    
    const emailError = validateEmail(formData.email);
    if (emailError) {
      newErrors.email = emailError;
    }
    
    const passwordError = validatePassword(formData.password);
    if (passwordError) {
      newErrors.password = passwordError;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!validate()) return;
    
    setIsLoading(true);
    try {
      await login(formData);
      navigate(ROUTES.CHAT);
    } catch (err: any) {
      // Get error message from API response
      const errorDetail = err.response?.data?.detail;
      let errorMessage = 'Login failed. Please try again.';
      
      // Handle detail field - can be string or array
      if (errorDetail) {
        if (typeof errorDetail === 'string') {
          // detail is a string like "Incorrect email or password"
          errorMessage = errorDetail;
        } else if (Array.isArray(errorDetail) && errorDetail.length > 0) {
          // detail is an array of error objects
          errorMessage = errorDetail[0]?.msg || errorDetail[0]?.message || errorMessage;
        }
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.response?.status === 404) {
        errorMessage = 'Service not found. Please check your connection.';
      } else if (err.response?.status >= 500) {
        errorMessage = 'Server error. Please try again later.';
      } else if (err.message && !err.message.includes('404') && !err.message.includes('Network')) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Sign in to continue to your account"
      footerText="Don't have an account?"
      footerLink={ROUTES.SIGNUP}
      footerLinkText="Sign up"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <ErrorAlert message={error} />
        
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
        <Input
          type="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={(e) => {
            setFormData({ ...formData, email: e.target.value });
            if (errors.email) {
              setErrors({ ...errors, email: undefined });
            }
          }}
          onBlur={() => {
            const error = validateEmail(formData.email);
            if (error) {
              setErrors({ ...errors, email: error });
            }
          }}
          error={errors.email}
          disabled={isLoading}
        />
        
        <PasswordInput
          label="Password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={(e) => {
            setFormData({ ...formData, password: e.target.value });
            if (errors.password) {
              setErrors({ ...errors, password: undefined });
            }
          }}
          onBlur={() => {
            const error = validatePassword(formData.password);
            if (error) {
              setErrors({ ...errors, password: error });
            }
          }}
          error={errors.password}
          disabled={isLoading}
        />
        <Link
          to={ROUTES.FORGOT_PASSWORD}
          className="text-sm text-primary-500 dark:text-primary-400 hover:text-primary-600 dark:hover:text-primary-300 mt-1.5 block text-right transition-colors"
        >
          Forgot password?
        </Link>
        
        <Button
          type="submit"
          className="w-full"
          isLoading={isLoading}
        >
          Sign In
        </Button>
      </form>
    </AuthLayout>
  );
};

