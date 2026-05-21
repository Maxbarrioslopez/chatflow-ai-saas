import { prisma } from '../prisma';
import { AppError } from '../../common/errors';
import { addJob, QueueName } from '../../queue';

export interface AIChatOptions {
  chatbotId: string;
  messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>;
  conversationId?: string;
  stream?: boolean;
}

export interface AICompletionResult {
  content: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  model: string;
}

export class AIService {
  async chat(options: AIChatOptions): Promise<AICompletionResult> {
    const chatbot = await prisma.chatbot.findUnique({
      where: { id: options.chatbotId, isActive: true },
      include: { aiConfig: true },
    });

    if (!chatbot?.aiConfig) {
      throw new AppError(400, 'Chatbot AI configuration not found');
    }

    const { aiConfig } = chatbot;
    const systemMsg = options.messages.find((m) => m.role === 'system');
    const systemPrompt = systemMsg?.content || aiConfig.systemPrompt || 'You are a helpful assistant.';

    const apiMessages = [
      { role: 'system' as const, content: systemPrompt },
      ...options.messages.filter((m) => m.role !== 'system'),
    ];

    try {
      const response = await fetch(
        `https://api.openai.com/v1/chat/completions`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          },
          body: JSON.stringify({
            model: aiConfig.model || 'gpt-4o-mini',
            messages: apiMessages,
            temperature: aiConfig.temperature || 0.7,
            max_tokens: aiConfig.maxTokens || 2048,
            top_p: aiConfig.topP || 1,
            frequency_penalty: aiConfig.frequencyPenalty || 0,
            presence_penalty: aiConfig.presencePenalty || 0,
          }),
        },
      );

      if (!response.ok) {
        const err = await response.text();
        console.error('AI API error:', err);
        throw new AppError(502, 'AI service error');
      }

      const data = await response.json() as any;
      const result: AICompletionResult = {
        content: data.choices[0]?.message?.content || '',
        usage: data.usage
          ? {
              promptTokens: data.usage.prompt_tokens,
              completionTokens: data.usage.completion_tokens,
              totalTokens: data.usage.total_tokens,
            }
          : undefined,
        model: data.model || aiConfig.model,
      };

      await this.trackUsage(chatbot.organizationId, result.usage);

      return result;
    } catch (error) {
      if (error instanceof AppError) throw error;
      console.error('AI chat error:', error);
      throw new AppError(502, 'Failed to get AI response');
    }
  }

  async streamChat(options: AIChatOptions, onChunk: (chunk: string) => void): Promise<AICompletionResult> {
    const chatbot = await prisma.chatbot.findUnique({
      where: { id: options.chatbotId, isActive: true },
      include: { aiConfig: true },
    });

    if (!chatbot?.aiConfig) throw new AppError(400, 'AI config not found');

    const { aiConfig } = chatbot;
    const systemPrompt = aiConfig.systemPrompt || 'You are a helpful assistant.';

    const apiMessages = [
      { role: 'system' as const, content: systemPrompt },
      ...options.messages.filter((m) => m.role !== 'system'),
    ];

    try {
      const response = await fetch(
        `https://api.openai.com/v1/chat/completions`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          },
          body: JSON.stringify({
            model: aiConfig.model || 'gpt-4o-mini',
            messages: apiMessages,
            temperature: aiConfig.temperature || 0.7,
            max_tokens: aiConfig.maxTokens || 2048,
            stream: true,
          }),
        },
      );

      if (!response.ok) throw new AppError(502, 'AI streaming failed');

      const reader = response.body?.getReader();
      if (!reader) throw new AppError(502, 'No response body');

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
            const content = parsed.choices[0]?.delta?.content || '';
            if (content) {
              fullContent += content;
              onChunk(content);
            }
          } catch {
            // skip parse errors
          }
        }
      }

      return { content: fullContent, model: aiConfig.model };
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(502, 'AI streaming error');
    }
  }

  private async trackUsage(organizationId: string, usage?: { promptTokens?: number; completionTokens?: number; totalTokens?: number }) {
    if (!usage) return;
    await addJob(QueueName.ANALYTICS, 'track-token-usage', {
      organizationId,
      ...usage,
      timestamp: new Date().toISOString(),
    });
  }
}

export const aiService = new AIService();
