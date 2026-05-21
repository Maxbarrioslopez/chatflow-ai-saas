'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Send, X, MessageSquare, Loader2, Sparkles, ChevronDown, Globe, Maximize2, Minimize2, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

type WidgetMode = 'floating' | 'inline' | 'fullscreen' | 'standalone';

interface WidgetTheme {
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  borderRadius: 'none' | 'sm' | 'md' | 'lg' | 'full';
  position: 'left' | 'right';
  theme: 'light' | 'dark' | 'auto';
  headerStyle: 'default' | 'minimal' | 'gradient' | 'glass';
  bubbleStyle: 'rounded' | 'square' | 'pill';
  animation: 'none' | 'subtle' | 'smooth' | 'bouncy';
  showBranding: boolean;
  welcomeMessage: string;
  inputPlaceholder: string;
  glassEffect: boolean;
  darkMode: boolean;
  headerGradient?: string;
}

interface WidgetConfig {
  id: string;
  name: string;
  appearance: Partial<WidgetTheme>;
  behavior: {
    initialMessage?: string;
    suggestedMessages?: string[];
    showTypingIndicator?: boolean;
    enableFeedback?: boolean;
    collectLeadInfo?: boolean;
  };
}

interface PremiumWidgetProps {
  config: WidgetConfig;
  mode?: WidgetMode;
  onClose?: () => void;
  apiUrl?: string;
}

const defaultTheme: WidgetTheme = {
  primaryColor: '#6366f1',
  secondaryColor: '#8b5cf6',
  fontFamily: 'Inter',
  borderRadius: 'md',
  position: 'right',
  theme: 'light',
  headerStyle: 'gradient',
  bubbleStyle: 'rounded',
  animation: 'smooth',
  showBranding: true,
  welcomeMessage: 'Hello! How can I help you today?',
  inputPlaceholder: 'Type your message...',
  glassEffect: true,
  darkMode: false,
};

function getBorderRadius(value: string): string {
  const map: Record<string, string> = { none: '0', sm: '8px', md: '16px', lg: '24px', full: '9999px' };
  return map[value] || '16px';
}

