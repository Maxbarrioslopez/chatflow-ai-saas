import { prisma } from '../../services/prisma';
import { AppError } from '../../common/errors';

export class ConversationService {
  async findAll(organizationId: string, filters: { chatbotId?: string; status?: string; limit: number; offset: number }) {
    const chatbots = await prisma.chatbot.findMany({
      where: { organizationId },
      select: { id: true },
    });
    const chatbotIds = chatbots.map((c) => c.id);

    const where: any = {
      chatbotId: { in: chatbotIds },
    };

    if (filters.chatbotId) where.chatbotId = filters.chatbotId;
    if (filters.status) where.status = filters.status;

    const [conversations, total] = await Promise.all([
      prisma.conversation.findMany({
        where,
        include: {
          _count: { select: { messages: true } },
          lead: { select: { id: true, name: true, email: true } },
        },
        orderBy: { updatedAt: 'desc' },
        take: filters.limit,
        skip: filters.offset,
      }),
      prisma.conversation.count({ where }),
    ]);

    return {
      conversations: conversations.map((c) => ({
        id: c.id,
        chatbotId: c.chatbotId,
        visitorName: c.visitorName,
        visitorEmail: c.visitorEmail,
        status: c.status,
        messageCount: c._count.messages,
        lead: c.lead,
        rating: c.rating,
        createdAt: c.createdAt,
        updatedAt: c.updatedAt,
      })),
      total,
      limit: filters.limit,
      offset: filters.offset,
    };
  }

  async findById(id: string, organizationId: string) {
    const conversation = await prisma.conversation.findUnique({
      where: { id },
      include: {
        messages: { orderBy: { createdAt: 'asc' } },
        lead: true,
        chatbot: { select: { organizationId: true, name: true } },
      },
    });

    if (!conversation || conversation.chatbot.organizationId !== organizationId) {
      throw new AppError(404, 'Conversation not found');
    }

    return conversation;
  }

  async updateStatus(id: string, organizationId: string, status: string) {
    const conversation = await prisma.conversation.findUnique({
      where: { id },
      include: { chatbot: { select: { organizationId: true } } },
    });

    if (!conversation || conversation.chatbot.organizationId !== organizationId) {
      throw new AppError(404, 'Conversation not found');
    }

    return prisma.conversation.update({
      where: { id },
      data: { status: status as any, closedAt: status === 'closed' || status === 'resolved' ? new Date() : null },
    });
  }

  async updateRating(id: string, organizationId: string, rating: number, feedback?: string) {
    const conversation = await prisma.conversation.findUnique({
      where: { id },
      include: { chatbot: { select: { organizationId: true } } },
    });

    if (!conversation || conversation.chatbot.organizationId !== organizationId) {
      throw new AppError(404, 'Conversation not found');
    }

    return prisma.conversation.update({
      where: { id },
      data: { rating, feedback },
    });
  }

  async getMessages(id: string, organizationId: string) {
    const conversation = await prisma.conversation.findUnique({
      where: { id },
      include: { chatbot: { select: { organizationId: true } } },
    });

    if (!conversation || conversation.chatbot.organizationId !== organizationId) {
      throw new AppError(404, 'Conversation not found');
    }

    return prisma.message.findMany({
      where: { conversationId: id },
      orderBy: { createdAt: 'asc' },
    });
  }
}
