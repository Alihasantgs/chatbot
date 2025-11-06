import { useEffect, useRef } from 'react';
import { useChat } from '../../hooks/useChat';
import { MessageBubble } from '../../components/chat/MessageBubble';
import { ChatInput } from '../../components/chat/ChatInput';
import { Header } from '../../components/layout/Header';

export const Chat = () => {
  const { messages, clearMessages, loadChatHistory } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Load chat history on mount (only once, if messages are empty)
  useEffect(() => {
    if (messages.length === 0) {
      loadChatHistory(0, 50).catch(console.error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array - only run on mount

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleNewChat = () => {
    // Clear all messages and history to start fresh chat
    clearMessages();
  };

  return (
    <div className="h-screen flex flex-col bg-white dark:bg-dark-900 overflow-hidden">
      <Header onNewChat={handleNewChat} showNewChat={true} />

      {/* Messages Container */}
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto px-2 sm:px-4 py-4 sm:py-6 scrollbar-thin"
      >
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center p-4">
            <div className="text-center max-w-2xl w-full">
              <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg">
                <svg
                  className="w-8 h-8 sm:w-10 sm:h-10 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-3">
                Welcome to ChatBot AI
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-lg mb-6 sm:mb-8 px-2">
                Start a conversation by typing a message below. You can send text messages or images.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 text-left">
                <div className="bg-gray-50 dark:bg-dark-800 p-3 sm:p-4 rounded-lg border border-gray-200 dark:border-dark-700">
                  <div className="text-primary-500 dark:text-primary-400 mb-2 font-semibold text-sm sm:text-base">💬 Chat</div>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                    Have natural conversations with AI
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-dark-800 p-3 sm:p-4 rounded-lg border border-gray-200 dark:border-dark-700">
                  <div className="text-primary-500 dark:text-primary-400 mb-2 font-semibold text-sm sm:text-base">🖼️ Images</div>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                    Share images and get AI insights
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-dark-800 p-3 sm:p-4 rounded-lg border border-gray-200 dark:border-dark-700 sm:col-span-2 lg:col-span-1">
                  <div className="text-primary-500 dark:text-primary-400 mb-2 font-semibold text-sm sm:text-base">⚡ Fast</div>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                    Get instant responses to your queries
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto w-full px-2 sm:px-0">
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input */}
      <ChatInput />
    </div>
  );
};

