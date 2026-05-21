'use client';

import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';

interface ChatbotListItem {
  id: string;
  name: string;
  description: string | null;
  businessPreset: string;
  isActive: boolean;
  totalConversations: number;
  totalLeads: number;
  lastActivity: string;
}

export function useChatbots() {
  const [chatbots, setChatbots] = useState<ChatbotListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchChatbots = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await api.get<ChatbotListItem[]>('/chatbots');
      setChatbots(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch chatbots');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchChatbots();
  }, [fetchChatbots]);

  const createChatbot = async (data: { name: string; description?: string; businessPreset: string }) => {
    const result = await api.post('/chatbots', data);
    await fetchChatbots();
    return result;
  };

  const deleteChatbot = async (id: string) => {
    await api.delete(`/chatbots/${id}`);
    await fetchChatbots();
  };

  const toggleActive = async (id: string, isActive: boolean) => {
    await api.put(`/chatbots/${id}`, { isActive });
    await fetchChatbots();
  };

  return { chatbots, isLoading, error, fetchChatbots, createChatbot, deleteChatbot, toggleActive };
}
