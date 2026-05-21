import { prisma } from '../prisma';
import type { ModerationRuleType, ModerationAction, ModerationSeverity, ModerationMatchMode } from '@prisma/client';
import { matchText, detectSensitiveData, detectPromptInjection } from './detector';

export type ModerationCheckResult = {
  blocked: boolean;
  action: ModerationAction | null;
  severity: ModerationSeverity | null;
  matchedRules: Array<{
    ruleId: string;
    type: ModerationRuleType;
    action: ModerationAction;
    severity: ModerationSeverity;
    matchedValue: string;
    maskedPreview?: string;
  }>;
  sanitizedText?: string;
};

export class ModerationService {
  async checkMessage(
    organizationId: string,
    chatbotId: string,
    text: string,
    conversationId?: string,
  ): Promise<ModerationCheckResult> {
    const rules = await prisma.moderationRule.findMany({
      where: {
        organizationId,
        enabled: true,
        OR: [{ chatbotId }, { chatbotId: null }],
      },
      orderBy: [{ severity: 'desc' }, { type: 'asc' }],
    });

    const matchedRules: ModerationCheckResult['matchedRules'] = [];
    let sanitizedText = text;
    let highestAction: ModerationAction | null = null;
    let highestSeverity: ModerationSeverity | null = null;
    const actionPriority: Record<string, number> = {
      BLOCK_MESSAGE: 5, HUMAN_HANDOFF: 4, MASK_CONTENT: 3, WARN_USER: 2, LOG_ONLY: 1,
    };

    for (const rule of rules) {
      let matched = false;
      let maskedValue: string | undefined;

      if (rule.type === 'SENSITIVE_DATA') {
        const sensitive = detectSensitiveData(text);
        if (sensitive.length > 0) {
          matched = true;
          for (const s of sensitive) {
            sanitizedText = sanitizedText.replace(s.value, s.masked);
          }
          maskedValue = sensitive[0].masked;
        }
      } else if (rule.type === 'PROMPT_INJECTION') {
        const injections = detectPromptInjection(text);
        if (injections.length > 0) {
          matched = true;
          maskedValue = injections[0].matched;
        }
      } else {
        matched = matchText(text, rule.value, rule.matchMode, rule.caseSensitive);
        if (matched) {
          maskedValue = rule.value;
        }
      }

      if (matched) {
        matchedRules.push({
          ruleId: rule.id,
          type: rule.type as ModerationRuleType,
          action: rule.action as ModerationAction,
          severity: rule.severity as ModerationSeverity,
          matchedValue: rule.value,
          maskedPreview: maskedValue,
        });

        if (!highestAction || (actionPriority[rule.action] || 0) > (actionPriority[highestAction] || 0)) {
          highestAction = rule.action as ModerationAction;
          highestSeverity = rule.severity as ModerationSeverity;
        }
      }
    }

    const blocked = highestAction === 'BLOCK_MESSAGE';

    if (conversationId && matchedRules.length > 0) {
      await this.logEvents(organizationId, chatbotId, conversationId, matchedRules, text);
    }

    return {
      blocked,
      action: highestAction,
      severity: highestSeverity,
      matchedRules,
      sanitizedText: highestAction === 'MASK_CONTENT' ? sanitizedText : undefined,
    };
  }

  async testText(organizationId: string, text: string, chatbotId?: string): Promise<ModerationCheckResult> {
    return this.checkMessage(organizationId, chatbotId || 'test', text);
  }

  private async logEvents(
    organizationId: string,
    chatbotId: string,
    conversationId: string,
    matchedRules: ModerationCheckResult['matchedRules'],
    originalText: string,
  ) {
    for (const rule of matchedRules) {
      await prisma.moderationEvent.create({
        data: {
          organizationId,
          chatbotId,
          conversationId,
          ruleId: rule.ruleId,
          type: rule.type,
          action: rule.action,
          severity: rule.severity,
          matchedValue: rule.matchedValue.slice(0, 200),
          maskedPreview: rule.maskedPreview?.slice(0, 200),
        },
      }).catch(() => {});
    }
  }

  async getEvents(organizationId: string, chatbotId?: string, limit = 50) {
    return prisma.moderationEvent.findMany({
      where: { organizationId, ...(chatbotId ? { chatbotId } : {}) },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }
}

export const moderationService = new ModerationService();
