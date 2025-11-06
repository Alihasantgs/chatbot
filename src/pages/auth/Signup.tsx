import { useState } from 'react';
import type { FormEvent, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { AuthLayout } from '../../components/layout/AuthLayout';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { PasswordInput } from '../../components/auth/PasswordInput';
import { ErrorAlert } from '../../components/auth/ErrorAlert';
import { ROUTES } from '../../utils/constants';
import {
  validateEmail,
  validateUsername,
  validateName,
  validatePassword,
  validateConfirmPassword,
} from '../../utils/validation';
import { normalizeEmail, normalizeUsername } from '../../utils/normalize';
import { extractErrorMessage } from '../../utils/errorHandler';

interface FormData {
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  email?: string;
  username?: string;
  first_name?: string;
  last_name?: string;
  password?: string;
  confirmPassword?: string;
}

export const Signup = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState<FormData>({
    email: '',
    username: '',
    first_name: '',
    last_name: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (field: keyof FormData) => (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }

    let fieldError: string | undefined;

    switch (field) {
      case 'email':
        fieldError = validateEmail(value);
        break;
      case 'username':
        fieldError = validateUsername(value);
        break;
      case 'first_name':
        fieldError = validateName(value, 'First name');
        break;
      case 'last_name':
        fieldError = validateName(value, 'Last name');
        break;
      case 'password':
        fieldError = validatePassword(value);
        if (formData.confirmPassword) {
          const confirmError = validateConfirmPassword(formData.confirmPassword, value);
          setErrors((prev) => ({
            ...prev,
            password: fieldError,
            confirmPassword: confirmError || undefined,
          }));
          return;
        }
        break;
      case 'confirmPassword':
        fieldError = validateConfirmPassword(value, formData.password);
        break;
    }

    if (fieldError) {
      setErrors((prev) => ({ ...prev, [field]: fieldError }));
    } else {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleBlur = (field: keyof FormData) => () => {
    let fieldError: string | undefined;

    switch (field) {
      case 'email': {
        const normalized = normalizeEmail(formData.email);
        if (normalized !== formData.email) {
          setFormData((prev) => ({ ...prev, email: normalized }));
        }
        fieldError = validateEmail(normalized);
        break;
      }
      case 'username': {
        const trimmed = normalizeUsername(formData.username);
        if (trimmed !== formData.username) {
          setFormData((prev) => ({ ...prev, username: trimmed }));
        }
        fieldError = validateUsername(trimmed);
        break;
      }
      case 'first_name':
        fieldError = validateName(formData.first_name, 'First name');
        break;
      case 'last_name':
        fieldError = validateName(formData.last_name, 'Last name');
        break;
      case 'password':
        fieldError = validatePassword(formData.password);
        break;
      case 'confirmPassword':
        fieldError = validateConfirmPassword(formData.confirmPassword, formData.password);
        break;
    }

    if (fieldError) {
      setErrors((prev) => ({ ...prev, [field]: fieldError }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    const normalizedEmail = normalizeEmail(formData.email);
    const normalizedUsername = normalizeUsername(formData.username);
    const normalizedFormData = {
      ...formData,
      email: normalizedEmail,
      username: normalizedUsername,
    };
    setFormData(normalizedFormData);

    const emailError = validateEmail(normalizedEmail);
    const usernameError = validateUsername(normalizedUsername);
    const firstNameError = validateName(formData.first_name, 'First name');
    const lastNameError = validateName(formData.last_name, 'Last name');
    const passwordError = validatePassword(formData.password);
    const confirmPasswordError = validateConfirmPassword(
      formData.confirmPassword,
      formData.password
    );

    if (
      emailError ||
      usernameError ||
      firstNameError ||
      lastNameError ||
      passwordError ||
      confirmPasswordError
    ) {
      setErrors({
        email: emailError,
        username: usernameError,
        first_name: firstNameError,
        last_name: lastNameError,
        password: passwordError,
        confirmPassword: confirmPasswordError,
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await register(normalizedFormData);
      navigate(ROUTES.LOGIN);
    } catch (err: any) {
      setError(extractErrorMessage(err, 'Registration failed. Please try again.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Create Account"
      subtitle="Sign up to get started with ChatBot AI"
      footerText="Already have an account?"
      footerLink={ROUTES.LOGIN}
      footerLinkText="Sign in"
    >
      <form onSubmit={handleSubmit} className="space-y-2.5 sm:space-y-3">
        <ErrorAlert message={error} />

        <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
          Email
        </label>
        <Input
          type="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleChange('email')}
          onBlur={handleBlur('email')}
          error={errors.email}
          disabled={isSubmitting}
          autoComplete="email"
        />

        <Input
          type="text"
          label="Username"
          placeholder="Choose a username (3-50 characters)"
          value={formData.username}
          onChange={handleChange('username')}
          onBlur={handleBlur('username')}
          error={errors.username}
          disabled={isSubmitting}
          autoComplete="username"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
          <Input
            type="text"
            label="First Name"
            placeholder="First name"
            value={formData.first_name}
            onChange={handleChange('first_name')}
            onBlur={handleBlur('first_name')}
            error={errors.first_name}
            disabled={isSubmitting}
            autoComplete="given-name"
          />

          <Input
            type="text"
            label="Last Name"
            placeholder="Last name"
            value={formData.last_name}
            onChange={handleChange('last_name')}
            onBlur={handleBlur('last_name')}
            error={errors.last_name}
            disabled={isSubmitting}
            autoComplete="family-name"
          />
        </div>

        <PasswordInput
          label="Password"
          placeholder="Create a password"
          value={formData.password}
          onChange={handleChange('password')}
          onBlur={handleBlur('password')}
          error={errors.password}
          disabled={isSubmitting}
        />
        <p className="text-xs text-gray-500 dark:text-gray-400 -mt-1.5 mb-0.5">
          Min 8 chars: uppercase, lowercase, number, special char
        </p>

        <PasswordInput
          label="Confirm Password"
          placeholder="Confirm your password"
          value={formData.confirmPassword}
          onChange={handleChange('confirmPassword')}
          onBlur={handleBlur('confirmPassword')}
          error={errors.confirmPassword}
          disabled={isSubmitting}
        />

        <Button type="submit" className="w-full mt-1 sm:mt-2" isLoading={isSubmitting}>
          Create Account
        </Button>
      </form>
    </AuthLayout>
  );
};
