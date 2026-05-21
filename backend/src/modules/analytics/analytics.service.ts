import { prisma } from '../../services/prisma';
import { AppError } from '../../common/errors';

export class AnalyticsService {
  async getDashboard(organizationId: string, period: string) {
    const chatbots = await prisma.chatbot.findMany({
      where: { organizationId },
      select: { id: true },
    });
    const chatbotIds = chatbots.map((c) => c.id);

    const days = period === '24h' ? 1 : period === '7d' ? 7 : period === '30d' ? 30 : 90;
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    const previousSince = new Date(since.getTime() - days * 24 * 60 * 60 * 1000);

    const [totalConversations, activeConversations, totalLeads, totalMessages, satisfaction] = await Promise.all([
      prisma.conversation.count({ where: { chatbotId: { in: chatbotIds } } }),
      prisma.conversation.count({ where: { chatbotId: { in: chatbotIds }, status: 'active' } }),
      prisma.lead.count({ where: { chatbotId: { in: chatbotIds } } }),
      prisma.message.count({ where: { conversation: { chatbotId: { in: chatbotIds } } } }),
      prisma.conversation.aggregate({
        where: { chatbotId: { in: chatbotIds }, rating: { not: null } },
        _avg: { rating: true },
      }),
    ]);

    const newLeads = await prisma.lead.count({
      where: { chatbotId: { in: chatbotIds }, createdAt: { gte: since } },
    });

    const previousConversations = await prisma.conversation.count({
      where: { chatbotId: { in: chatbotIds }, createdAt: { gte: previousSince, lt: since } },
    });

    const previousLeads = await prisma.lead.count({
      where: { chatbotId: { in: chatbotIds }, createdAt: { gte: previousSince, lt: since } },
    });

    return {
      totalConversations,
      activeConversations,
      totalLeads,
      newLeads,
      conversionRate: totalConversations > 0 ? (totalLeads / totalConversations) * 100 : 0,
      satisfactionRate: satisfaction._avg.rating ? (satisfaction._avg.rating / 5) * 100 : 0,
      avgResponseTime: 0,
      totalMessages,
      previousPeriod: {
        totalConversations: previousConversations,
        totalLeads: previousLeads,
      },
    };
  }

  async getConversationAnalytics(organizationId: string) {
    const chatbots = await prisma.chatbot.findMany({
      where: { organizationId },
      select: { id: true },
    });
    const chatbotIds = chatbots.map((c) => c.id);

    const conversations = await prisma.conversation.findMany({
      where: { chatbotId: { in: chatbotIds } },
      select: { status: true, createdAt: true },
      orderBy: { createdAt: 'asc' },
    });

    const byStatus = {
      active: conversations.filter((c) => c.status === 'active').length,
      waiting: conversations.filter((c) => c.status === 'waiting').length,
      resolved: conversations.filter((c) => c.status === 'resolved').length,
      closed: conversations.filter((c) => c.status === 'closed').length,
      spam: conversations.filter((c) => c.status === 'spam').length,
    };

    const byDate = this.groupByDate(conversations, 'createdAt');

    return { byStatus, byDate, total: conversations.length };
  }

  async getLeadAnalytics(organizationId: string) {
    const chatbots = await prisma.chatbot.findMany({
      where: { organizationId },
      select: { id: true },
    });
    const chatbotIds = chatbots.map((c) => c.id);

    const leads = await prisma.lead.findMany({
      where: { chatbotId: { in: chatbotIds } },
      select: { status: true, source: true, createdAt: true, chatbotId: true },
    });

    const byStatus: Record<string, number> = {};
    const bySource: Record<string, number> = {};
    const byChatbot: Record<string, number> = {};

    leads.forEach((lead) => {
      byStatus[lead.status] = (byStatus[lead.status] || 0) + 1;
      bySource[lead.source] = (bySource[lead.source] || 0) + 1;
      byChatbot[lead.chatbotId] = (byChatbot[lead.chatbotId] || 0) + 1;
    });

    return {
      total: leads.length,
      byStatus,
      bySource,
      byChatbot,
      conversionRate: leads.length > 0 ? (byStatus['converted'] || 0) / leads.length * 100 : 0,
    };
  }

  async getSatisfaction(organizationId: string) {
    const chatbots = await prisma.chatbot.findMany({
      where: { organizationId },
      select: { id: true },
    });
    const chatbotIds = chatbots.map((c) => c.id);

    const ratings = await prisma.conversation.findMany({
      where: { chatbotId: { in: chatbotIds }, rating: { not: null } },
      select: { rating: true },
    });

    const distribution: Record<number, number> = {};
    ratings.forEach((r) => {
      distribution[r.rating!] = (distribution[r.rating!] || 0) + 1;
    });

    const avg = ratings.length > 0
      ? ratings.reduce((sum, r) => sum + r.rating!, 0) / ratings.length
      : 0;

    return {
      average: avg,
      total: ratings.length,
      distribution,
    };
  }

  async getChatbotAnalytics(chatbotId: string, organizationId: string) {
    const chatbot = await prisma.chatbot.findFirst({
      where: { id: chatbotId, organizationId },
    });
    if (!chatbot) throw new AppError(404, 'Chatbot not found');

    const [conversations, leads, messages, recentConversations] = await Promise.all([
      prisma.conversation.findMany({ where: { chatbotId }, select: { status: true, createdAt: true } }),
      prisma.lead.findMany({ where: { chatbotId }, select: { status: true, createdAt: true } }),
      prisma.message.count({ where: { conversation: { chatbotId } } }),
      prisma.conversation.findMany({
        where: { chatbotId },
        orderBy: { updatedAt: 'desc' },
        take: 10,
        include: {
          _count: { select: { messages: true } },
          lead: { select: { name: true, email: true } },
        },
      }),
    ]);

    return {
      chatbotId,
      chatbotName: chatbot.name,
      metrics: {
        totalConversations: conversations.length,
        activeConversations: conversations.filter((c) => c.status === 'active').length,
        totalLeads: leads.length,
        totalMessages: messages,
      },
      recentConversations,
    };
  }

  private groupByDate(data: { createdAt: Date }[], field: string) {
    const groups: Record<string, number> = {};
    data.forEach((item) => {
      const date = (item as any)[field].toISOString().split('T')[0];
      groups[date] = (groups[date] || 0) + 1;
    });
    return Object.entries(groups).map(([date, value]) => ({ date, value }));
  }
}
