import { prisma } from '../../services/prisma';
import { AppError } from '../../common/errors';

export class LeadService {
  async findAll(organizationId: string, filters: {
    chatbotId?: string; status?: string; search?: string; limit: number; offset: number
  }) {
    const chatbots = await prisma.chatbot.findMany({
      where: { organizationId },
      select: { id: true },
    });
    const chatbotIds = chatbots.map((c) => c.id);

    const where: any = { chatbotId: { in: chatbotIds } };

    if (filters.chatbotId) where.chatbotId = filters.chatbotId;
    if (filters.status) where.status = filters.status;
    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { email: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    const [leads, total] = await Promise.all([
      prisma.lead.findMany({
        where,
        include: {
          chatbot: { select: { name: true } },
          conversation: { select: { id: true, status: true } },
        },
        orderBy: { createdAt: 'desc' },
        take: filters.limit,
        skip: filters.offset,
      }),
      prisma.lead.count({ where }),
    ]);

    return { leads, total, limit: filters.limit, offset: filters.offset };
  }

  async findById(id: string, organizationId: string) {
    const lead = await prisma.lead.findUnique({
      where: { id },
      include: {
        chatbot: { select: { organizationId: true, name: true } },
        conversation: true,
      },
    });

    if (!lead || lead.chatbot?.organizationId !== organizationId) {
      throw new AppError(404, 'Lead not found');
    }

    return lead;
  }

  async updateStatus(id: string, organizationId: string, status: string) {
    const lead = await this.findById(id, organizationId);
    return prisma.lead.update({
      where: { id },
      data: {
        status: status as any,
        convertedAt: status === 'converted' ? new Date() : null,
      },
    });
  }

  async updateScore(id: string, organizationId: string, score: number) {
    await this.findById(id, organizationId);
    return prisma.lead.update({ where: { id }, data: { score } });
  }

  async addTags(id: string, organizationId: string, tags: string[]) {
    const lead = await this.findById(id, organizationId);
    const currentTags = (lead.tags as string[]) || [];
    const updatedTags = [...new Set([...currentTags, ...tags])];
    return prisma.lead.update({ where: { id }, data: { tags: updatedTags } });
  }

  async removeTags(id: string, organizationId: string, tags: string[]) {
    const lead = await this.findById(id, organizationId);
    const currentTags = (lead.tags as string[]) || [];
    const updatedTags = currentTags.filter((t) => !tags.includes(t));
    return prisma.lead.update({ where: { id }, data: { tags: updatedTags } });
  }
}
