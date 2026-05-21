import { prisma } from '../prisma';
import { parseDocument } from './document-parser';
import { chunkText } from './chunker';
import { createEmbeddingsBatch } from '../ai/embeddings.service';
import { cleanText, estimateTokenCount } from './text-cleaner';
import type { DocumentProcessingJob } from './types';

export async function processDocument(job: DocumentProcessingJob): Promise<void> {
  const { knowledgeSourceId, organizationId, chatbotId, bufferBase64, mimeType, filename } = job;

  await prisma.knowledgeSource.update({
    where: { id: knowledgeSourceId },
    data: { status: 'processing' },
  });

  let buffer: Buffer;
  if (bufferBase64) {
    buffer = Buffer.from(bufferBase64, 'base64');
  } else if (job.filePath) {
    const fs = await import('fs/promises');
    buffer = await fs.readFile(job.filePath);
  } else {
    await markFailed(knowledgeSourceId, 'No file data provided');
    return;
  }

  const parseResult = await parseDocument(buffer, filename, mimeType);

  if (!parseResult.success) {
    await markFailed(knowledgeSourceId, parseResult.error || 'Parse failed');
    return;
  }

  if (!parseResult.document || !parseResult.document.text) {
    if (parseResult.needsOcr) {
      await prisma.knowledgeSource.update({
        where: { id: knowledgeSourceId },
        data: { status: 'needs_ocr', errorMessage: 'PDF has no extractable text. OCR required.' },
      });
      return;
    }
    await markFailed(knowledgeSourceId, 'No text content extracted');
    return;
  }

  const rawText = cleanText(parseResult.document.text);

  if (!rawText || rawText.length < 10) {
    await markFailed(knowledgeSourceId, 'Extracted text is too short (less than 10 characters)');
    return;
  }

  const chunks = await chunkText(rawText);

  if (chunks.length === 0) {
    await markFailed(knowledgeSourceId, 'No chunks generated from text');
    return;
  }

  const chunkTexts = chunks.map((c) => c.content);
  let embeddings: number[][];

  try {
    embeddings = await createEmbeddingsBatch(chunkTexts);
  } catch (error) {
    await markFailed(knowledgeSourceId, `Embedding generation failed: ${error instanceof Error ? error.message : 'Unknown'}`);
    return;
  }

  await prisma.$transaction(async (tx) => {
    // Delete old embeddings if reprocessing
    await tx.embedding.deleteMany({ where: { knowledgeSourceId } });

    // Save new embeddings
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      const vector = embeddings[i];

      try {
        await tx.$executeRaw`
          INSERT INTO "Embedding" ("id", "organizationId", "chatbotId", "knowledgeSourceId", "chunkIndex", "content", "tokenCount", "vector", "createdAt")
          VALUES (${cuid()}, ${organizationId}, ${chatbotId}, ${knowledgeSourceId}, ${chunk.chunkIndex}, ${chunk.content}, ${chunk.tokenCount}, ${vector}::vector, NOW())
        `;
      } catch (dbError) {
        // If pgvector is not available, save without vector
        console.warn('[DocumentProcessor] pgvector not available, saving without vector. Install pgvector extension.');
        await tx.$executeRaw`
          INSERT INTO "Embedding" ("id", "organizationId", "chatbotId", "knowledgeSourceId", "chunkIndex", "content", "tokenCount", "createdAt")
          VALUES (${cuid()}, ${organizationId}, ${chatbotId}, ${knowledgeSourceId}, ${chunk.chunkIndex}, ${chunk.content}, ${chunk.tokenCount}, NOW())
        `;
      }
    }

    // Update knowledge source
    await tx.knowledgeSource.update({
      where: { id: knowledgeSourceId },
      data: {
        status: 'ready',
        content: rawText.slice(0, 100000),
        chunkCount: chunks.length,
        metadata: {
          ...(parseResult.document!.metadata as Record<string, unknown>),
          totalChunks: chunks.length,
          totalTokens: chunks.reduce((sum, c) => sum + c.tokenCount, 0),
          processedAt: new Date().toISOString(),
        },
      },
    });
  });
}

async function markFailed(knowledgeSourceId: string, errorMessage: string) {
  await prisma.knowledgeSource.update({
    where: { id: knowledgeSourceId },
    data: { status: 'failed', errorMessage: errorMessage.slice(0, 500) },
  });
}

let counter = 0;
function cuid(): string {
  counter++;
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `c${timestamp}${random}${counter}`;
}
