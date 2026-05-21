'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

export function useConversationsQuery(filters?: { chatbotId?: string; status?: string; limit?: number; offset?: number }) {
  return useQuery({
    queryKey: ['conversations', filters],
    queryFn: () => api.get<any>('/conversations', filters as any),
  });
}
