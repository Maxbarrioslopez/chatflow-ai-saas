import { cleanText, estimateTokenCount } from './text-cleaner';

export type ChunkResult = {
  content: string;
  chunkIndex: number;
  tokenCount: number;
};

let splitterInstance: any = null;

async function getSplitter(chunkSize?: number, chunkOverlap?: number) {
  if (!splitterInstance) {
    try {
      const mod = await import('@langchain/textsplitters');
      splitterInstance = new mod.RecursiveCharacterTextSplitter({
        chunkSize: chunkSize ?? parseInt(process.env.DOCUMENT_CHUNK_SIZE ?? '1000', 10),
        chunkOverlap: chunkOverlap ?? parseInt(process.env.DOCUMENT_CHUNK_OVERLAP ?? '150', 10),
        separators: ['\n\n', '\n', '.', '!', '?', ',', ' ', ''],
      });
    } catch {
      return null;
    }
  }
  return splitterInstance;
}

export async function chunkText(text: string, chunkSize?: number, chunkOverlap?: number): Promise<ChunkResult[]> {
  const cleaned = cleanText(text);

  if (!cleaned) return [];

  const splitter = await getSplitter(chunkSize, chunkOverlap);

  if (splitter) {
    try {
      const docs = await splitter.splitText(cleaned);
      return docs
        .filter((d: string) => d.trim().length > 0)
        .map((content: string, index: number) => ({
          content: content.trim(),
          chunkIndex: index,
          tokenCount: estimateTokenCount(content),
        }));
    } catch {
      // Fall through to manual splitting
    }
  }

  return manualChunk(cleaned, chunkSize ?? 1000, chunkOverlap ?? 150);
}

function manualChunk(text: string, chunkSize: number, chunkOverlap: number): ChunkResult[] {
  const paragraphs = text.split(/\n\n+/).filter(Boolean);
  const chunks: ChunkResult[] = [];
  let current = '';
  let index = 0;

  for (const para of paragraphs) {
    if ((current + '\n\n' + para).trim().length > chunkSize && current) {
      chunks.push({
        content: current.trim(),
        chunkIndex: index++,
        tokenCount: estimateTokenCount(current),
      });
      const words = current.split(' ');
      const overlapWords = words.slice(Math.max(0, words.length - Math.floor(chunkOverlap / 5)));
      current = overlapWords.join(' ') + '\n\n' + para;
    } else {
      current += (current ? '\n\n' : '') + para;
    }
  }

  if (current.trim()) {
    chunks.push({
      content: current.trim(),
      chunkIndex: index,
      tokenCount: estimateTokenCount(current),
    });
  }

  return chunks;
}
