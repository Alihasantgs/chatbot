import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../utils/constants';
import { ThemeToggle } from '../ui/ThemeToggle';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  footerText?: string;
  footerLink?: string;
  footerLinkText?: string;
}

export const AuthLayout = ({
  children,
  title,
  subtitle,
  footerText,
  footerLink,
  footerLinkText,
}: AuthLayoutProps) => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-dark-900 dark:via-dark-800 dark:to-dark-900 flex items-center justify-center p-2 sm:p-3 md:p-4 overflow-hidden">
      <div className="w-full max-w-md relative h-full flex flex-col items-center justify-center py-2 sm:py-4">
        <div className="absolute top-0 right-0 z-10">
          <ThemeToggle />
        </div>
        
        <div className="text-center mb-2 sm:mb-3 flex-shrink-0">
          <Link to={ROUTES.HOME} className="inline-block">
            <h1 className="text-base sm:text-lg md:text-xl font-bold bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">
              ChatBot AI
            </h1>
          </Link>
        </div>
        
        <div className="bg-white dark:bg-dark-800 rounded-lg sm:rounded-xl shadow-2xl p-3 sm:p-4 md:p-5 border border-gray-200 dark:border-dark-700 w-full flex-shrink-0">
          <div className="mb-3 sm:mb-4 flex-shrink-0">
            <h2 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-1">{title}</h2>
            {subtitle && (
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">{subtitle}</p>
            )}
          </div>
          
          <div className="w-full">
            {children}
          </div>
          
          {(footerText || footerLink) && (
            <div className="mt-3 sm:mt-4 text-center text-xs sm:text-sm text-gray-600 dark:text-gray-400 flex-shrink-0">
              {footerText && <span>{footerText} </span>}
              {footerLink && footerLinkText && (
                <Link 
                  to={footerLink} 
                  className="text-primary-500 dark:text-primary-400 hover:text-primary-600 dark:hover:text-primary-300 font-medium transition-colors"
                >
                  {footerLinkText}
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
