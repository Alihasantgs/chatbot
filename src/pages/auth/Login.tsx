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
import { validateEmail, validatePasswordSimple } from '../../utils/validation';
import { normalizeEmail } from '../../utils/normalize';
import { extractErrorMessage } from '../../utils/errorHandler';

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

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      navigate(ROUTES.CHAT, { replace: true });
    }
  }, [isAuthenticated, authLoading, navigate]);

  const handleEmailBlur = () => {
    const normalized = normalizeEmail(formData.email);
    if (normalized !== formData.email) {
      setFormData((prev) => ({ ...prev, email: normalized }));
    }
    const emailError = validateEmail(normalized);
    if (emailError) {
      setErrors((prev) => ({ ...prev, email: emailError }));
    }
  };

  const handlePasswordBlur = () => {
    const passwordError = validatePasswordSimple(formData.password);
    if (passwordError) {
      setErrors((prev) => ({ ...prev, password: passwordError }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    const normalizedEmail = normalizeEmail(formData.email);
    const normalizedFormData = { ...formData, email: normalizedEmail };
    setFormData(normalizedFormData);

    const emailError = validateEmail(normalizedEmail);
    const passwordError = validatePasswordSimple(formData.password);

    if (emailError || passwordError) {
      setErrors({ email: emailError, password: passwordError });
      return;
    }

    setIsLoading(true);
    try {
      await login(normalizedFormData);
      navigate(ROUTES.CHAT);
    } catch (err: any) {
      setError(extractErrorMessage(err, 'Login failed. Please try again.'));
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
            setFormData((prev) => ({ ...prev, email: e.target.value }));
            if (errors.email) {
              setErrors((prev) => ({ ...prev, email: undefined }));
            }
          }}
          onBlur={handleEmailBlur}
          error={errors.email}
          disabled={isLoading}
        />

        <PasswordInput
          label="Password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={(e) => {
            setFormData((prev) => ({ ...prev, password: e.target.value }));
            if (errors.password) {
              setErrors((prev) => ({ ...prev, password: undefined }));
            }
          }}
          onBlur={handlePasswordBlur}
          error={errors.password}
          disabled={isLoading}
        />

        <Link
          to={ROUTES.FORGOT_PASSWORD}
          className="text-sm text-primary-500 dark:text-primary-400 hover:text-primary-600 dark:hover:text-primary-300 mt-1.5 block text-right transition-colors"
        >
          Forgot password?
        </Link>

        <Button type="submit" className="w-full" isLoading={isLoading}>
          Sign In
        </Button>
      </form>
    </AuthLayout>
  );
};
