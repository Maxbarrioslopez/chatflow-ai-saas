export interface Lead {
  id: string;
  chatbotId: string;
  conversationId?: string;
  name?: string;
  email?: string;
  phone?: string;
  source: LeadSource;
  status: LeadStatus;
  score: number;
  tags: string[];
  customFields: Record<string, unknown>;
  metadata: Record<string, unknown>;
  firstMessageAt?: string;
  lastMessageAt?: string;
  convertedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export enum LeadSource {
  CHATBOT = 'chatbot',
  WIDGET = 'widget',
  API = 'api',
  MANUAL = 'manual',
  IMPORT = 'import',
  INTEGRATION = 'integration',
}

export enum LeadStatus {
  NEW = 'new',
  QUALIFIED = 'qualified',
  CONTACTED = 'contacted',
  CONVERTED = 'converted',
  LOST = 'lost',
  SPAM = 'spam',
}

export interface LeadMetrics {
  total: number;
  new: number;
  qualified: number;
  converted: number;
  conversionRate: number;
  bySource: Record<string, number>;
  byChatbot: Record<string, number>;
}
