import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { AuthLayout } from '../../components/layout/AuthLayout';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { ErrorAlert } from '../../components/auth/ErrorAlert';
import { DemoDataButton } from '../../components/auth/DemoDataButton';
import { ROUTES } from '../../utils/constants';
import { FiCheckCircle } from 'react-icons/fi';

export const ForgotPassword = () => {
  const { forgotPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    
    const emailError = validateEmail(email);
    if (emailError) {
      setError(emailError);
      return;
    }
    
    setIsLoading(true);
    try {
      await forgotPassword({ email });
      setIsSuccess(true);
    } catch (err: any) {
      // Get error message from API response
      const errorDetail = err.response?.data?.detail;
      let errorMessage = 'Failed to send reset email. Please try again.';
      
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

  const fillDummyData = () => {
    setEmail('demo@example.com');
    setError('');
  };

  if (isSuccess) {
    return (
      <AuthLayout title="Check Your Email">
        <div className="text-center py-4">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-green-500/20 dark:bg-green-500/10 rounded-full flex items-center justify-center">
              <FiCheckCircle className="w-8 h-8 text-green-500 dark:text-green-400" />
            </div>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Email Sent!</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            We've sent a password reset link to <strong className="text-gray-900 dark:text-white">{email}</strong>
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Please check your inbox and follow the instructions to reset your password.
          </p>
          <Link
            to={ROUTES.LOGIN}
            className="text-primary-500 dark:text-primary-400 hover:text-primary-600 dark:hover:text-primary-300 font-medium transition-colors"
          >
            Back to Login
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Forgot Password"
      subtitle="Enter your email to receive a password reset link"
      footerText="Remember your password?"
      footerLink={ROUTES.LOGIN}
      footerLinkText="Sign in"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <ErrorAlert message={error} />
        
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
          <DemoDataButton onClick={fillDummyData} />
        </div>
        <Input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (error) {
              setError('');
            }
          }}
          onBlur={() => {
            const emailError = validateEmail(email);
            if (emailError) {
              setError(emailError);
            }
          }}
          error={error ? error : undefined}
          disabled={isLoading}
        />
        
        <Button
          type="submit"
          className="w-full"
          isLoading={isLoading}
        >
          Send Reset Link
        </Button>
      </form>
    </AuthLayout>
  );
};

