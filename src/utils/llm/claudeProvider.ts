import Anthropic from '@anthropic-ai/sdk';
import { ANTHROPIC_API_KEY } from '@config';
import { LLMMessage, LLMProvider, LLMResponse } from '@interfaces/llm.interface';

const MAX_RETRIES = 3;
const BASE_DELAY_MS = 2000;

async function withRetry<T>(fn: () => Promise<T>): Promise<T> {
  let lastError: unknown;
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      const isOverloaded =
        err instanceof Anthropic.APIError && (err.status === 529 || (err as any)?.error?.error?.type === 'overloaded_error');
      const isRateLimit = err instanceof Anthropic.APIError && err.status === 429;

      if ((isOverloaded || isRateLimit) && attempt < MAX_RETRIES) {
        const delay = BASE_DELAY_MS * Math.pow(2, attempt);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      throw err;
    }
  }
  throw lastError;
}

export class ClaudeProvider implements LLMProvider {
  private readonly client: Anthropic;
  private readonly model: string;

  constructor(model = 'claude-sonnet-4-6') {
    if (!ANTHROPIC_API_KEY) throw new Error('ANTHROPIC_API_KEY is not set');
    this.client = new Anthropic({ apiKey: ANTHROPIC_API_KEY });
    this.model = model;
  }

  async chat(messages: LLMMessage[]): Promise<LLMResponse> {
    const systemMessage = messages.find(m => m.role === 'system');
    const conversationMessages = messages.filter(m => m.role !== 'system');

    const response = await withRetry(() =>
      this.client.messages.create({
        model: this.model,
        max_tokens: 1024,
        system: systemMessage?.content,
        messages: conversationMessages.map(m => ({ role: m.role as 'user' | 'assistant', content: m.content })),
      }),
    );

    const block = response.content[0];
    const text = block.type === 'text' ? block.text : '';

    return { text, provider: 'claude' };
  }

  async complete(prompt: string): Promise<LLMResponse> {
    return this.chat([{ role: 'user', content: prompt }]);
  }
}
