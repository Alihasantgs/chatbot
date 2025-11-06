interface ErrorAlertProps {
  message: string;
  className?: string;
}

export const ErrorAlert = ({ message, className = '' }: ErrorAlertProps) => {
  if (!message) return null;

  return (
    <div className={`bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg text-sm font-medium ${className}`}>
      {message}
    </div>
  );
};

