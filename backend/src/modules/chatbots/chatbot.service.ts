import { prisma } from '../../services/prisma';
import { AppError } from '../../common/errors';
import { BUSINESS_PRESETS } from '@chatflow/shared';
import type { CreateChatbotInput } from '@chatflow/shared';
import { v4 as uuid } from 'uuid';

export class ChatbotService {
  async findAll(organizationId: string) {
    const chatbots = await prisma.chatbot.findMany({
      where: { organizationId },
      include: {
        appearance: true,
        _count: {
          select: { conversations: true, leads: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return chatbots.map((c) => ({
      id: c.id,
      name: c.name,
      description: c.description,
      businessPreset: c.businessPreset,
      isActive: c.isActive,
      totalConversations: c._count.conversations,
      totalLeads: c._count.leads,
      lastActivity: c.updatedAt,
      appearance: c.appearance,
    }));
  }

  async create(organizationId: string, data: CreateChatbotInput) {
    const count = await prisma.chatbot.count({ where: { organizationId } });
    const org = await prisma.organization.findUnique({ where: { id: organizationId } });
    const planLimits: Record<string, number> = {
      free: 1, starter: 3, pro: 10, enterprise: 999,
    };
    if (count >= (planLimits[org?.planId || 'free'] || 1)) {
      throw new AppError(403, 'Chatbot limit reached for your plan');
    }

    const preset = BUSINESS_PRESETS.find((p) => p.id === data.businessPreset);

    const chatbot = await prisma.chatbot.create({
      data: {
        name: data.name,
        description: data.description,
        businessPreset: data.businessPreset,
        organizationId,
        widgetToken: uuid(),
        appearance: {
          create: {
            welcomeMessage: preset?.welcomeMessage || 'Hello! How can I help?',
          },
        },
        behavior: {
          create: {
            initialMessage: preset?.welcomeMessage || 'Hello! How can I help?',
            suggestedMessages: JSON.stringify(preset?.suggestedMessages || []),
          },
        },
        aiConfig: {
          create: {
            systemPrompt: preset?.systemPrompt || 'You are a helpful assistant.',
          },
        },
      },
      include: {
        appearance: true,
        behavior: true,
        aiConfig: true,
      },
    });

    return chatbot;
  }

  async findById(id: string, organizationId: string) {
    const chatbot = await prisma.chatbot.findFirst({
      where: { id, organizationId },
      include: {
        appearance: true,
        behavior: true,
        aiConfig: true,
        whitelabel: true,
        knowledge: true,
        _count: {
          select: { conversations: true, leads: true },
        },
      },
    });

    if (!chatbot) {
      throw new AppError(404, 'Chatbot not found');
    }

    return chatbot;
  }

  async update(id: string, organizationId: string, data: Partial<{ name: string; description: string; isActive: boolean }>) {
    const chatbot = await prisma.chatbot.findFirst({ where: { id, organizationId } });
    if (!chatbot) throw new AppError(404, 'Chatbot not found');

    return prisma.chatbot.update({
      where: { id },
      data,
    });
  }

  async delete(id: string, organizationId: string) {
    const chatbot = await prisma.chatbot.findFirst({ where: { id, organizationId } });
    if (!chatbot) throw new AppError(404, 'Chatbot not found');

    await prisma.chatbot.delete({ where: { id } });
  }

  async updateAppearance(id: string, organizationId: string, data: Record<string, unknown>) {
    const chatbot = await prisma.chatbot.findFirst({ where: { id, organizationId } });
    if (!chatbot) throw new AppError(404, 'Chatbot not found');

    return prisma.chatbotAppearance.upsert({
      where: { chatbotId: id },
      update: data,
      create: { chatbotId: id, ...data },
    });
  }

  async updateBehavior(id: string, organizationId: string, data: Record<string, unknown>) {
    const chatbot = await prisma.chatbot.findFirst({ where: { id, organizationId } });
    if (!chatbot) throw new AppError(404, 'Chatbot not found');

    return prisma.chatbotBehavior.upsert({
      where: { chatbotId: id },
      update: data,
      create: { chatbotId: id, ...data },
    });
  }

  async updateAIConfig(id: string, organizationId: string, data: Record<string, unknown>) {
    const chatbot = await prisma.chatbot.findFirst({ where: { id, organizationId } });
    if (!chatbot) throw new AppError(404, 'Chatbot not found');

    return prisma.aIConfig.upsert({
      where: { chatbotId: id },
      update: data,
      create: { chatbotId: id, ...data },
    });
  }

  async getWidgetToken(id: string, organizationId: string) {
    const chatbot = await prisma.chatbot.findFirst({ where: { id, organizationId } });
    if (!chatbot) throw new AppError(404, 'Chatbot not found');

    return { widgetToken: chatbot.widgetToken };
  }

  async regenerateToken(id: string, organizationId: string) {
    const chatbot = await prisma.chatbot.findFirst({ where: { id, organizationId } });
    if (!chatbot) throw new AppError(404, 'Chatbot not found');

    const newToken = uuid();
    await prisma.chatbot.update({ where: { id }, data: { widgetToken: newToken } });

    return { widgetToken: newToken };
  }
}
