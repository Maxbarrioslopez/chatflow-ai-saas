import { prisma } from '../services/prisma';
import { BaseRepository } from './base.repository';

export class LeadRepository extends BaseRepository<typeof prisma.lead> {
  constructor() {
    super(prisma.lead);
  }

  async findByChatbot(chatbotId: string, options?: { status?: string; limit?: number; offset?: number }) {
    return prisma.lead.findMany({
      where: { chatbotId, ...(options?.status ? { status: options.status as any } : {}) },
      orderBy: { createdAt: 'desc' },
      take: options?.limit || 50,
      skip: options?.offset || 0,
    });
  }
}

export const leadRepository = new LeadRepository();
