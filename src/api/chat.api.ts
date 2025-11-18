import { axiosInstance } from './axios.instance';
import type { ChatResponse, ChatMessage } from '../types';

/**
 * Chat API Service
 * Handles all chat-related API calls
 */
export const chatApi = {
  /**
   * Send a text message to the chatbot
   */
  sendMessage: async (content: string): Promise<ChatResponse> => {
    const { data } = await axiosInstance.post<ChatResponse>(
      '/chat/message',
      new URLSearchParams({ message: content }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    return data;
  },

  /**
   * Send a voice/audio message to the chatbot
   */
  sendVoiceMessage: async (voiceFile: File): Promise<ChatResponse> => {
    const formData = new FormData();
    formData.append('voice', voiceFile);

    const { data } = await axiosInstance.post<ChatResponse>(
      '/chat/voice',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return data;
  },

  /**
   * Upload an image with a text message
   */
  uploadImage: async (message: string, imageFile: File): Promise<ChatResponse> => {
    const formData = new FormData();
    formData.append('message', message);
    formData.append('image', imageFile);

    const { data } = await axiosInstance.post<ChatResponse>(
      '/chat/upload-image',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return data;
  },

  /**
   * Get user's chat history
   */
  getChatHistory: async (skip = 0, limit = 50): Promise<ChatMessage[]> => {
    const { data } = await axiosInstance.get<ChatMessage[]>('/chat/history', {
      params: { skip, limit },
    });

    return data;
  },

  /**
   * Get specific chat by ID
   */
  getChatById: async (chatId: string): Promise<ChatMessage> => {
    const { data } = await axiosInstance.get<ChatMessage>(`/chat/history/${chatId}`);
    return data;
  },

  /**
   * Delete all chat history for current user
   */
  deleteAllChats: async (): Promise<string> => {
    const { data } = await axiosInstance.delete<string>('/chat/history');
    return data;
  },

  /**
   * Delete specific chat by ID
   */
  deleteChat: async (chatId: string): Promise<string> => {
    const { data } = await axiosInstance.delete<string>(`/chat/history/${chatId}`);
    return data;
  },
};
