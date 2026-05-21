import { prisma } from '../../services/prisma';
import { AppError } from '../../common/errors';
import { ragService } from '../../services/rag';
import { moderationService } from '../../services/moderation';
import { callChatCompletion } from '../../services/ai/chat-completions';
import { v4 as uuid } from 'uuid';

export class ChatService {
  async sendMessage(
    chatbotId: string,
    message: string,
    conversationId?: string,
    visitorId?: string,
    organizationId?: string,
  ) {
    const chatbot = await prisma.chatbot.findUnique({
      where: { id: chatbotId, isActive: true },
      include: { behavior: true, aiConfig: true },
    });
    if (!chatbot) throw new AppError(404, 'Chatbot not found');

    const orgId = organizationId || chatbot.organizationId;
    const visitor = visitorId || uuid();

    let conversation;
    if (conversationId) {
      conversation = await prisma.conversation.findFirst({
        where: { id: conversationId, chatbotId, status: 'active' },
      });
    }

    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: { chatbotId, visitorId: visitor, status: 'active' },
      });
    }

    await prisma.message.create({
      data: {
        conversationId: conversation.id,
        role: 'user',
        content: message,
      },
    });

    const moderationResult = await moderationService.checkMessage(orgId, chatbotId, message, conversation.id);

    if (moderationResult.blocked) {
      const blockedMsg = 'Your message contains content not allowed by this assistant. Please rephrase.';
      await prisma.message.create({
        data: { conversationId: conversation.id, role: 'assistant', content: blockedMsg },
      });
      return { message: { id: 'blocked', role: 'assistant', content: blockedMsg }, conversationId: conversation.id };
    }

    const effectiveMessage = moderationResult.sanitizedText || message;
    const aiResponse = await this.callAI(chatbot, effectiveMessage, orgId);

    const assistantMessage = await prisma.message.create({
      data: {
        conversationId: conversation.id,
        role: 'assistant',
        content: aiResponse,
      },
    });

    await prisma.conversation.update({
      where: { id: conversation.id },
      data: { messageCount: { increment: 1 } },
    });

    if (chatbot.behavior?.collectLeadInfo) {
      await this.checkLeadCapture(conversation.id, chatbotId, message, visitor);
    }

    return {
      message: assistantMessage,
      conversationId: conversation.id,
    };
  }

  async createSession(chatbotId: string) {
    const chatbot = await prisma.chatbot.findUnique({
      where: { id: chatbotId, isActive: true },
    });
    if (!chatbot) throw new AppError(404, 'Chatbot not found');

    return {
      chatbotId,
      sessionId: uuid(),
      expiresAt: new Date(Date.now() + 3600000).toISOString(),
    };
  }

  async getWidgetConfig(widgetToken: string) {
    const chatbot = await prisma.chatbot.findFirst({
      where: { widgetToken, isActive: true },
      include: { appearance: true, behavior: true },
    });

    if (!chatbot) throw new AppError(404, 'Chatbot not found');

    return {
      id: chatbot.id,
      name: chatbot.name,
      organizationId: chatbot.organizationId,
      appearance: chatbot.appearance,
      behavior: chatbot.behavior
        ? {
            initialMessage: chatbot.behavior.initialMessage,
            suggestedMessages: chatbot.behavior.suggestedMessages,
            showTypingIndicator: chatbot.behavior.showTypingIndicator,
            enableFeedback: chatbot.behavior.enableFeedback,
            collectLeadInfo: chatbot.behavior.collectLeadInfo,
          }
        : null,
    };
  }

  private async callAI(chatbot: any, message: string, organizationId: string): Promise<string> {
    const { aiConfig } = chatbot;
    if (!aiConfig) return 'I am processing your request. Please wait...';

    const conversation = await prisma.conversation.findFirst({
      where: { chatbotId: chatbot.id, status: 'active' },
      include: {
        messages: { orderBy: { createdAt: 'desc' }, take: 10 },
      },
    });

    const history = (conversation?.messages || []).reverse().map((m: any) => ({
      role: m.role,
      content: m.content,
    }));

    let systemPrompt = aiConfig.systemPrompt || 'You are a helpful assistant.';

    try {
      const augmentedPrompt = await ragService.augmentPrompt(
        chatbot.id,
        organizationId,
        message,
        systemPrompt,
      );

      if (augmentedPrompt !== systemPrompt) {
        systemPrompt = augmentedPrompt;
      }
    } catch {
      // RAG augmentation failed, continue with base prompt
    }

    const messages = [
      { role: 'system', content: systemPrompt },
      ...history,
      { role: 'user', content: message },
    ];

    try {
      const result = await callChatCompletion(messages, {
        model: aiConfig.model || undefined,
        temperature: aiConfig.temperature || 0.7,
        maxTokens: aiConfig.maxTokens || 2048,
      });

      if (result.usage) {
        await prisma.tokenUsage.create({
          data: {
            organizationId,
            chatbotId: chatbot.id,
            promptTokens: result.usage.promptTokens,
            completionTokens: result.usage.completionTokens,
            totalTokens: result.usage.totalTokens,
            model: result.model || aiConfig.model || 'unknown',
            cost: (result.usage.totalTokens / 1000000) * 3,
          },
        });
      }

      return result.content || chatbot.behavior?.fallbackMessage || 'No response generated.';
    } catch (error) {
      console.error('AI call failed:', error instanceof Error ? error.message : '');
      return chatbot.behavior?.fallbackMessage || "I'm sorry, something went wrong. Please try again.";
    }
  }

  private async checkLeadCapture(conversationId: string, chatbotId: string, message: string, visitorId: string) {
    const existingLead = await prisma.lead.findFirst({
      where: { chatbotId, conversationId },
    });

    if (existingLead) return;

    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
    const phoneRegex = /\b(\+?\d{1,3}[\s-]?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}\b/;
    const nameRegex = /(?:my name is|i'?m|call me)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/i;

    const email = message.match(emailRegex)?.[0];
    const phone = message.match(phoneRegex)?.[0];
    const nameMatch = message.match(nameRegex);
    const name = nameMatch?.[1];

    if (email || phone || name) {
      await prisma.lead.create({
        data: {
          chatbotId,
          conversationId,
          name,
          email,
          phone,
          source: 'chatbot',
          status: 'new',
        },
      });
    }
  }
}
