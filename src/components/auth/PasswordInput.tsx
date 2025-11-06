import { useState } from 'react';
import type { InputHTMLAttributes } from 'react';
import { Input } from '../ui/Input';
import { FiEye, FiEyeOff } from 'react-icons/fi';

interface PasswordInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  error?: string;
  showToggle?: boolean;
}

export const PasswordInput = ({ 
  label, 
  error, 
  showToggle = true,
  className = '',
  ...props 
}: PasswordInputProps) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div>
      {label && (
        <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        <Input
          type={showPassword ? 'text' : 'password'}
          error={error}
          className={`pr-10 sm:pr-11 ${className}`}
          autoComplete="new-password"
          {...props}
        />
        {showToggle && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-2.5 sm:right-3 top-1/2 -translate-y-1/2 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors cursor-pointer z-10"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <FiEyeOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <FiEye className="w-4 h-4 sm:w-5 sm:h-5" />}
          </button>
        )}
      </div>
    </div>
  );
};
