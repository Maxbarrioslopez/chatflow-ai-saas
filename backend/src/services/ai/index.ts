/**
 * Servicio de IA - AI Service
 * 
 * Orquesta las llamadas a modelos de lenguaje (LLM) usando el cliente centralizado.
 * Soporta chat simple y streaming. Proveedores: OpenAI, OpenRouter, Anthropic.
 * 
 * Orchestrates LLM calls using the centralized AI client.
 * Supports simple chat and streaming. Providers: OpenAI, OpenRouter, Anthropic.
 */
import { prisma } from '../prisma';
import { AppError } from '../../common/errors';
import { addJob, QueueName } from '../../queue';
import { callChatCompletion, callChatCompletionStream } from './chat-completions';

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
      const result = await callChatCompletion(apiMessages, {
        model: aiConfig.model || undefined,
        temperature: aiConfig.temperature || 0.7,
        maxTokens: aiConfig.maxTokens || 2048,
      });

      await this.trackUsage(chatbot.organizationId, result.usage);

      return {
        content: result.content,
        usage: result.usage,
        model: result.model,
      };
    } catch (error) {
      if (error instanceof AppError) throw error;
      console.error('AI chat error:', error instanceof Error ? error.message : '');
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
      const result = await callChatCompletionStream(apiMessages, onChunk, {
        model: aiConfig.model || undefined,
        temperature: aiConfig.temperature || 0.7,
        maxTokens: aiConfig.maxTokens || 2048,
      });

      return { content: result.content, model: result.model };
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
