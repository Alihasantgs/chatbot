/**
 * Validation utilities for form inputs
 */

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const USERNAME_REGEX = /^[a-zA-Z0-9_]+$/;
const NAME_REGEX = /^[a-zA-Z\s]+$/;

export const validateEmail = (email: string): string | undefined => {
  const trimmed = email.trim();
  if (!trimmed) {
    return 'Email is required';
  }
  if (!EMAIL_REGEX.test(trimmed)) {
    return 'Please enter a valid email address';
  }
  return undefined;
};

export const validateUsername = (username: string): string | undefined => {
  const trimmed = username.trim();
  if (!trimmed) {
    return 'Username is required';
  }
  if (trimmed.length < 3) {
    return 'Username must be at least 3 characters';
  }
  if (trimmed.length > 50) {
    return 'Username must be less than 50 characters';
  }
  if (!USERNAME_REGEX.test(trimmed)) {
    return 'Username can only contain letters, numbers, and underscores';
  }
  if (trimmed.startsWith('_') || trimmed.endsWith('_')) {
    return 'Username cannot start or end with underscore';
  }
  if (trimmed.includes('__')) {
    return 'Username cannot contain consecutive underscores';
  }
  return undefined;
};

export const validateName = (name: string, fieldName: string): string | undefined => {
  const trimmed = name.trim();
  if (!trimmed) {
    return `${fieldName} is required`;
  }
  if (trimmed.length < 2) {
    return `${fieldName} must be at least 2 characters`;
  }
  if (trimmed.length > 50) {
    return `${fieldName} must be less than 50 characters`;
  }
  if (!NAME_REGEX.test(trimmed)) {
    return `${fieldName} can only contain letters and spaces`;
  }
  return undefined;
};

export const validatePassword = (password: string): string | undefined => {
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

export const validatePasswordSimple = (password: string): string | undefined => {
  if (!password) {
    return 'Password is required';
  }
  if (password.length < 6) {
    return 'Password must be at least 6 characters';
  }
  return undefined;
};

export const validatePasswordReset = (password: string): string | undefined => {
  if (!password) {
    return 'Password is required';
  }
  if (password.length < 8) {
    return 'Password must be at least 8 characters';
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
  return undefined;
};

export const validateConfirmPassword = (
  confirmPassword: string,
  password: string
): string | undefined => {
  if (!confirmPassword) {
    return 'Please confirm your password';
  }
  if (password !== confirmPassword) {
    return 'Passwords do not match';
  }
  return undefined;
};

