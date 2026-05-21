import { prisma } from '../services/prisma';
import { BaseRepository } from './base.repository';

export class ChatbotRepository extends BaseRepository<typeof prisma.chatbot> {
  constructor() {
    super(prisma.chatbot);
  }

  async findByOrganization(organizationId: string) {
    return prisma.chatbot.findMany({
      where: { organizationId },
      include: {
        appearance: true,
        _count: { select: { conversations: true, leads: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByIdAndOrganization(id: string, organizationId: string) {
    return prisma.chatbot.findFirst({
      where: { id, organizationId },
      include: {
        appearance: true,
        behavior: true,
        aiConfig: true,
        whitelabel: true,
        knowledge: true,
        _count: { select: { conversations: true, leads: true } },
      },
    });
  }

  async countByOrganization(organizationId: string) {
    return prisma.chatbot.count({ where: { organizationId } });
  }
}

export const chatbotRepository = new ChatbotRepository();
