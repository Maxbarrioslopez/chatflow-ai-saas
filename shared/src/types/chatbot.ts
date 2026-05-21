import { BusinessPresetId } from '../constants';

export interface ChatbotConfig {
  id: string;
  name: string;
  description?: string;
  businessPreset: BusinessPresetId;
  organizationId: string;
  isActive: boolean;
  appearance: ChatbotAppearance;
  behavior: ChatbotBehavior;
  knowledge: ChatbotKnowledge;
  aiConfig: AIConfig;
  whitelabel?: WhitelabelConfig;
  createdAt: string;
  updatedAt: string;
}

export interface ChatbotAppearance {
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  position: 'left' | 'right';
  borderRadius: 'none' | 'sm' | 'md' | 'lg' | 'full';
  showBranding: boolean;
  avatarUrl?: string;
  avatarStyle: 'default' | 'custom' | 'emoji' | 'none';
  welcomeMessage: string;
  inputPlaceholder: string;
  theme: 'light' | 'dark' | 'auto';
  headerStyle: 'default' | 'minimal' | 'gradient' | 'glass';
  bubbleStyle: 'rounded' | 'square' | 'pill';
  animation: 'none' | 'subtle' | 'smooth' | 'bouncy';
  customCss?: string;
}

export interface ChatbotBehavior {
  initialMessage: string;
  suggestedMessages: string[];
  maxMessagesPerSession: number;
  inactivityTimeout: number;
  showTypingIndicator: boolean;
  enableFeedback: boolean;
  enableFileUpload: boolean;
  enableVoiceInput: boolean;
  enableEmojiPicker: boolean;
  collectLeadInfo: boolean;
  leadFormFields: LeadFormField[];
  fallbackMessage: string;
  triggerRules: TriggerRule[];
  operatingHours?: OperatingHours;
}

export interface LeadFormField {
  key: string;
  label: string;
  type: 'text' | 'email' | 'phone' | 'select' | 'textarea';
  required: boolean;
  options?: string[];
}

export interface TriggerRule {
  id: string;
  type: 'time' | 'scroll' | 'exit' | 'page' | 'custom';
  config: Record<string, unknown>;
  delay: number;
}

export interface OperatingHours {
  enabled: boolean;
  timezone: string;
  schedule: {
    day: number;
    start: string;
    end: string;
  }[];
  messageOutsideHours: string;
}

export interface ChatbotKnowledge {
  sources: KnowledgeSource[];
  maxContextTokens: number;
  temperature: number;
  systemPrompt: string;
}

export interface KnowledgeSource {
  id: string;
  type: 'document' | 'website' | 'text' | 'faq' | 'qapairs';
  name: string;
  content?: string;
  url?: string;
  status: 'processing' | 'ready' | 'error';
  error?: string;
}

export interface AIConfig {
  provider: 'openai' | 'anthropic' | 'azure' | 'custom';
  model: string;
  temperature: number;
  maxTokens: number;
  topP: number;
  frequencyPenalty: number;
  presencePenalty: number;
  customEndpoint?: string;
  customApiKey?: string;
}

export interface WhitelabelConfig {
  enabled: boolean;
  domain?: string;
  customCss?: string;
  removeBranding: boolean;
  customDomain?: string;
}

export interface ChatbotSummary {
  id: string;
  name: string;
  isActive: boolean;
  totalConversations: number;
  totalLeads: number;
  satisfactionRate: number;
  lastActivity: string;
  preset: string;
}
