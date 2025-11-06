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

export const Signup = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    first_name: '',
    last_name: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<{
    email?: string;
    username?: string;
    first_name?: string;
    last_name?: string;
    password?: string;
    confirmPassword?: string;
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const validateEmail = (email: string): string | undefined => {
    if (!email.trim()) {
      return 'Email is required';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return 'Please enter a valid email address';
    }
    return undefined;
  };

  const validateUsername = (username: string): string | undefined => {
    if (!username.trim()) {
      return 'Username is required';
    }
    if (username.trim().length < 3) {
      return 'Username must be at least 3 characters';
    }
    if (username.trim().length > 50) {
      return 'Username must be less than 50 characters';
    }
    if (!/^[a-zA-Z0-9_]+$/.test(username.trim())) {
      return 'Username can only contain letters, numbers, and underscores';
    }
    if (username.trim().startsWith('_') || username.trim().endsWith('_')) {
      return 'Username cannot start or end with underscore';
    }
    if (username.trim().includes('__')) {
      return 'Username cannot contain consecutive underscores';
    }
    return undefined;
  };

  const validateName = (name: string, fieldName: string): string | undefined => {
    if (!name.trim()) {
      return `${fieldName} is required`;
    }
    if (name.trim().length < 2) {
      return `${fieldName} must be at least 2 characters`;
    }
    if (name.trim().length > 50) {
      return `${fieldName} must be less than 50 characters`;
    }
    if (!/^[a-zA-Z\s]+$/.test(name.trim())) {
      return `${fieldName} can only contain letters and spaces`;
    }
    return undefined;
  };

  const validatePassword = (password: string): string | undefined => {
    if (!password) {
      return 'Password is required';
    }
    if (password.length < 8) {
      return 'Password must be at least 8 characters';
    }
    if (password.length > 128) {
      return 'Password must be less than 128 characters';
    }
    if (!/(?=.*[a-z])/.test(password)) {
      return 'Password must contain at least one lowercase letter';
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      return 'Password must contain at least one uppercase letter';
    }
    if (!/(?=.*\d)/.test(password)) {
      return 'Password must contain at least one number';
    }
    if (!/(?=.*[@$!%*?&#^()_+\-=\[\]{};':"\\|,.<>\/])/.test(password)) {
      return 'Password must contain at least one special character';
    }
    return undefined;
  };

  const validateConfirmPassword = (confirmPassword: string, password: string): string | undefined => {
    if (!confirmPassword) {
      return 'Please confirm your password';
    }
    if (password !== confirmPassword) {
      return 'Passwords do not match';
    }
    return undefined;
  };

  // Real-time validation on change
  const handleChange = (field: keyof typeof formData) => (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const newFormData = { ...formData, [field]: value };
    setFormData(newFormData);
    
    // Clear error when user starts typing
    if (errors[field]) {
      const newErrors = { ...errors };
      delete newErrors[field];
      setErrors(newErrors);
    }
    
    // Real-time validation
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
        // Also validate confirm password if it has value
        if (formData.confirmPassword) {
          const confirmError = validateConfirmPassword(formData.confirmPassword, value);
          setErrors(prev => ({
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
    
    // Set error if validation fails
    if (fieldError) {
      setErrors(prev => ({ ...prev, [field]: fieldError }));
    } else {
      const newErrors = { ...errors };
      delete newErrors[field];
      setErrors(newErrors);
    }
  };

  const handleBlur = (field: keyof typeof formData) => () => {
    let fieldError: string | undefined;
    
    switch (field) {
      case 'email':
        fieldError = validateEmail(formData.email);
        break;
      case 'username':
        fieldError = validateUsername(formData.username);
        break;
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
      setErrors(prev => ({ ...prev, [field]: fieldError }));
    }
  };

  const validate = () => {
    const newErrors: {
      email?: string;
      username?: string;
      first_name?: string;
      last_name?: string;
      password?: string;
      confirmPassword?: string;
    } = {};
    
    const emailError = validateEmail(formData.email);
    if (emailError) {
      newErrors.email = emailError;
    }
    
    const usernameError = validateUsername(formData.username);
    if (usernameError) {
      newErrors.username = usernameError;
    }
    
    const firstNameError = validateName(formData.first_name, 'First name');
    if (firstNameError) {
      newErrors.first_name = firstNameError;
    }
    
    const lastNameError = validateName(formData.last_name, 'Last name');
    if (lastNameError) {
      newErrors.last_name = lastNameError;
    }
    
    const passwordError = validatePassword(formData.password);
    if (passwordError) {
      newErrors.password = passwordError;
    }
    
    const confirmPasswordError = validateConfirmPassword(formData.confirmPassword, formData.password);
    if (confirmPasswordError) {
      newErrors.confirmPassword = confirmPasswordError;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!validate()) return;
    
    setIsSubmitting(true);
    try {
      await register(formData);
      // After successful registration, navigate to login page
      navigate(ROUTES.LOGIN);
    } catch (err: any) {
      // Get error message from API response
      const errorDetail = err.response?.data?.detail;
      let errorMessage = 'Registration failed. Please try again.';
      
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
        
        <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
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
        
        <Button
          type="submit"
          className="w-full mt-1 sm:mt-2"
          isLoading={isSubmitting}
        >
          Create Account
        </Button>
      </form>
    </AuthLayout>
  );
};
