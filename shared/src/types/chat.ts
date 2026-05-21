export interface Message {
  id: string;
  conversationId: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  metadata?: MessageMetadata;
  createdAt: string;
}

export interface MessageMetadata {
  intent?: string;
  sentiment?: 'positive' | 'neutral' | 'negative';
  confidence?: number;
  tokens?: number;
  processingTime?: number;
  sourceReferences?: SourceReference[];
}

export interface SourceReference {
  sourceId: string;
  sourceName: string;
  excerpt: string;
  relevance: number;
}

export interface Conversation {
  id: string;
  chatbotId: string;
  visitorId: string;
  visitorName?: string;
  visitorEmail?: string;
  status: ConversationStatus;
  leadId?: string;
  rating?: number;
  feedback?: string;
  tags: string[];
  metadata: Record<string, unknown>;
  messages: Message[];
  messageCount: number;
  createdAt: string;
  updatedAt: string;
  closedAt?: string;
}

export enum ConversationStatus {
  ACTIVE = 'active',
  WAITING = 'waiting',
  RESOLVED = 'resolved',
  CLOSED = 'closed',
  SPAM = 'spam',
}

export interface ConversationSummary {
  id: string;
  chatbotId: string;
  chatbotName: string;
  visitorName?: string;
  status: ConversationStatus;
  lastMessage: string;
  lastMessageAt: string;
  messageCount: number;
  leadCaptured: boolean;
}

export interface ChatSession {
  id: string;
  chatbotId: string;
  messages: Message[];
  visitorId: string;
  createdAt: string;
}
