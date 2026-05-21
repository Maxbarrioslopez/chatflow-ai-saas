import { api } from '@/lib/api';
import type { ModerationRule, ModerationEvent } from '@chatmbl/shared';

export async function listRules(chatbotId: string): Promise<ModerationRule[]> {
  const res = await api.get<{ rules: ModerationRule[] }>(`/moderation/${chatbotId}/rules`);
  return res.rules;
}

export async function createRule(chatbotId: string, data: Partial<ModerationRule>) {
  return api.post<{ rule: ModerationRule }>(`/moderation/${chatbotId}/rules`, data);
}

export async function updateRule(chatbotId: string, ruleId: string, data: Partial<ModerationRule>) {
  return api.patch<{ rule: ModerationRule }>(`/moderation/${chatbotId}/rules/${ruleId}`, data);
}

export async function deleteRule(chatbotId: string, ruleId: string) {
  return api.delete(`/moderation/${chatbotId}/rules/${ruleId}`);
}

export async function bulkCreateRules(chatbotId: string, rules: Array<{ type: string; value: string; action: string; severity?: string; matchMode?: string; caseSensitive?: boolean }>) {
  return api.post<{ created: ModerationRule[]; skipped?: { count: number; items: string[] } }>(
    `/moderation/${chatbotId}/rules/bulk`, { rules },
  );
}

export async function testRules(chatbotId: string, text: string) {
  return api.post<{ result: any }>(`/moderation/${chatbotId}/rules/test`, { text });
}

export async function listEvents(chatbotId: string, limit = 50): Promise<ModerationEvent[]> {
  const res = await api.get<{ events: ModerationEvent[] }>(`/moderation/${chatbotId}/events`, { limit });
  return res.events;
}
