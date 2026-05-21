const EMBEDDING_MODEL = process.env.EMBEDDING_MODEL || 'text-embedding-3-small';
const MAX_RETRIES = 3;
const TIMEOUT_MS = 30000;

export async function createEmbedding(text: string): Promise<number[]> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is not configured');
  }

  const cleaned = text.replace(/\0/g, '').trim();
  if (!cleaned) {
    throw new Error('Cannot generate embedding for empty text');
  }

  let lastError: Error | null = null;

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

      const response = await fetch('https://api.openai.com/v1/embeddings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: EMBEDDING_MODEL,
          input: cleaned.slice(0, 8191),
        }),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (response.status === 429) {
        const waitMs = Math.min(1000 * Math.pow(2, attempt), 10000);
        await new Promise((resolve) => setTimeout(resolve, waitMs));
        continue;
      }

      if (!response.ok) {
        const errorBody = await response.text().catch(() => 'Unknown error');
        throw new Error(`OpenAI embedding API error (${response.status}): ${errorBody.slice(0, 200)}`);
      }

      const data = await response.json() as any;
      return data.data[0].embedding as number[];
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      if (attempt < MAX_RETRIES - 1) {
        const waitMs = 500 * Math.pow(2, attempt);
        await new Promise((resolve) => setTimeout(resolve, waitMs));
      }
    }
  }

  throw lastError || new Error('Embedding generation failed after retries');
}

export async function createEmbeddingsBatch(texts: string[]): Promise<number[][]> {
  const results: number[][] = [];

  for (let i = 0; i < texts.length; i++) {
    try {
      const embedding = await createEmbedding(texts[i]);
      results.push(embedding);
    } catch (error) {
      console.error(`[Embeddings] Failed to embed chunk ${i}:`, error instanceof Error ? error.message : 'Unknown');
      results.push(new Array(1536).fill(0));
    }
  }

  return results;
}
