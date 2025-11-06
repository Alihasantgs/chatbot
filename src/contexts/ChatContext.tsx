import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { Message, ChatMessage, ChatResponse } from '../types';
import { chatApi } from '../api/chat.api';

interface ChatContextType {
  messages: Message[];
  chatHistory: ChatMessage[];
  isLoading: boolean;
  isSending: boolean;
  sendMessage: (content: string) => Promise<void>;
  uploadImage: (message: string, imageFile: File) => Promise<void>;
  loadChatHistory: (skip?: number, limit?: number) => Promise<void>;
  loadChatById: (chatId: string) => Promise<void>;
  deleteAllChats: () => Promise<void>;
  deleteChat: (chatId: string) => Promise<void>;
  clearMessages: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

// Convert API ChatMessage to app Message format
const convertChatMessageToMessage = (chatMessage: ChatMessage, isUser: boolean): Message => ({
  id: chatMessage.id,
  content: isUser ? chatMessage.message : chatMessage.response,
  role: isUser ? 'user' : 'assistant',
  timestamp: new Date(chatMessage.created_at),
  imageUrl: chatMessage.image_url || undefined,
});

// Convert chat_history array to messages array
// Also includes current_chat if provided
const convertChatHistoryToMessages = (chatHistory: ChatMessage[], currentChat?: ChatMessage): Message[] => {
  const messages: Message[] = [];
  
  // Combine chat_history with current_chat if provided
  let allChats = [...chatHistory];
  if (currentChat && !chatHistory.find(chat => chat.id === currentChat.id)) {
    allChats.push(currentChat);
  }
  
  // Sort by created_at to ensure chronological order
  const sortedHistory = allChats.sort((a, b) => 
    new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  );
  
  // Convert each chat to user and assistant messages
  sortedHistory.forEach((chat) => {
    const userMessage = convertChatMessageToMessage(chat, true);
    const assistantMessage = convertChatMessageToMessage(chat, false);
    messages.push(userMessage, assistantMessage);
  });
  
  return messages;
};

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const sendMessage = async (content: string): Promise<void> => {
    if (!content.trim()) return;

    setIsSending(true);
    try {
      const response: ChatResponse = await chatApi.sendMessage(content);
      
      // Convert current_chat to messages (user + assistant)
      const currentUserMessage = convertChatMessageToMessage(response.current_chat, true);
      const currentAssistantMessage = convertChatMessageToMessage(response.current_chat, false);
      
      // Append only current_chat messages to existing messages (don't reload all history)
      setMessages((prevMessages) => {
        // Check if this chat already exists (avoid duplicates)
        const chatExists = prevMessages.some(msg => msg.id === response.current_chat.id);
        if (chatExists) {
          // If exists, replace it with new messages
          return prevMessages
            .filter(msg => msg.id !== response.current_chat.id)
            .concat([currentUserMessage, currentAssistantMessage]);
        }
        // If new, just append
        return [...prevMessages, currentUserMessage, currentAssistantMessage];
      });
      
      // Update chat history (include current_chat if not already there)
      setChatHistory((prevHistory) => {
        const exists = prevHistory.find(chat => chat.id === response.current_chat.id);
        if (exists) {
          // Update existing chat
          return prevHistory.map(chat => 
            chat.id === response.current_chat.id ? response.current_chat : chat
          );
        }
        // Add new chat
        return [...prevHistory, response.current_chat];
      });
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    } finally {
      setIsSending(false);
    }
  };

  const uploadImage = async (message: string, imageFile: File): Promise<void> => {
    if (!message.trim() && !imageFile) return;

    setIsSending(true);
    try {
      const response: ChatResponse = await chatApi.uploadImage(message, imageFile);
      
      // Convert current_chat to messages (user + assistant)
      const currentUserMessage = convertChatMessageToMessage(response.current_chat, true);
      const currentAssistantMessage = convertChatMessageToMessage(response.current_chat, false);
      
      // Append only current_chat messages to existing messages (don't reload all history)
      setMessages((prevMessages) => {
        // Check if this chat already exists (avoid duplicates)
        const chatExists = prevMessages.some(msg => msg.id === response.current_chat.id);
        if (chatExists) {
          // If exists, replace it with new messages
          return prevMessages
            .filter(msg => msg.id !== response.current_chat.id)
            .concat([currentUserMessage, currentAssistantMessage]);
        }
        // If new, just append
        return [...prevMessages, currentUserMessage, currentAssistantMessage];
      });
      
      // Update chat history (include current_chat if not already there)
      setChatHistory((prevHistory) => {
        const exists = prevHistory.find(chat => chat.id === response.current_chat.id);
        if (exists) {
          // Update existing chat
          return prevHistory.map(chat => 
            chat.id === response.current_chat.id ? response.current_chat : chat
          );
        }
        // Add new chat
        return [...prevHistory, response.current_chat];
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    } finally {
      setIsSending(false);
    }
  };

  const loadChatHistory = async (skip = 0, limit = 50): Promise<void> => {
    setIsLoading(true);
    try {
      const history = await chatApi.getChatHistory(skip, limit);
      setChatHistory(history);
      
      // Convert history to messages and display
      const historyMessages = convertChatHistoryToMessages(history);
      setMessages(historyMessages);
    } catch (error) {
      console.error('Error loading chat history:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const loadChatById = async (chatId: string): Promise<void> => {
    setIsLoading(true);
    try {
      const chat = await chatApi.getChatById(chatId);
      const userMessage = convertChatMessageToMessage(chat, true);
      const assistantMessage = convertChatMessageToMessage(chat, false);
      setMessages([userMessage, assistantMessage]);
    } catch (error) {
      console.error('Error loading chat:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteAllChats = async (): Promise<void> => {
    setIsLoading(true);
    try {
      await chatApi.deleteAllChats();
      setMessages([]);
      setChatHistory([]);
    } catch (error) {
      console.error('Error deleting all chats:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteChat = async (chatId: string): Promise<void> => {
    setIsLoading(true);
    try {
      await chatApi.deleteChat(chatId);
      setChatHistory((prev) => prev.filter((chat) => chat.id !== chatId));
      
      // Remove messages related to this chat
      setMessages((prev) => prev.filter((msg) => msg.id !== chatId));
    } catch (error) {
      console.error('Error deleting chat:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const clearMessages = (): void => {
    setMessages([]);
    setChatHistory([]);
  };

  const value: ChatContextType = {
    messages,
    chatHistory,
    isLoading,
    isSending,
    sendMessage,
    uploadImage,
    loadChatHistory,
    loadChatById,
    deleteAllChats,
    deleteChat,
    clearMessages,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export const useChat = (): ChatContextType => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
