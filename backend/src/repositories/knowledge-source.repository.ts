import { prisma } from '../services/prisma';

export class KnowledgeSourceRepository {
  async findByChatbot(chatbotId: string, organizationId: string) {
    return prisma.knowledgeSource.findMany({
      where: { chatbotId, organizationId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string, organizationId: string) {
    return prisma.knowledgeSource.findFirst({
      where: { id, organizationId },
    });
  }

  async create(data: {
    organizationId: string;
    chatbotId: string;
    type: 'document' | 'website' | 'text' | 'faq' | 'qapairs';
    name: string;
    mimeType?: string;
    originalName?: string;
    fileSize?: number;
    filePath?: string;
    content?: string;
    url?: string;
  }) {
    return prisma.knowledgeSource.create({ data: { ...data, status: 'pending' } });
  }

  async updateStatus(id: string, status: string, errorMessage?: string) {
    return prisma.knowledgeSource.update({
      where: { id },
      data: {
        status: status as any,
        ...(errorMessage ? { errorMessage } : {}),
      },
    });
  }

  async delete(id: string, organizationId: string) {
    const source = await this.findById(id, organizationId);
    if (!source) return null;
    await prisma.embedding.deleteMany({ where: { knowledgeSourceId: id } });
    return prisma.knowledgeSource.delete({ where: { id } });
  }

  async countByChatbot(chatbotId: string, organizationId: string) {
    return prisma.knowledgeSource.count({ where: { chatbotId, organizationId } });
  }
}

export const knowledgeSourceRepository = new KnowledgeSourceRepository();
