'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

export function useLeadsQuery(filters?: { chatbotId?: string; status?: string; search?: string; limit?: number; offset?: number }) {
  return useQuery({
    queryKey: ['leads', filters],
    queryFn: () => api.get<any>('/leads', filters as any),
  });
}
