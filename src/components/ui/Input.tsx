import type { InputHTMLAttributes } from 'react';
import { forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className = '', ...props }, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {label}
        </label>
      )}
      <input
        ref={ref}
        autoComplete="off"
        className={`
          w-full px-2.5 sm:px-3 py-1.5 sm:py-2 
          bg-white dark:bg-dark-800 
          border border-gray-300 dark:border-dark-600 
          rounded-lg
          text-gray-900 dark:text-white 
          placeholder-gray-400 dark:placeholder-gray-500 
          text-sm sm:text-base
          focus:outline-none focus:ring-2 focus:ring-offset-0
          transition-all duration-200
          disabled:opacity-50 disabled:cursor-not-allowed
          autofill:bg-white autofill:dark:bg-dark-800
          ${error ? 'border-red-500 dark:border-red-500 focus:ring-red-500 focus:border-red-500' : 'focus:ring-primary-500 focus:border-primary-500'}
          ${className}
        `.trim()}
        style={{
          WebkitBoxShadow: error ? '0 0 0 2px rgba(239, 68, 68, 0.2)' : 'none',
          boxShadow: error ? '0 0 0 2px rgba(239, 68, 68, 0.2)' : 'none',
        }}
        {...props}
      />
      {error && (
        <p className="mt-1 text-xs text-red-500 dark:text-red-400 font-medium">{error}</p>
      )}
      {helperText && !error && (
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{helperText}</p>
      )}
    </div>
  );
  }
);

Input.displayName = 'Input';
