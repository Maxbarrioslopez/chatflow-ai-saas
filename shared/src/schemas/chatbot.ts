import { z } from 'zod';
import { BUSINESS_PRESETS } from '../constants';

const presetIds = BUSINESS_PRESETS.map((p) => p.id) as [string, ...string[]];

export const createChatbotSchema = z.object({
  name: z.string().min(2).max(100),
  description: z.string().max(500).optional(),
  businessPreset: z.enum(presetIds),
});

export const updateAppearanceSchema = z.object({
  primaryColor: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional(),
  secondaryColor: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional(),
  fontFamily: z.string().optional(),
  position: z.enum(['left', 'right']).optional(),
  borderRadius: z.enum(['none', 'sm', 'md', 'lg', 'full']).optional(),
  showBranding: z.boolean().optional(),
  theme: z.enum(['light', 'dark', 'auto']).optional(),
  headerStyle: z.enum(['default', 'minimal', 'gradient', 'glass']).optional(),
  bubbleStyle: z.enum(['rounded', 'square', 'pill']).optional(),
  animation: z.enum(['none', 'subtle', 'smooth', 'bouncy']).optional(),
  customCss: z.string().optional(),
});

export const updateBehaviorSchema = z.object({
  initialMessage: z.string().max(500).optional(),
  suggestedMessages: z.array(z.string().max(100)).max(6).optional(),
  maxMessagesPerSession: z.number().int().min(10).max(1000).optional(),
  inactivityTimeout: z.number().int().min(60).max(3600).optional(),
  showTypingIndicator: z.boolean().optional(),
  enableFeedback: z.boolean().optional(),
  enableFileUpload: z.boolean().optional(),
  collectLeadInfo: z.boolean().optional(),
  fallbackMessage: z.string().max(500).optional(),
});

export const updateAIConfigSchema = z.object({
  provider: z.enum(['openai', 'anthropic', 'azure', 'custom']).optional(),
  model: z.string().optional(),
  temperature: z.number().min(0).max(2).optional(),
  maxTokens: z.number().int().min(100).max(32000).optional(),
  topP: z.number().min(0).max(1).optional(),
});

export type CreateChatbotInput = z.infer<typeof createChatbotSchema>;
export type UpdateAppearanceInput = z.infer<typeof updateAppearanceSchema>;
export type UpdateBehaviorInput = z.infer<typeof updateBehaviorSchema>;
