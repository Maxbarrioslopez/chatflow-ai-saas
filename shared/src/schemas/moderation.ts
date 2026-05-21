import { z } from 'zod';

const ruleTypes = ['FORBIDDEN_WORD', 'FORBIDDEN_PHRASE', 'REGEX_PATTERN', 'SENSITIVE_DATA', 'PROMPT_INJECTION', 'CUSTOM'] as const;
const actions = ['BLOCK_MESSAGE', 'WARN_USER', 'HUMAN_HANDOFF', 'MASK_CONTENT', 'LOG_ONLY'] as const;
const severities = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] as const;
const matchModes = ['EXACT', 'CONTAINS', 'REGEX', 'STARTS_WITH', 'ENDS_WITH'] as const;

export const createModerationRuleSchema = z.object({
  type: z.enum(ruleTypes),
  value: z.string().min(1, 'Value is required').max(500, 'Value too long'),
  action: z.enum(actions),
  severity: z.enum(severities).default('MEDIUM'),
  enabled: z.boolean().default(true),
  matchMode: z.enum(matchModes).default('CONTAINS'),
  caseSensitive: z.boolean().default(false),
  notes: z.string().max(500).optional(),
});

export const updateModerationRuleSchema = createModerationRuleSchema.partial();

export const bulkCreateModerationRulesSchema = z.object({
  rules: z.array(z.object({
    type: z.enum(ruleTypes),
    value: z.string().min(1).max(500),
    action: z.enum(actions),
    severity: z.enum(severities).default('MEDIUM'),
    matchMode: z.enum(matchModes).default('CONTAINS'),
    caseSensitive: z.boolean().default(false),
  })).min(1).max(100),
});

export const testModerationSchema = z.object({
  text: z.string().min(1).max(10000),
  chatbotId: z.string().optional(),
});
