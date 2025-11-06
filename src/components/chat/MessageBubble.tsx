import { useState } from 'react';
import type { Message } from '../../types';
import { FiUser, FiMessageCircle, FiCopy } from 'react-icons/fi';

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble = ({ message }: MessageBubbleProps) => {
  const isUser = message.role === 'user';
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className={`flex gap-2 sm:gap-3 mb-4 sm:mb-6 animate-fade-in ${isUser ? 'flex-row-reverse' : ''}`}>
      <div className={`
        flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center
        ${isUser ? 'bg-primary-600' : 'bg-gray-200 dark:bg-dark-700'}
      `}>
        {isUser ? (
          <FiUser className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
        ) : (
          <FiMessageCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-600 dark:text-white" />
        )}
      </div>
      
      <div className={`flex-1 min-w-0 max-w-[85%] sm:max-w-3xl ${isUser ? 'flex flex-col items-end' : ''}`}>
        <div className={`
          rounded-xl sm:rounded-2xl px-3 sm:px-4 py-2 sm:py-3 shadow-lg
          ${isUser 
            ? 'bg-primary-600 text-white rounded-tr-sm' 
            : 'bg-gray-100 dark:bg-dark-800 text-gray-900 dark:text-gray-100 rounded-tl-sm'
          }
        `}>
          {message.imageUrl && (
            <div className="mb-2 rounded-lg overflow-hidden max-w-full">
              <img 
                src={message.imageUrl} 
                alt="Uploaded" 
                className="max-w-full h-auto rounded-lg"
              />
            </div>
          )}
          <p className="whitespace-pre-wrap break-words text-sm sm:text-base leading-relaxed">{message.content}</p>
        </div>
        <div className={`flex items-center gap-2 mt-1 sm:mt-1.5 ${isUser ? 'flex-row-reverse' : ''}`}>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {new Date(message.timestamp).toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </span>
          <button
            type="button"
            onClick={handleCopy}
            className="p-1.5 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-lg transition-colors cursor-pointer text-gray-500 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400"
            title={copied ? 'Copied!' : 'Copy message'}
            aria-label="Copy message"
          >
            <FiCopy className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

