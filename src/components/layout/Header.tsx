import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../ui/Button';
import { FiLogOut } from 'react-icons/fi';
import { ROUTES } from '../../utils/constants';

interface HeaderProps {
  onNewChat?: () => void;
  showNewChat?: boolean;
}

export const Header = ({ onNewChat: _onNewChat, showNewChat: _showNewChat = false }: HeaderProps) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate(ROUTES.LOGIN);
  };

  return (
    <header className="bg-gray-50 dark:bg-dark-800 border-b border-gray-200 dark:border-dark-700 px-3 sm:px-4 py-2.5 sm:py-3 flex items-center justify-between flex-shrink-0">
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        {/* {showNewChat && onNewChat && (
          <button
            type="button"
            onClick={onNewChat}
            className="p-1.5 sm:p-2 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-lg transition-colors flex-shrink-0 cursor-pointer"
            title="New Chat"
            aria-label="New Chat"
          >
            <FiPlus className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-gray-300" />
          </button>
        )} */}
        <h1 className="text-base sm:text-xl font-bold bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent truncate">
          ChatBot AI
        </h1>
      </div>
      
      <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
        {user && (
          <div className="hidden md:flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary-600 flex items-center justify-center text-white font-medium text-xs sm:text-sm">
              {user?.first_name?.charAt(0).toUpperCase() || user?.username?.charAt(0).toUpperCase() || 'U'}
            </div>
            <span className="hidden lg:inline">{user?.first_name || user?.username || 'User'}</span>
          </div>
        )}
        {user && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="flex items-center gap-1 sm:gap-2 p-1.5 sm:p-2 cursor-pointer"
            aria-label="Logout"
          >
            <FiLogOut className="w-4 h-4" />
            <span className="hidden sm:inline text-xs sm:text-sm">Logout</span>
          </Button>
        )}
      </div>
    </header>
  );
};

