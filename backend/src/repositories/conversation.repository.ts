import { prisma } from '../services/prisma';
import { BaseRepository } from './base.repository';

export class ConversationRepository extends BaseRepository<typeof prisma.conversation> {
  constructor() {
    super(prisma.conversation);
  }

  async findByChatbot(chatbotId: string, options?: { status?: string; limit?: number; offset?: number }) {
    return prisma.conversation.findMany({
      where: { chatbotId, ...(options?.status ? { status: options.status as any } : {}) },
      include: { messages: { take: 1, orderBy: { createdAt: 'desc' } }, lead: true },
      orderBy: { updatedAt: 'desc' },
      take: options?.limit || 50,
      skip: options?.offset || 0,
    });
  }

  async findByIdWithMessages(id: string) {
    return prisma.conversation.findUnique({
      where: { id },
      include: { messages: { orderBy: { createdAt: 'asc' } }, lead: true },
    });
  }
}

export const conversationRepository = new ConversationRepository();
