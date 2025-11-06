import { FiSun, FiMoon, FiMonitor } from 'react-icons/fi';
import { useTheme } from '../../contexts/ThemeContext';
import { Button } from './Button';

export const ThemeToggle = () => {
  const { theme, effectiveTheme, toggleTheme } = useTheme();

  const getIcon = () => {
    if (theme === 'system') {
      return <FiMonitor className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-gray-300" />;
    }
    if (effectiveTheme === 'dark') {
      return <FiSun className="w-4 h-4 sm:w-5 sm:h-5 text-gray-300" />;
    }
    return <FiMoon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />;
  };

  const getTitle = () => {
    if (theme === 'system') {
      return 'System theme (click to change)';
    }
    if (effectiveTheme === 'dark') {
      return 'Dark mode (click to change)';
    }
    return 'Light mode (click to change)';
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleTheme}
      className="p-2 cursor-pointer"
      title={getTitle()}
      aria-label={getTitle()}
    >
      {getIcon()}
    </Button>
  );
};
