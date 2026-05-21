'use client';

import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';

interface Lead {
  id: string;
  chatbotId: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  source: string;
  status: string;
  score: number;
  tags: string[];
  createdAt: string;
  chatbot: { name: string };
}

interface LeadsResponse {
  leads: Lead[];
  total: number;
}

export function useLeads(filters?: { chatbotId?: string; status?: string; search?: string }) {
  const [data, setData] = useState<LeadsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetch = useCallback(async () => {
    try {
      setIsLoading(true);
      const result = await api.get<LeadsResponse>('/leads', filters as any);
      setData(result);
    } catch {
      // silent
    } finally {
      setIsLoading(false);
    }
  }, [filters?.chatbotId, filters?.status, filters?.search]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { ...data, isLoading, refetch: fetch };
}
