import { prisma } from '../services/prisma';

export class EmbeddingRepository {
  async findByKnowledgeSource(knowledgeSourceId: string) {
    return prisma.embedding.findMany({
      where: { knowledgeSourceId },
      orderBy: { chunkIndex: 'asc' },
    });
  }

  async semanticSearch(chatbotId: string, organizationId: string, queryEmbedding: number[], limit = 5) {
    try {
      const results = await prisma.$queryRaw<Array<{
        id: string;
        content: string;
        chunk_index: number;
        similarity: number;
        source_name: string;
      }>>`
        SELECT
          e.id,
          e.content,
          e."chunkIndex" as chunk_index,
          1 - (e.vector <=> ${queryEmbedding}::vector) AS similarity,
          COALESCE(ks.name, 'Unknown') AS source_name
        FROM "Embedding" e
        JOIN "knowledge_sources" ks ON ks.id = e."knowledgeSourceId"
        WHERE e."chatbotId" = ${chatbotId}
          AND e."organizationId" = ${organizationId}
          AND ks.status = 'ready'
        ORDER BY e.vector <=> ${queryEmbedding}::vector
        LIMIT ${limit}
      `;

      return results
        .filter((r) => r.similarity > 0.3)
        .map((r) => ({
          id: r.id,
          content: r.content,
          chunkIndex: r.chunk_index,
          score: r.similarity,
          sourceName: r.source_name,
        }));
    } catch (error) {
      console.warn('[EmbeddingRepo] pgvector search failed, falling back to metadata scan.', error instanceof Error ? error.message : '');
      return this.fallbackSearch(chatbotId, organizationId, queryEmbedding, limit);
    }
  }

  private async fallbackSearch(
    chatbotId: string,
    organizationId: string,
    _queryEmbedding: number[],
    limit: number,
  ) {
    const chunks = await prisma.embedding.findMany({
      where: {
        chatbotId,
        organizationId,
        knowledgeSource: { status: 'ready' },
      },
      include: { knowledgeSource: { select: { name: true } } },
      take: limit,
      orderBy: { createdAt: 'desc' },
    });

    return chunks.map((c) => ({
      id: c.id,
      content: c.content,
      chunkIndex: c.chunkIndex,
      score: 0,
      sourceName: c.knowledgeSource?.name || 'Unknown',
    }));
  }

  async deleteByKnowledgeSource(knowledgeSourceId: string) {
    return prisma.embedding.deleteMany({ where: { knowledgeSourceId } });
  }
}

export const embeddingRepository = new EmbeddingRepository();