export function PremiumWidget({
  config,
  mode = 'floating',
  onClose,
  apiUrl = 'http://localhost:4000/api',
}: PremiumWidgetProps) {
  const theme = { ...defaultTheme, ...config.appearance };
  const [isOpen, setIsOpen] = useState(mode !== 'inline');
  const [messages, setMessages] = useState<Array<{ id: string; role: string; content: string }>>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (config.behavior?.initialMessage || theme.welcomeMessage) {
      setMessages([{
        id: 'welcome',
        role: 'assistant',
        content: config.behavior?.initialMessage || theme.welcomeMessage,
      }]);
    }
  }, [config.behavior?.initialMessage, theme.welcomeMessage]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = useCallback(async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = { id: `msg_${Date.now()}`, role: 'user', content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${apiUrl}/chat/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chatbotId: config.id,
          message: input,
          visitorId: localStorage.getItem('widget_visitor') || undefined,
          conversationId: localStorage.getItem('widget_conversation') || undefined,
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error?.message || `Request failed (${response.status})`);
      }

      const data = await response.json();

      if (data.conversationId) {
        localStorage.setItem('widget_conversation', data.conversationId);
      }

      setMessages((prev) => [...prev, {
        id: data.message?.id || `msg_${Date.now()}_ai`,
        role: 'assistant',
        content: data.message?.content || 'No response generated.',
      }]);
    } catch (err) {
      setError((err as Error).message);
      setMessages((prev) => [...prev, {
        id: `msg_${Date.now()}_error`,
        role: 'assistant',
        content: "I'm sorry, I'm having trouble connecting. Please try again later.",
      }]);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, config.id, apiUrl]);

  const widgetContent = (
    <motion.div
      layout
      className={cn(
        'overflow-hidden flex flex-col',
        isFullscreen
          ? 'fixed inset-4 z-[99999] rounded-2xl shadow-2xl'
          : 'w-[380px] rounded-2xl shadow-2xl',
      )}
      style={{
        fontFamily: theme.fontFamily,
        borderRadius: getBorderRadius(theme.borderRadius),
        background: theme.darkMode ? '#0f0f1a' : '#ffffff',
        borderColor: theme.darkMode ? '#1e1e3a' : '#e5e7eb',
        boxShadow: theme.glassEffect
          ? '0 25px 50px -12px rgba(0,0,0,0.25), 0 0 0 1px rgba(255,255,255,0.1)'
          : undefined,
      }}
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 10 }}
    >
      {/* Header */}
      <div
        className={cn(
          'flex items-center justify-between p-4 text-white shrink-0',
          theme.headerStyle === 'minimal' && 'bg-transparent border-b',
          theme.headerStyle === 'glass' && 'backdrop-blur-xl',
        )}
        style={
          theme.headerStyle === 'gradient'
            ? { background: `linear-gradient(135deg, ${theme.primaryColor}, ${theme.secondaryColor})` }
            : theme.headerStyle !== 'minimal'
              ? { background: theme.primaryColor }
              : { background: theme.darkMode ? '#1a1a2e' : '#f8f9fa', color: theme.darkMode ? '#fff' : '#000' }
        }
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
            <Bot className="h-5 w-5" />
          </div>
          <div>
            <p className="font-semibold text-sm">{config.name}</p>
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse-soft" />
              <span className="text-xs opacity-80">Online</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
          >
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </button>
          {mode !== 'inline' && (
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/10 transition-colors">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div
        className={cn(
          'flex-1 overflow-y-auto p-4 space-y-3',
          isFullscreen ? 'h-[calc(100vh-180px)]' : 'h-[350px]',
        )}
        style={{ background: theme.darkMode ? '#0a0a14' : '#f8f9fa' }}
      >
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn('flex', msg.role === 'user' ? 'justify-end' : 'justify-start')}
          >
            <div
              className={cn(
                'max-w-[85%] px-4 py-3 text-sm leading-relaxed',
                msg.role === 'user'
                  ? 'text-white shadow-lg'
                  : theme.darkMode
                    ? 'bg-[#1a1a2e] text-gray-100 border border-[#2a2a4e]'
                    : 'bg-white text-gray-900 border border-gray-100 shadow-sm',
              )}
              style={{
                borderRadius: theme.bubbleStyle === 'pill' ? '9999px' : theme.bubbleStyle === 'square' ? '4px' : '16px',
                borderBottomRightRadius: msg.role === 'user' ? (theme.bubbleStyle === 'pill' ? '9999px' : '4px') : undefined,
                borderBottomLeftRadius: msg.role === 'assistant' ? (theme.bubbleStyle === 'pill' ? '9999px' : '4px') : undefined,
                background: msg.role === 'user' ? theme.primaryColor : undefined,
              }}
            >
              <div className="prose prose-sm max-w-none dark:prose-invert">
                {msg.content}
              </div>
            </div>
          </motion.div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white dark:bg-[#1a1a2e] rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm border border-gray-100 dark:border-[#2a2a4e]">
              <div className="flex items-center gap-1.5">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="h-2 w-2 rounded-full bg-primary/40"
                />
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }}
                  className="h-2 w-2 rounded-full bg-primary/60"
                />
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 1.5, delay: 0.4 }}
                  className="h-2 w-2 rounded-full bg-primary"
                />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t p-4 shrink-0" style={{ borderColor: theme.darkMode ? '#1e1e3a' : '#e5e7eb' }}>
        <div
          className={cn(
            'flex items-center gap-2 rounded-2xl border px-4 py-2 transition-all duration-200 focus-within:ring-2',
            theme.darkMode ? 'bg-[#1a1a2e] border-[#2a2a4e]' : 'bg-gray-50 border-gray-200',
          )}
          style={{ borderRadius: getBorderRadius(theme.borderRadius), focusWithin: { ringColor: theme.primaryColor } }}
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={theme.inputPlaceholder}
            className="flex-1 bg-transparent border-0 outline-none text-sm placeholder:text-gray-400"
            style={{ color: theme.darkMode ? '#fff' : '#000' }}
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-white transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
            style={{ background: theme.primaryColor }}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </button>
        </div>
        {theme.showBranding && (
          <p className="text-[10px] text-center mt-2 opacity-40" style={{ color: theme.darkMode ? '#fff' : '#000' }}>
            Powered by <span className="font-semibold" style={{ color: theme.primaryColor }}>ChatMBL</span>
          </p>
        )}
      </div>
    </motion.div>
  );

  if (mode === 'inline') {
    return <div className="w-full">{widgetContent}</div>;
  }

  if (mode === 'fullscreen') {
    return (
      <div className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-2xl h-[80vh]"
        >
          {widgetContent}
        </motion.div>
      </div>
    );
  }

  if (mode === 'standalone') {
    return (
      <div className="fixed inset-0 z-[9999] bg-white dark:bg-[#0a0a14] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: theme.darkMode ? '#1e1e3a' : '#e5e7eb' }}>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full" style={{ background: theme.primaryColor }}>
              <Bot className="h-5 w-5 text-white" />
            </div>
            <p className="font-semibold">{config.name}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-muted transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="flex-1 overflow-hidden">
          <div className="h-full max-w-3xl mx-auto p-4">
            {widgetContent}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('fixed bottom-4 z-[9999]', theme.position === 'left' ? 'left-4' : 'right-4')}>
      <AnimatePresence>
        {isOpen && widgetContent}
      </AnimatePresence>

      {!isOpen && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(true)}
          className="flex h-14 w-14 items-center justify-center rounded-full shadow-xl hover:shadow-2xl transition-shadow"
          style={{ background: `linear-gradient(135deg, ${theme.primaryColor}, ${theme.secondaryColor})` }}
        >
          <MessageSquare className="h-6 w-6 text-white" />
        </motion.button>
      )}
    </div>
  );
}
