import { create } from 'zustand';
import { api } from '@/lib/api';

interface AnalyticsState {
  metrics: any | null;
  conversationsData: any;
  leadsData: any;
  satisfactionData: any;
  isLoading: boolean;
  period: string;
  fetchDashboard: (period?: string) => Promise<void>;
  setPeriod: (period: string) => void;
}

export const useAnalyticsStore = create<AnalyticsState>()((set) => ({
  metrics: null,
  conversationsData: null,
  leadsData: null,
  satisfactionData: null,
  isLoading: false,
  period: '7d',

  fetchDashboard: async (period?: string) => {
    const p = period || set((state) => state.period);
    set({ isLoading: true });
    try {
      const [metrics, conversations, leads, satisfaction] = await Promise.all([
        api.get('/analytics/dashboard', { period: p }),
        api.get('/analytics/conversations'),
        api.get('/analytics/leads'),
        api.get('/analytics/satisfaction'),
      ]);
      set({ metrics, conversationsData: conversations, leadsData: leads, satisfactionData: satisfaction, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  setPeriod: (period) => set({ period }),
}));
