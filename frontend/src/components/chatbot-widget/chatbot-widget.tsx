'use client';

import { useState, useEffect, useRef } from 'react';
import { Bot, Send, X, MessageSquare, Loader2, ThumbsUp, ThumbsDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface WidgetConfig {
  id: string;
  name: string;
  appearance: {
    primaryColor?: string;
    welcomeMessage?: string;
    inputPlaceholder?: string;
    position?: string;
    theme?: string;
    headerStyle?: string;
    secondaryColor?: string;
    showBranding?: boolean;
  } | null;
  behavior: {
    initialMessage?: string;
    suggestedMessages?: string[];
    showTypingIndicator?: boolean;
    enableFeedback?: boolean;
    collectLeadInfo?: boolean;
  } | null;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface ChatbotWidgetProps {
  token: string;
  apiUrl?: string;
}

export function ChatbotWidget({ token, apiUrl = 'http://localhost:4000/api' }: ChatbotWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [config, setConfig] = useState<WidgetConfig | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [visitorId] = useState(() => `visitor_${Math.random().toString(36).substring(2, 11)}`);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch(`${apiUrl}/chat/widget/${token}`)
      .then((res) => res.json())
      .then((data) => {
        setConfig(data);
        setMessages([{
          id: 'welcome',
          role: 'assistant',
          content: data.behavior?.initialMessage || data.appearance?.welcomeMessage || 'Hello! How can I help?',
        }]);
      })
      .catch(console.error);
  }, [token, apiUrl]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: `msg_${Date.now()}`,
      role: 'user',
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch(`${apiUrl}/chat/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chatbotId: config?.id,
          message: input,
          conversationId,
          visitorId,
        }),
      });

      const data = await response.json();

      if (!conversationId) {
        setConversationId(data.conversationId);
      }

      setMessages((prev) => [...prev, {
        id: `msg_${Date.now()}_ai`,
        role: 'assistant',
        content: data.message.content,
      }]);
    } catch {
      setMessages((prev) => [...prev, {
        id: `msg_${Date.now()}_error`,
        role: 'assistant',
        content: "I'm sorry, I'm having trouble connecting. Please try again.",
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!config) return null;

  const primaryColor = config.appearance?.primaryColor || '#6366f1';
  const suggestedMessages = config.behavior?.suggestedMessages || [];

  const shouldShowSuggestions = messages.length === 1 && messages[0].role === 'assistant';

  return (
    <div className={cn('fixed z-[9999] bottom-4', config.appearance?.position === 'left' ? 'left-4' : 'right-4')}>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="mb-3 w-[360px] rounded-2xl shadow-2xl overflow-hidden border"
            style={{
              background: config.appearance?.theme === 'dark' ? '#1a1a2e' : 'white',
              borderColor: config.appearance?.theme === 'dark' ? '#333' : '#e5e7eb',
            }}
          >
            <div
              className="flex items-center justify-between p-4 text-white"
              style={{
                background: config.appearance?.headerStyle === 'gradient'
                  ? `linear-gradient(135deg, ${primaryColor}, ${config.appearance?.secondaryColor || '#8b5cf6'})`
                  : primaryColor,
              }}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20">
                  <Bot className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold text-sm">{config.name}</p>
                  <p className="text-xs opacity-80">Online</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="opacity-70 hover:opacity-100">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div
              className="h-[320px] overflow-y-auto p-4 space-y-3"
              style={{ background: config.appearance?.theme === 'dark' ? '#111' : '#f8f9fa' }}
            >
              {messages.map((msg) => (
                <div key={msg.id} className={cn('flex', msg.role === 'user' ? 'justify-end' : 'justify-start')}>
                  <div
                    className={cn(
                      'max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed',
                      msg.role === 'user'
                        ? 'text-white'
                        : config.appearance?.theme === 'dark'
                          ? 'bg-gray-800 text-gray-100'
                          : 'bg-white text-gray-900 shadow-sm border border-gray-100',
                    )}
                    style={msg.role === 'user' ? { backgroundColor: primaryColor } : {}}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white dark:bg-gray-800 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm border border-gray-100">
                    <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
                  </div>
                </div>
              )}

              {shouldShowSuggestions && suggestedMessages.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {suggestedMessages.map((msg) => (
                    <button
                      key={msg}
                      onClick={() => {
                        setMessages((prev) => [...prev, { id: `quick_${Date.now()}`, role: 'user', content: msg }]);
                        setInput(msg);
                        setTimeout(() => handleSend(), 100);
                      }}
                      className="text-xs px-3 py-1.5 rounded-full border border-gray-200 hover:border-primary/50 hover:text-primary transition-colors"
                      style={{ borderColor: `${primaryColor}30` }}
                    >
                      {msg}
                    </button>
                  ))}
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            <div className="border-t p-3" style={{ background: config.appearance?.theme === 'dark' ? '#111' : 'white' }}>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder={config.appearance?.inputPlaceholder || 'Type a message...'}
                  className="flex-1 bg-transparent border-0 outline-none text-sm placeholder:text-gray-400"
                  disabled={isLoading}
                />
                <button
                  onClick={handleSend}
                  disabled={isLoading || !input.trim()}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-white disabled:opacity-50 transition-opacity"
                  style={{ backgroundColor: primaryColor }}
                >
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </button>
              </div>
              {config.appearance?.showBranding !== false && (
                <p className="text-[10px] text-gray-400 text-center mt-2">
                  Powered by ChatFlow
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-14 w-14 items-center justify-center rounded-full shadow-xl hover:scale-105 active:scale-95 transition-all"
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
}
