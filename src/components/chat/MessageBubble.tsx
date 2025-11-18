import { useState, useEffect, useRef } from 'react';
import type { Message } from '../../types';
import { FiUser, FiMessageCircle, FiCopy, FiPlay, FiPause, FiVolume2 } from 'react-icons/fi';

interface MessageBubbleProps {
  message: Message;
}


export const MessageBubble = ({ message }: MessageBubbleProps) => {
  const isUser = message.role === 'user';
  const [copied, setCopied] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [audioDuration, setAudioDuration] = useState(0);
  const [audioCurrentTime, setAudioCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // Cleanup audio on unmount or message change
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      setIsAudioPlaying(false);
      setAudioCurrentTime(0);
      setAudioDuration(0);
    };
  }, [message.id]);

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
          
          {/* Voice Message Player - Only show for user voice messages */}
          {isUser && message.voiceUrl && (
            <div className="mb-2">
              <audio
                ref={audioRef}
                src={message.voiceUrl}
                onLoadedMetadata={() => {
                  if (audioRef.current) {
                    setAudioDuration(audioRef.current.duration);
                  }
                }}
                onTimeUpdate={() => {
                  if (audioRef.current) {
                    setAudioCurrentTime(audioRef.current.currentTime);
                  }
                }}
                onEnded={() => {
                  setIsAudioPlaying(false);
                  setAudioCurrentTime(0);
                }}
                onPlay={() => setIsAudioPlaying(true)}
                onPause={() => setIsAudioPlaying(false)}
              />
              <div className="flex items-center gap-3 p-2 bg-white/10 dark:bg-black/20 rounded-lg">
                <button
                  type="button"
                  onClick={() => {
                    if (audioRef.current) {
                      if (isAudioPlaying) {
                        audioRef.current.pause();
                      } else {
                        audioRef.current.play();
                      }
                    }
                  }}
                  className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary-500 dark:bg-primary-600 hover:bg-primary-600 dark:hover:bg-primary-700 text-white flex items-center justify-center transition-colors"
                  aria-label={isAudioPlaying ? 'Pause audio' : 'Play audio'}
                >
                  {isAudioPlaying ? (
                    <FiPause className="w-4 h-4 sm:w-5 sm:h-5" />
                  ) : (
                    <FiPlay className="w-4 h-4 sm:w-5 sm:h-5 ml-0.5" />
                  )}
                </button>
                <div className="flex-1 min-w-0">
                  <div className="w-full bg-white/20 dark:bg-black/30 rounded-full h-1.5 sm:h-2 mb-1">
                    <div
                      className="bg-white dark:bg-primary-400 h-full rounded-full transition-all"
                      style={{
                        width: audioDuration > 0 ? `${(audioCurrentTime / audioDuration) * 100}%` : '0%'
                      }}
                    />
                  </div>
                  <div className="text-xs text-white/80 dark:text-gray-300">
                    {Math.floor(audioCurrentTime)}s / {Math.floor(audioDuration)}s
                  </div>
                </div>
                <FiVolume2 className="w-4 h-4 sm:w-5 sm:h-5 text-white/80 dark:text-gray-300 flex-shrink-0" />
              </div>
            </div>
          )}
          
          {/* Response Audio Player - For assistant response audio (only show this, not voiceUrl) */}
          {!isUser && message.responseAudioUrl && (
            <div className="mb-2">
              <audio
                ref={audioRef}
                src={message.responseAudioUrl}
                onLoadedMetadata={() => {
                  if (audioRef.current) {
                    setAudioDuration(audioRef.current.duration);
                  }
                }}
                onTimeUpdate={() => {
                  if (audioRef.current) {
                    setAudioCurrentTime(audioRef.current.currentTime);
                  }
                }}
                onEnded={() => {
                  setIsAudioPlaying(false);
                  setAudioCurrentTime(0);
                }}
                onPlay={() => setIsAudioPlaying(true)}
                onPause={() => setIsAudioPlaying(false)}
              />
              <div className="flex items-center gap-3 p-2 bg-white/10 dark:bg-black/20 rounded-lg">
                <button
                  type="button"
                  onClick={() => {
                    if (audioRef.current) {
                      if (isAudioPlaying) {
                        audioRef.current.pause();
                      } else {
                        audioRef.current.play();
                      }
                    }
                  }}
                  className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary-500 dark:bg-primary-600 hover:bg-primary-600 dark:hover:bg-primary-700 text-white flex items-center justify-center transition-colors"
                  aria-label={isAudioPlaying ? 'Pause audio' : 'Play audio'}
                >
                  {isAudioPlaying ? (
                    <FiPause className="w-4 h-4 sm:w-5 sm:h-5" />
                  ) : (
                    <FiPlay className="w-4 h-4 sm:w-5 sm:h-5 ml-0.5" />
                  )}
                </button>
                <div className="flex-1 min-w-0">
                  <div className="w-full bg-white/20 dark:bg-black/30 rounded-full h-1.5 sm:h-2 mb-1">
                    <div
                      className="bg-white dark:bg-primary-400 h-full rounded-full transition-all"
                      style={{
                        width: audioDuration > 0 ? `${(audioCurrentTime / audioDuration) * 100}%` : '0%'
                      }}
                    />
                  </div>
                  <div className="text-xs text-white/80 dark:text-gray-300">
                    {Math.floor(audioCurrentTime)}s / {Math.floor(audioDuration)}s
                  </div>
                </div>
                <FiVolume2 className="w-4 h-4 sm:w-5 sm:h-5 text-white/80 dark:text-gray-300 flex-shrink-0" />
              </div>
            </div>
          )}
          
          {message.content && (
            <p className="whitespace-pre-wrap break-words text-sm sm:text-base leading-relaxed">{message.content}</p>
          )}
        </div>
        <div className={`flex items-center gap-2 mt-1 sm:mt-1.5 ${isUser ? 'flex-row-reverse' : ''}`}>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {new Date(message.timestamp).toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </span>
          {!isUser && message.responseAudioUrl && (
            <button
              type="button"
              onClick={() => {
                if (audioRef.current) {
                  if (isAudioPlaying) {
                    audioRef.current.pause();
                  } else {
                    audioRef.current.play();
                  }
                }
              }}
              className="p-1.5 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-lg transition-colors cursor-pointer text-gray-500 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400"
              title={isAudioPlaying ? 'Stop audio' : 'Play audio'}
              aria-label={isAudioPlaying ? 'Stop audio' : 'Play audio'}
            >
              {isAudioPlaying ? (
                <FiPause className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              ) : (
                <FiPlay className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              )}
            </button>
          )}
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
