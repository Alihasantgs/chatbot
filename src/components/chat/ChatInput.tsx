import { useState, useRef, useEffect } from 'react';
import type { FormEvent } from 'react';
import { FiSend, FiImage, FiX, FiMic } from 'react-icons/fi';
import { Button } from '../ui/Button';
import { useChat } from '../../hooks/useChat';
import { extractErrorMessage } from '../../utils/errorHandler';

// Speech Recognition types
interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  onstart: ((this: SpeechRecognition, ev: Event) => void) | null;
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => void) | null;
  onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => void) | null;
  onend: ((this: SpeechRecognition, ev: Event) => void) | null;
}

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
  isFinal: boolean;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

declare var SpeechRecognition: {
  prototype: SpeechRecognition;
  new (): SpeechRecognition;
};

// Extend Window interface for SpeechRecognition
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}

export const ChatInput = () => {
  const { sendMessage, uploadImage, isSending } = useChat();
  const [message, setMessage] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState<string>('');
  const [isListening, setIsListening] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      // Only allow 1 image at a time
      if (files.length > 1) {
        setError('Only 1 image can be uploaded at a time');
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        return;
      }
      
      const file = files[0];
      if (file.type.startsWith('image/')) {
        if (file.size > 10 * 1024 * 1024) {
          setError('Image size must be less than 10MB');
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
          return;
        }
        setImageFile(file);
        setError('');
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setError('Please select an image file');
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      // Browser doesn't support speech recognition
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
      setError('');
    };

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0].transcript)
        .join('');
      setMessage((prev) => (prev ? `${prev} ${transcript}` : transcript));
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      if (event.error === 'no-speech') {
        setError('No speech detected. Please try again.');
      } else if (event.error === 'not-allowed') {
        setError('Microphone permission denied. Please enable microphone access.');
      } else {
        setError('Speech recognition error. Please try again.');
      }
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const toggleVoiceRecognition = () => {
    if (!recognitionRef.current) {
      setError('Speech recognition is not supported in your browser.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
      } catch (error) {
        console.error('Error starting speech recognition:', error);
        setError('Failed to start voice recognition. Please try again.');
      }
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (isSending) return;
    
    // Stop voice recognition if active
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
    
    if (imageFile) {
      // Upload image with message
      try {
        await uploadImage(message.trim() || 'Analyze this image', imageFile);
        setMessage('');
        setImageFile(null);
        setImagePreview(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        // Reset textarea height
        if (textareaRef.current) {
          textareaRef.current.style.height = 'auto';
        }
      } catch (err: unknown) {
        setError(extractErrorMessage(err as Parameters<typeof extractErrorMessage>[0], 'Failed to upload image. Please try again.'));
      }
    } else if (message.trim()) {
      // Send text message
      try {
        await sendMessage(message.trim());
        setMessage('');
        // Reset textarea height
        if (textareaRef.current) {
          textareaRef.current.style.height = 'auto';
        }
      } catch (err: unknown) {
        setError(extractErrorMessage(err as Parameters<typeof extractErrorMessage>[0], 'Failed to send message. Please try again.'));
      }
    }
  };

  // Auto-resize textarea
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    setError('');
    // Auto-resize
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 128)}px`;
  };

  return (
    <div className="border-t border-gray-200 dark:border-dark-700 bg-white dark:bg-dark-900 flex-shrink-0">
      {error && (
        <div className="px-3 sm:px-4 pt-2 sm:pt-3">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-3 py-2 rounded-lg text-xs sm:text-sm">
            {error}
          </div>
        </div>
      )}
      
      {imagePreview && (
        <div className="px-3 sm:px-4 pt-2 sm:pt-3">
          <div className="relative inline-block">
            <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-lg overflow-hidden border-2 border-primary-500 dark:border-primary-400 shadow-md">
              <img 
                src={imagePreview} 
                alt="Preview" 
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 transition-colors cursor-pointer shadow-lg"
                aria-label="Remove image"
              >
                <FiX className="w-3 h-3 sm:w-4 sm:h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="p-3 sm:p-4">
        <div className="flex gap-2 sm:gap-3 items-end">
          <div className="flex-1 relative min-w-0">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={handleTextareaChange}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              placeholder="Type your message..."
              rows={1}
              disabled={isSending}
              className="
                w-full px-3 sm:px-4 py-2.5 sm:py-3 pr-20 sm:pr-24 
                bg-white dark:bg-dark-800 
                border border-gray-300 dark:border-dark-600 
                rounded-lg
                text-gray-900 dark:text-white 
                placeholder-gray-400 dark:placeholder-gray-500 
                resize-none text-sm sm:text-base leading-relaxed
                focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-0 focus:border-primary-500
                transition-all duration-200
                max-h-32 overflow-y-auto scrollbar-thin
                cursor-text
                disabled:opacity-50 disabled:cursor-not-allowed
                shadow-sm
              "
              style={{ minHeight: '44px', maxHeight: '128px' }}
            />
            {!imageFile && !imagePreview && (
              <div className="absolute right-2 bottom-2.5 sm:bottom-3 flex gap-1">
                <button
                  type="button"
                  onClick={toggleVoiceRecognition}
                  disabled={isSending}
                  className={`p-1.5 sm:p-2 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed rounded ${
                    isListening
                      ? 'text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-900/20 animate-pulse'
                      : 'text-gray-400 dark:text-gray-500 hover:text-primary-500 dark:hover:text-primary-400'
                  }`}
                  aria-label={isListening ? 'Stop listening' : 'Start voice input'}
                  title={isListening ? 'Stop listening' : 'Start voice input'}
                >
                  <FiMic className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isSending}
                  className="p-1.5 sm:p-2 text-gray-400 dark:text-gray-500 hover:text-primary-500 dark:hover:text-primary-400 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Upload image"
                  title="Upload image"
                >
                  <FiImage className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
              disabled={isSending}
              multiple={false}
            />
          </div>
          
          <Button
            type="submit"
            disabled={(!message.trim() && !imageFile) || isSending}
            isLoading={isSending}
            className="px-3 sm:px-4 py-2.5 sm:py-3 h-[44px] sm:h-[48px] flex-shrink-0 flex items-center justify-center min-w-[44px] sm:min-w-[52px]"
            size="md"
            aria-label="Send message"
          >
            {!isSending && <FiSend className="w-4 h-4 sm:w-5 sm:h-5" />}
          </Button>
        </div>
      </form>
    </div>
  );
};
