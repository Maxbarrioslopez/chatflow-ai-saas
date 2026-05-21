import { api } from '@/lib/api';

export interface KnowledgeSource {
  id: string;
  organizationId: string;
  chatbotId: string;
  type: 'document' | 'website' | 'text' | 'faq' | 'qapairs';
  name: string;
  mimeType?: string;
  originalName?: string;
  fileSize?: number;
  status: 'pending' | 'processing' | 'ready' | 'failed' | 'needs_ocr';
  errorMessage?: string;
  chunkCount?: number;
  content?: string;
  metadata?: any;
  createdAt: string;
  updatedAt: string;
}

export interface KnowledgeStats {
  total: number;
  byStatus: Record<string, number>;
  totalChunks: number;
}

export interface SearchResult {
  id: string;
  content: string;
  chunkIndex: number;
  score: number;
  sourceName: string;
}

export async function listSources(chatbotId: string): Promise<KnowledgeSource[]> {
  const res = await api.get<{ sources: KnowledgeSource[] }>(`/knowledge/${chatbotId}/sources`);
  return res.sources;
}

export async function uploadDocument(chatbotId: string, file: File): Promise<{ source: KnowledgeSource; status: string }> {
  const formData = new FormData();
  formData.append('file', file);

  const token = getAuthToken();
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/knowledge/${chatbotId}/documents`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({ error: { message: 'Upload failed' } }));
    throw new Error(err.error?.message || err.message || `Upload failed (${response.status})`);
  }

  return response.json();
}

export async function addTextSource(chatbotId: string, name: string, content: string) {
  return api.post<{ source: KnowledgeSource; status: string }>(`/knowledge/${chatbotId}/text`, { name, content });
}

export async function deleteSource(chatbotId: string, sourceId: string) {
  return api.delete(`/knowledge/${chatbotId}/sources/${sourceId}`);
}

export async function reprocessSource(chatbotId: string, sourceId: string) {
  return api.post(`/knowledge/${chatbotId}/sources/${sourceId}/reprocess`);
}

export async function searchKnowledge(chatbotId: string, query: string): Promise<SearchResult[]> {
  const res = await api.post<{ results: SearchResult[] }>(`/knowledge/${chatbotId}/search`, { query });
  return res.results;
}

export async function getStats(chatbotId: string): Promise<KnowledgeStats> {
  const res = await api.get<{ stats: KnowledgeStats }>(`/knowledge/${chatbotId}/stats`);
  return res.stats;
}

function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    const stored = localStorage.getItem('chatmbl-auth');
    if (!stored) return null;
    const parsed = JSON.parse(stored);
    return parsed?.state?.tokens?.accessToken || null;
  } catch {
    return null;
  }
}
