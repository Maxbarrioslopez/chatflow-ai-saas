'use client';

import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';

interface DashboardMetrics {
  totalConversations: number;
  activeConversations: number;
  totalLeads: number;
  newLeads: number;
  conversionRate: number;
  satisfactionRate: number;
  avgResponseTime: number;
  totalMessages: number;
}

export function useDashboardMetrics(period = '7d') {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetch = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await api.get<DashboardMetrics>('/analytics/dashboard', { period });
      setMetrics(data);
    } catch {
      // silent
    } finally {
      setIsLoading(false);
    }
  }, [period]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { metrics, isLoading, refetch: fetch };
}
