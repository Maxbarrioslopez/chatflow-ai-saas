'use client';

import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';

interface Conversation {
  id: string;
  chatbotId: string;
  visitorName: string | null;
  visitorEmail: string | null;
  status: string;
  messageCount: number;
  lead: { id: string; name: string | null; email: string | null } | null;
  rating: number | null;
  createdAt: string;
  updatedAt: string;
}

interface ConversationsResponse {
  conversations: Conversation[];
  total: number;
}

export function useConversations(filters?: { chatbotId?: string; status?: string }) {
  const [data, setData] = useState<ConversationsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetch = useCallback(async () => {
    try {
      setIsLoading(true);
      const result = await api.get<ConversationsResponse>('/conversations', filters as any);
      setData(result);
    } catch {
      // silent
    } finally {
      setIsLoading(false);
    }
  }, [filters?.chatbotId, filters?.status]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { ...data, isLoading, refetch: fetch };
}
