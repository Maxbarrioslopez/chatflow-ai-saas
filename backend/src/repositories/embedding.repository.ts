import { prisma } from '../services/prisma';

const VECTOR_DIMENSIONS = 1536;

export class EmbeddingRepository {
  async findByKnowledgeSource(knowledgeSourceId: string) {
    return prisma.embedding.findMany({
      where: { knowledgeSourceId },
      orderBy: { chunkIndex: 'asc' },
    });
  }

  async semanticSearch(chatbotId: string, organizationId: string, queryEmbedding: number[], limit = 5) {
    const chunks = await prisma.embedding.findMany({
      where: {
        chatbotId,
        organizationId,
        knowledgeSource: { status: 'ready' },
      },
      include: { knowledgeSource: { select: { name: true } } },
      take: Math.min(limit * 5, 100),
    });

    const scored = chunks
      .map((c) => {
        const meta = c.metadata as Record<string, any> | null;
        let score = 0;

        if (meta?.vector && Array.isArray(meta.vector)) {
          score = this.cosineSimilarity(queryEmbedding, meta.vector as number[]);
        }

        return {
          id: c.id,
          content: c.content,
          chunkIndex: c.chunkIndex,
          score,
          sourceName: c.knowledgeSource?.name || 'Unknown',
        };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);

    return scored;
  }

  private cosineSimilarity(a: number[], b: number[]): number {
    const len = Math.min(a.length, b.length, VECTOR_DIMENSIONS);
    let dot = 0, magA = 0, magB = 0;
    for (let i = 0; i < len; i++) {
      dot += a[i] * b[i];
      magA += a[i] * a[i];
      magB += b[i] * b[i];
    }
    const magnitude = Math.sqrt(magA) * Math.sqrt(magB);
    return magnitude === 0 ? 0 : dot / magnitude;
  }

  async deleteByKnowledgeSource(knowledgeSourceId: string) {
    return prisma.embedding.deleteMany({ where: { knowledgeSourceId } });
  }
}

export const embeddingRepository = new EmbeddingRepository();
