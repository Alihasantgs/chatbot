# ChatBot AI - Modern React Chatbot Application

A modern, fully-featured chatbot application built with React, Vite, TypeScript, and Tailwind CSS. Features a beautiful UI, authentication system, and professional code architecture.

## Features

- 🔐 **Authentication System**
  - Login
  - Signup
  - Forgot Password
  - Protected Routes

- 💬 **Chat Features**
  - Real-time messaging
  - Image upload support
  - Modern chat interface
  - Message history

- 🎨 **Modern UI**
  - Beautiful gradient designs
  - Responsive layout
  - Smooth animations
  - Dark theme

- 🏗️ **Professional Architecture**
  - Clean code structure
  - Context API for state management
  - Custom hooks
  - Separated API layer
  - TypeScript for type safety

## Tech Stack

- **React 19** - UI library
- **Vite** - Build tool
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **React Router** - Routing
- **Axios** - HTTP client
- **React Icons** - Icons

## Project Structure

```
src/
├── api/              # API layer
│   ├── client.ts     # Axios client configuration
│   ├── auth.api.ts   # Authentication API calls
│   └── chat.api.ts   # Chat API calls
├── components/       # React components
│   ├── ui/           # Reusable UI components
│   ├── chat/         # Chat-specific components
│   └── layout/       # Layout components
├── contexts/         # React contexts
│   ├── AuthContext.tsx
│   └── ChatContext.tsx
├── hooks/            # Custom hooks
│   ├── useAuth.ts
│   └── useChat.ts
├── pages/            # Page components
│   ├── Login.tsx
│   ├── Signup.tsx
│   ├── ForgotPassword.tsx
│   ├── Chat.tsx
│   └── Home.tsx
├── types/            # TypeScript types
│   └── index.ts
└── utils/            # Utility functions
    ├── constants.ts
    └── storage.ts
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory:
```env
VITE_API_BASE_URL=http://localhost:3000/api
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Environment Variables

Create a `.env` file with the following variables:

- `VITE_API_BASE_URL` - Your backend API base URL (default: `http://localhost:3000/api`)

## API Integration

The application expects the following API endpoints:

### Authentication
- `POST /auth/login` - User login
- `POST /auth/signup` - User registration
- `POST /auth/forgot-password` - Request password reset
- `POST /auth/reset-password` - Reset password
- `POST /auth/logout` - User logout

### Chat
- `POST /chat/message` - Send a message
- `GET /chat/chats` - Get all chats
- `GET /chat/:chatId` - Get a specific chat
- `POST /chat/create` - Create a new chat
- `DELETE /chat/:chatId` - Delete a chat

## Code Quality

- ✅ TypeScript for type safety
- ✅ Clean component architecture
- ✅ Separated concerns (API, Context, Hooks, Components)
- ✅ Reusable UI components
- ✅ Proper error handling
- ✅ Loading states
- ✅ Responsive design

## Build for Production

```bash
npm run build
```

The build output will be in the `dist` directory.

## License

MIT
