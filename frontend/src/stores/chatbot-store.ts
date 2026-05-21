import { create } from 'zustand';
import { api } from '@/lib/api';

interface ChatbotState {
  chatbots: any[];
  currentChatbot: any | null;
  isLoading: boolean;
  error: string | null;
  fetchChatbots: () => Promise<void>;
  fetchChatbot: (id: string) => Promise<void>;
  createChatbot: (data: any) => Promise<any>;
  updateChatbot: (id: string, data: any) => Promise<void>;
  deleteChatbot: (id: string) => Promise<void>;
  setCurrentChatbot: (chatbot: any | null) => void;
}

export const useChatbotStore = create<ChatbotState>()((set, get) => ({
  chatbots: [],
  currentChatbot: null,
  isLoading: false,
  error: null,

  fetchChatbots: async () => {
    set({ isLoading: true, error: null });
    try {
      const chatbots = await api.get<any[]>('/chatbots');
      set({ chatbots, isLoading: false });
    } catch (err) {
      set({ error: (err as Error).message, isLoading: false });
    }
  },

  fetchChatbot: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const chatbot = await api.get<any>(`/chatbots/${id}`);
      set({ currentChatbot: chatbot, isLoading: false });
    } catch (err) {
      set({ error: (err as Error).message, isLoading: false });
    }
  },

  createChatbot: async (data: any) => {
    const result = await api.post<any>('/chatbots', data);
    await get().fetchChatbots();
    return result;
  },

  updateChatbot: async (id: string, data: any) => {
    await api.put(`/chatbots/${id}`, data);
    await get().fetchChatbots();
  },

  deleteChatbot: async (id: string) => {
    await api.delete(`/chatbots/${id}`);
    set((state) => ({
      chatbots: state.chatbots.filter((b: any) => b.id !== id),
    }));
  },

  setCurrentChatbot: (chatbot) => set({ currentChatbot: chatbot }),
}));
