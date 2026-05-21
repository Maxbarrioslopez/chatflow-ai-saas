import { config } from '../../config';
import { getAIConfig } from './ai-client';

export async function callChatCompletion(messages: Array<{ role: string; content: string }>, options?: {
  model?: string;
  temperature?: number;
  maxTokens?: number;
}): Promise<{
  content: string;
  model: string;
  usage?: { promptTokens: number; completionTokens: number; totalTokens: number };
}> {
  const aiConfig = getAIConfig();
  const apiKey = aiConfig.apiKey;

  if (!apiKey) {
    throw new Error(`AI provider "${config.ai.provider}" is not configured. Set ${config.ai.provider === 'openai' ? 'OPENAI_API_KEY' : 'OPENROUTER_API_KEY'}.`);
  }

  const response = await fetch(`${aiConfig.baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
      ...aiConfig.headers,
    },
    body: JSON.stringify({
      model: options?.model || aiConfig.defaultModel,
      messages,
      temperature: options?.temperature ?? 0.7,
      max_tokens: options?.maxTokens ?? 2048,
    }),
  });

  if (!response.ok) {
    const errBody = await response.text().catch(() => '');
    throw new Error(`AI API error (${response.status}): ${errBody.slice(0, 300)}`);
  }

  const data = (await response.json()) as any;
  return {
    content: data.choices?.[0]?.message?.content || '',
    model: data.model || options?.model || aiConfig.defaultModel,
    usage: data.usage
      ? {
          promptTokens: data.usage.prompt_tokens || 0,
          completionTokens: data.usage.completion_tokens || 0,
          totalTokens: data.usage.total_tokens || 0,
        }
      : undefined,
  };
}

export async function callChatCompletionStream(
  messages: Array<{ role: string; content: string }>,
  onChunk: (chunk: string) => void,
  options?: { model?: string; temperature?: number; maxTokens?: number },
): Promise<{ content: string; model: string }> {
  const aiConfig = getAIConfig();
  const apiKey = aiConfig.apiKey;

  if (!apiKey) {
    throw new Error('AI provider is not configured');
  }

  const response = await fetch(`${aiConfig.baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
      ...aiConfig.headers,
    },
    body: JSON.stringify({
      model: options?.model || aiConfig.defaultModel,
      messages,
      temperature: options?.temperature ?? 0.7,
      max_tokens: options?.maxTokens ?? 2048,
      stream: true,
    }),
  });

  if (!response.ok) throw new Error('AI streaming failed');

  const reader = response.body?.getReader();
  if (!reader) throw new Error('No response body');

  const decoder = new TextDecoder();
  let fullContent = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value);
    const lines = chunk.split('\n').filter((l) => l.startsWith('data: '));

    for (const line of lines) {
      const data = line.slice(6);
      if (data === '[DONE]') continue;
      try {
        const parsed = JSON.parse(data);
        const content = parsed.choices?.[0]?.delta?.content || '';
        if (content) {
          fullContent += content;
          onChunk(content);
        }
      } catch {
        // skip
      }
    }
  }

  return { content: fullContent, model: options?.model || aiConfig.defaultModel };
}
