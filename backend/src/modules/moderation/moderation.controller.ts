import { Response, NextFunction } from 'express';
import type { AuthRequest } from '../../common/middleware/auth-guard';
import { AppError } from '../../common/errors';
import { prisma } from '../../services/prisma';
import { moderationService } from '../../services/moderation';
import type { ModerationRuleType, ModerationAction, ModerationSeverity, ModerationMatchMode } from '@prisma/client';

export class ModerationController {
  listRules = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { chatbotId } = req.params;
      const rules = await prisma.moderationRule.findMany({
        where: {
          organizationId: req.organizationId!,
          OR: [{ chatbotId }, { chatbotId: null }],
        },
        orderBy: { createdAt: 'desc' },
      });
      res.json({ rules });
    } catch (error) {
      next(error);
    }
  };

  createRule = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { chatbotId } = req.params;
      const data = req.body;

      await this.verifyChatbotAccess(chatbotId, req.organizationId!);

      const rule = await prisma.moderationRule.create({
        data: {
          organizationId: req.organizationId!,
          chatbotId,
          type: data.type as ModerationRuleType,
          value: data.value,
          action: data.action as ModerationAction,
          severity: (data.severity || 'MEDIUM') as ModerationSeverity,
          enabled: data.enabled ?? true,
          matchMode: (data.matchMode || 'CONTAINS') as ModerationMatchMode,
          caseSensitive: data.caseSensitive ?? false,
          notes: data.notes,
        },
      });

      res.status(201).json({ rule });
    } catch (error) {
      next(error);
    }
  };

  updateRule = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { chatbotId, ruleId } = req.params;
      await this.verifyRuleAccess(ruleId, chatbotId, req.organizationId!);

      const rule = await prisma.moderationRule.update({
        where: { id: ruleId },
        data: req.body,
      });

      res.json({ rule });
    } catch (error) {
      next(error);
    }
  };

  deleteRule = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { chatbotId, ruleId } = req.params;
      await this.verifyRuleAccess(ruleId, chatbotId, req.organizationId!);
      await prisma.moderationRule.delete({ where: { id: ruleId } });
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };

  bulkCreate = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { chatbotId } = req.params;
      const { rules } = req.body;

      await this.verifyChatbotAccess(chatbotId, req.organizationId!);

      const existingRules = await prisma.moderationRule.findMany({
        where: { organizationId: req.organizationId!, chatbotId },
      });
      const existingValues = new Set(existingRules.map((r) => `${r.type}:${r.value.toLowerCase().trim()}`));

      const created: any[] = [];
      const skipped: string[] = [];

      for (const rule of rules) {
        const key = `${rule.type}:${rule.value.toLowerCase().trim()}`;
        if (existingValues.has(key)) {
          skipped.push(rule.value);
          continue;
        }

        const createdRule = await prisma.moderationRule.create({
          data: {
            organizationId: req.organizationId!,
            chatbotId,
            type: rule.type as ModerationRuleType,
            value: rule.value,
            action: rule.action as ModerationAction,
            severity: (rule.severity || 'MEDIUM') as ModerationSeverity,
            enabled: true,
            matchMode: (rule.matchMode || 'CONTAINS') as ModerationMatchMode,
            caseSensitive: rule.caseSensitive ?? false,
          },
        });
        created.push(createdRule);
        existingValues.add(key);
      }

      res.status(201).json({ created, skipped: skipped.length > 0 ? { count: skipped.length, items: skipped } : undefined });
    } catch (error) {
      next(error);
    }
  };

  testRule = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { chatbotId } = req.params;
      const { text } = req.body;

      const result = await moderationService.testText(req.organizationId!, text, chatbotId);
      res.json({ result });
    } catch (error) {
      next(error);
    }
  };

  listEvents = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { chatbotId } = req.params;
      const limit = Math.min(parseInt(req.query.limit as string) || 50, 200);
      const events = await moderationService.getEvents(req.organizationId!, chatbotId, limit);
      res.json({ events });
    } catch (error) {
      next(error);
    }
  };

  private async verifyChatbotAccess(chatbotId: string, organizationId: string) {
    const chatbot = await prisma.chatbot.findFirst({ where: { id: chatbotId, organizationId } });
    if (!chatbot) throw new AppError(404, 'Chatbot not found');
  }

  private async verifyRuleAccess(ruleId: string, chatbotId: string, organizationId: string) {
    const rule = await prisma.moderationRule.findFirst({
      where: { id: ruleId, organizationId, OR: [{ chatbotId }, { chatbotId: null }] },
    });
    if (!rule) throw new AppError(404, 'Rule not found');
  }
}
