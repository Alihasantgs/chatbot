export interface User {
  id: string;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  created_at: string;
  avatar?: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface RegisterResponse {
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  id: string;
  created_at: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  password: string;
  confirmPassword: string;
}

export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  token: string;
  new_password: string;
  confirmPassword: string;
}

export interface ChatMessage {
  id: string;
  user_id: string;
  message: string;
  response: string;
  message_type: string;
  image_url?: string;
  voice_url?: string;
  response_audio_url?: string;
  created_at: string;
}

export interface ChatResponse {
  current_chat: ChatMessage;
  chat_history: ChatMessage[];
  total_chats: number;
}

export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  imageUrl?: string;
  voiceUrl?: string;
  responseAudioUrl?: string;
}

export interface Chat {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

