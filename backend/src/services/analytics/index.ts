import { prisma } from '../prisma';

export interface ConversationInsight {
  conversationId: string;
  summary?: string;
  intent?: string;
  sentiment?: 'positive' | 'neutral' | 'negative';
  topics?: string[];
  leadScore?: number;
  suggestedTags?: string[];
}

export class AnalyticsService {
  async generateConversationInsight(conversationId: string): Promise<ConversationInsight> {
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: { messages: { orderBy: { createdAt: 'asc' } } },
    });

    if (!conversation || conversation.messages.length === 0) {
      return { conversationId };
    }

    const transcript = conversation.messages
      .map((m) => `[${m.role}]: ${m.content}`)
      .join('\n');

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: `Analyze this conversation transcript. Return a JSON object with:
- summary: 1-2 sentence summary
- intent: the main user intent
- sentiment: positive/neutral/negative
- topics: array of key topics discussed
- leadScore: 0-100 lead qualification score
- suggestedTags: array of suggested tags`,
            },
            { role: 'user', content: transcript },
          ],
          response_format: { type: 'json_object' },
        }),
      });

      const data = await response.json() as any;
      const analysis = JSON.parse(data.choices[0]?.message?.content || '{}');

      return {
        conversationId,
        summary: analysis.summary,
        intent: analysis.intent,
        sentiment: analysis.sentiment,
        topics: analysis.topics,
        leadScore: analysis.leadScore,
        suggestedTags: analysis.suggestedTags,
      };
    } catch {
      return { conversationId };
    }
  }

  async getFunnelData(organizationId: string, days = 30) {
    const chatbots = await prisma.chatbot.findMany({
      where: { organizationId },
      select: { id: true },
    });
    const chatbotIds = chatbots.map((c) => c.id);
    const since = new Date(Date.now() - days * 86400000);

    const [visitors, conversations, leads, qualified, converted] = await Promise.all([
      prisma.conversation.groupBy({
        by: ['chatbotId'],
        where: { chatbotId: { in: chatbotIds }, createdAt: { gte: since } },
        _count: true,
      }),
      prisma.conversation.count({ where: { chatbotId: { in: chatbotIds }, createdAt: { gte: since }, messageCount: { gt: 1 } } }),
      prisma.lead.count({ where: { chatbotId: { in: chatbotIds }, createdAt: { gte: since } } }),
      prisma.lead.count({ where: { chatbotId: { in: chatbotIds }, createdAt: { gte: since }, status: 'qualified' } }),
      prisma.lead.count({ where: { chatbotId: { in: chatbotIds }, createdAt: { gte: since }, status: 'converted' } }),
    ]);

    const totalVisitors = visitors.reduce((sum, v) => sum + v._count, 0);

    return {
      visitors: totalVisitors,
      conversations,
      leads,
      qualified,
      converted,
      rates: {
        visitorToConversation: totalVisitors > 0 ? (conversations / totalVisitors) * 100 : 0,
        conversationToLead: conversations > 0 ? (leads / conversations) * 100 : 0,
        leadToQualified: leads > 0 ? (qualified / leads) * 100 : 0,
        qualifiedToConverted: qualified > 0 ? (converted / qualified) * 100 : 0,
      },
    };
  }

  async getTokenUsage(organizationId: string, days = 30) {
    const since = new Date(Date.now() - days * 86400000);
    const usage = await prisma.tokenUsage.findMany({
      where: { organizationId, createdAt: { gte: since } },
      orderBy: { createdAt: 'asc' },
    });

    const total = usage.reduce(
      (acc, u) => ({
        promptTokens: acc.promptTokens + u.promptTokens,
        completionTokens: acc.completionTokens + u.completionTokens,
        totalTokens: acc.totalTokens + u.totalTokens,
      }),
      { promptTokens: 0, completionTokens: 0, totalTokens: 0 },
    );

    const byDate = usage.reduce<Record<string, { prompt: number; completion: number; total: number }>>((acc, u) => {
      const date = u.createdAt.toISOString().split('T')[0];
      if (!acc[date]) acc[date] = { prompt: 0, completion: 0, total: 0 };
      acc[date].prompt += u.promptTokens;
      acc[date].completion += u.completionTokens;
      acc[date].total += u.totalTokens;
      return acc;
    }, {});

    return { total, byDate: Object.entries(byDate).map(([date, tokens]) => ({ date, ...tokens })) };
  }
}

export const analyticsService = new AnalyticsService();
