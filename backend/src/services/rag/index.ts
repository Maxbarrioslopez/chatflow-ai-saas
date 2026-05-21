/**
 * Servicio RAG - Retrieval-Augmented Generation
 * 
 * Busca documentos relevantes en la base de conocimiento, genera embeddings
 * y aumenta el prompt del sistema con contexto recuperado.
 * 
 * Retrieves relevant documents from the knowledge base, generates embeddings,
 * and augments the system prompt with retrieved context.
 */
import { embeddingRepository } from '../../repositories/embedding.repository';
import { knowledgeSourceRepository } from '../../repositories/knowledge-source.repository';
import { createEmbedding } from '../ai/embeddings.service';
import { chunkText } from '../document-processing/chunker';
import { addJob, QueueName } from '../../queue';

export class RAGService {
  async processDocument(knowledgeSourceId: string) {
    const source = await knowledgeSourceRepository.findById(knowledgeSourceId, '');
    if (!source) {
      throw new Error('Knowledge source not found');
    }

    await addJob(QueueName.DOCUMENT_PARSING, 'parse-document', {
      knowledgeSourceId: source.id,
      organizationId: source.organizationId,
      chatbotId: source.chatbotId,
      mimeType: source.mimeType || 'application/octet-stream',
      filename: source.originalName || source.name,
      filePath: source.filePath || undefined,
    });
  }

  async semanticSearch(
    chatbotId: string,
    organizationId: string,
    query: string,
    limit = 5,
  ): Promise<Array<{ content: string; sourceName: string; score: number }>> {
    try {
      const queryEmbedding = await createEmbedding(query);
      const results = await embeddingRepository.semanticSearch(
        chatbotId,
        organizationId,
        queryEmbedding,
        limit,
      );

      return results.map((r) => ({
        content: r.content,
        sourceName: r.sourceName,
        score: r.score,
      }));
    } catch (error) {
      console.warn('[RAG] Semantic search error:', error instanceof Error ? error.message : '');
      return [];
    }
  }

  async augmentPrompt(
    chatbotId: string,
    organizationId: string,
    userMessage: string,
    systemPrompt: string,
  ): Promise<string> {
    const relevantDocs = await this.semanticSearch(chatbotId, organizationId, userMessage, 5);

    if (relevantDocs.length === 0) return systemPrompt;

    const contextBlock = relevantDocs
      .map((doc) => `[${doc.sourceName}] (relevance: ${(doc.score * 100).toFixed(0)}%)\n${doc.content}`)
      .join('\n\n---\n\n');

    return `${systemPrompt}\n\n## Retrieved Context\n${contextBlock}\n\nInstructions:
- Use the above context to answer the user's question if relevant.
- If the context does not contain the answer, say so clearly.
- Do not invent information not present in the context.
- Cite the source document name when using information from context.`;
  }
}

export const ragService = new RAGService();
