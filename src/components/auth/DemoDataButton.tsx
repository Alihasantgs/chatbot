interface DemoDataButtonProps {
  onClick: () => void;
  className?: string;
}

export const DemoDataButton = ({ onClick, className = '' }: DemoDataButtonProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`text-xs text-primary-500 dark:text-primary-400 hover:text-primary-600 dark:hover:text-primary-300 transition-colors cursor-pointer ${className}`}
    >
      Fill Demo Data
    </button>
  );
};

