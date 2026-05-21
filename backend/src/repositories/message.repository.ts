import { prisma } from '../services/prisma';
import { BaseRepository } from './base.repository';

export class MessageRepository extends BaseRepository<typeof prisma.message> {
  constructor() {
    super(prisma.message);
  }

  async findByConversation(conversationId: string) {
    return prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: 'asc' },
    });
  }
}

export const messageRepository = new MessageRepository();
