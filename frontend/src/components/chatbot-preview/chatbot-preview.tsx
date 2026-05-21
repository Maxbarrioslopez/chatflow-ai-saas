'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Bot, Send, X, MessageSquare, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ChatbotPreviewProps {
  chatbot: {
    name: string;
    appearance?: any;
    behavior?: any;
  };
  embedded?: boolean;
}

export function ChatbotPreview({ chatbot, embedded }: ChatbotPreviewProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([
    { role: 'assistant', content: chatbot.behavior?.initialMessage || chatbot.appearance?.welcomeMessage || 'Hello! How can I help you today?' },
  ]);
  const [input, setInput] = useState('');

  const appearance = chatbot.appearance || {};
  const primaryColor = appearance.primaryColor || '#6366f1';

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages([...messages, { role: 'user', content: input }]);
    setInput('');
    setTimeout(() => {
      setMessages((prev) => [...prev, {
        role: 'assistant',
        content: "Thanks for your message! I'm a preview bot. Configure my responses in the AI settings tab.",
      }]);
    }, 1000);
  };

  const previewContent = (
    <div className="relative" style={{ fontFamily: appearance.fontFamily || 'Inter' }}>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className={cn(
            'mb-3 w-[350px] rounded-2xl shadow-2xl overflow-hidden border',
            appearance.theme === 'dark' ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200',
          )}
        >
          <div
            className="flex items-center justify-between p-4 text-white"
            style={{
              background: appearance.headerStyle === 'gradient'
                ? `linear-gradient(135deg, ${primaryColor}, ${appearance.secondaryColor || '#8b5cf6'})`
                : appearance.headerStyle === 'glass'
                  ? `${primaryColor}cc`
                  : primaryColor,
              backdropFilter: appearance.headerStyle === 'glass' ? 'blur(12px)' : 'none',
            }}
          >
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-sm">{chatbot.name}</p>
                <p className="text-xs opacity-80">Online</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="opacity-70 hover:opacity-100">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="h-[300px] overflow-y-auto p-4 space-y-3" style={{ background: appearance.theme === 'dark' ? '#111' : '#f8f9fa' }}>
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  'flex',
                  msg.role === 'user' ? 'justify-end' : 'justify-start',
                )}
              >
                <div
                  className={cn(
                    'max-w-[80%] rounded-2xl px-4 py-2.5 text-sm',
                    msg.role === 'user'
                      ? 'text-white'
                      : appearance.theme === 'dark' ? 'bg-gray-800 text-gray-100' : 'bg-gray-200 text-gray-900',
                  )}
                  style={msg.role === 'user' ? { backgroundColor: primaryColor } : {}}
                >
                  {msg.content}
                </div>
              </motion.div>
            ))}
          </div>

          <div className="border-t p-3" style={{ background: appearance.theme === 'dark' ? '#111' : 'white', borderColor: appearance.theme === 'dark' ? '#333' : '#e5e7eb' }}>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder={appearance.inputPlaceholder || 'Type a message...'}
                className="flex-1 bg-transparent border-0 outline-none text-sm placeholder:text-gray-400"
              />
              <button
                onClick={handleSend}
                className="flex h-8 w-8 items-center justify-center rounded-full text-white"
                style={{ backgroundColor: primaryColor }}
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex h-14 w-14 items-center justify-center rounded-full shadow-xl hover:scale-105 transition-transform',
          isOpen ? 'hidden' : 'flex',
        )}
        style={{ backgroundColor: primaryColor }}
      >
        {isOpen ? (
          <X className="h-6 w-6 text-white" />
        ) : (
          <MessageSquare className="h-6 w-6 text-white" />
        )}
      </button>
    </div>
  );

  if (embedded) {
    return (
      <div className="flex items-end justify-end min-h-[300px]">
        {previewContent}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[400px] bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-xl p-6">
      {previewContent}
    </div>
  );
}
