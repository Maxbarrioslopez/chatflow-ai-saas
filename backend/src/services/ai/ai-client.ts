import { config } from '../../config';

export function getAIConfig() {
  const provider = config.ai.provider || 'openai';

  switch (provider) {
    case 'openrouter':
      return {
        baseUrl: 'https://openrouter.ai/api/v1',
        apiKey: config.ai.openrouterKey || '',
        defaultModel: config.ai.chatModel || 'openrouter/free',
        headers: {
          'HTTP-Referer': 'https://chatmbl.ai',
          'X-Title': 'ChatMBL AI SaaS',
        },
      };
    case 'openai':
    default:
      return {
        baseUrl: 'https://api.openai.com/v1',
        apiKey: config.ai.openaiKey || '',
        defaultModel: config.ai.chatModel || 'gpt-4o-mini',
        headers: {} as Record<string, string>,
      };
  }
}
