export type ModerationRuleType = 'FORBIDDEN_WORD' | 'FORBIDDEN_PHRASE' | 'REGEX_PATTERN' | 'SENSITIVE_DATA' | 'PROMPT_INJECTION' | 'CUSTOM';

export type ModerationAction = 'BLOCK_MESSAGE' | 'WARN_USER' | 'HUMAN_HANDOFF' | 'MASK_CONTENT' | 'LOG_ONLY';

export type ModerationSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type ModerationMatchMode = 'EXACT' | 'CONTAINS' | 'REGEX' | 'STARTS_WITH' | 'ENDS_WITH';

export interface ModerationRule {
  id: string;
  organizationId: string;
  chatbotId?: string;
  type: ModerationRuleType;
  value: string;
  action: ModerationAction;
  severity: ModerationSeverity;
  enabled: boolean;
  matchMode: ModerationMatchMode;
  caseSensitive: boolean;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ModerationEvent {
  id: string;
  organizationId: string;
  chatbotId?: string;
  conversationId?: string;
  messageId?: string;
  ruleId?: string;
  type: ModerationRuleType;
  action: ModerationAction;
  severity: ModerationSeverity;
  matchedValue?: string;
  maskedPreview?: string;
  createdAt: string;
}

export interface CreateModerationRuleInput {
  type: ModerationRuleType;
  value: string;
  action: ModerationAction;
  severity?: ModerationSeverity;
  enabled?: boolean;
  matchMode?: ModerationMatchMode;
  caseSensitive?: boolean;
  notes?: string;
}

export interface TestModerationInput {
  text: string;
  chatbotId?: string;
}

export interface TestModerationResult {
  blocked: boolean;
  matchedRules: Array<{
    ruleId: string;
    type: ModerationRuleType;
    action: ModerationAction;
    severity: ModerationSeverity;
    matchedValue: string;
    maskedPreview?: string;
  }>;
  sanitizedText?: string;
}
