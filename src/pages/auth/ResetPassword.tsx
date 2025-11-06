import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { AuthLayout } from '../../components/layout/AuthLayout';
import { Button } from '../../components/ui/Button';
import { PasswordInput } from '../../components/auth/PasswordInput';
import { ErrorAlert } from '../../components/auth/ErrorAlert';
import { DemoDataButton } from '../../components/auth/DemoDataButton';
import { ROUTES } from '../../utils/constants';
import { FiCheckCircle } from 'react-icons/fi';
import { validatePasswordReset, validateConfirmPassword } from '../../utils/validation';
import { extractErrorMessage } from '../../utils/errorHandler';

export const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { resetPassword } = useAuth();
  const token = searchParams.get('token');

  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<{ password?: string; confirmPassword?: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handlePasswordBlur = () => {
    const passwordError = validatePasswordReset(formData.password);
    if (passwordError) {
      setErrors((prev) => ({ ...prev, password: passwordError }));
    }
  };

  const handleConfirmPasswordBlur = () => {
    const confirmError = validateConfirmPassword(formData.confirmPassword, formData.password);
    if (confirmError) {
      setErrors((prev) => ({ ...prev, confirmPassword: confirmError }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!token) {
      setError('Invalid reset token. Please use the link from your email.');
      return;
    }

    const passwordError = validatePasswordReset(formData.password);
    const confirmPasswordError = validateConfirmPassword(
      formData.confirmPassword,
      formData.password
    );

    if (passwordError || confirmPasswordError) {
      setErrors({
        password: passwordError,
        confirmPassword: confirmPasswordError,
      });
      return;
    }

    setIsLoading(true);
    try {
      await resetPassword({
        token,
        new_password: formData.password,
        confirmPassword: formData.confirmPassword,
      });
      setIsSuccess(true);
      setTimeout(() => {
        navigate(ROUTES.LOGIN);
      }, 2000);
    } catch (err: any) {
      setError(extractErrorMessage(err, 'Failed to reset password. Please try again.'));
    } finally {
      setIsLoading(false);
    }
  };

  const fillDummyData = () => {
    setFormData({
      password: 'Test1234',
      confirmPassword: 'Test1234',
    });
    setErrors({});
    setError('');
  };

  if (isSuccess) {
    return (
      <AuthLayout title="Password Reset Successful">
        <div className="text-center py-4">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-green-500/20 dark:bg-green-500/10 rounded-full flex items-center justify-center">
              <FiCheckCircle className="w-8 h-8 text-green-500 dark:text-green-400" />
            </div>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Password Reset Successful!
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Your password has been successfully reset. Redirecting to login...
          </p>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Reset Password"
      subtitle="Enter your new password"
      footerText="Remember your password?"
      footerLink={ROUTES.LOGIN}
      footerLinkText="Sign in"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <ErrorAlert message={error} />

        {!token && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 text-yellow-700 dark:text-yellow-400 px-4 py-3 rounded-lg text-sm">
            Invalid reset token. Please use the link from your email.
          </div>
        )}

        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            New Password
          </label>
          <DemoDataButton onClick={fillDummyData} />
        </div>
        <PasswordInput
          placeholder="Enter new password"
          value={formData.password}
          onChange={(e) => {
            setFormData((prev) => ({ ...prev, password: e.target.value }));
            if (errors.password) {
              setErrors((prev) => ({ ...prev, password: undefined }));
            }
            if (errors.confirmPassword && formData.confirmPassword) {
              const confirmError = validateConfirmPassword(formData.confirmPassword, e.target.value);
              setErrors((prev) => ({ ...prev, confirmPassword: confirmError || undefined }));
            }
          }}
          onBlur={handlePasswordBlur}
          error={errors.password}
          disabled={isLoading || !token}
        />
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Must be at least 8 characters with uppercase, lowercase, and number
        </p>

        <PasswordInput
          label="Confirm Password"
          placeholder="Confirm new password"
          value={formData.confirmPassword}
          onChange={(e) => {
            setFormData((prev) => ({ ...prev, confirmPassword: e.target.value }));
            if (errors.confirmPassword) {
              setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
            }
          }}
          onBlur={handleConfirmPasswordBlur}
          error={errors.confirmPassword}
          disabled={isLoading || !token}
        />

        <Button
          type="submit"
          className="w-full"
          isLoading={isLoading}
          disabled={!token}
        >
          Reset Password
        </Button>
      </form>
    </AuthLayout>
  );
};
