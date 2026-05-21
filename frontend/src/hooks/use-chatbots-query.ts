'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';

export function useChatbotsQuery() {
  return useQuery({
    queryKey: ['chatbots'],
    queryFn: () => api.get<any[]>('/chatbots'),
  });
}

export function useChatbotQuery(id: string) {
  return useQuery({
    queryKey: ['chatbot', id],
    queryFn: () => api.get<any>(`/chatbots/${id}`),
    enabled: !!id,
  });
}

export function useCreateChatbot() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.post('/chatbots', data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['chatbots'] }),
  });
}

export function useDeleteChatbot() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/chatbots/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['chatbots'] }),
  });
}
