import Anthropic from '@anthropic-ai/sdk';
import { ANTHROPIC_API_KEY } from '@config';
import { LLMMessage, LLMProvider, LLMResponse } from '@interfaces/llm.interface';

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

    const response = await this.client.messages.create({
      model: this.model,
      max_tokens: 1024,
      system: systemMessage?.content,
      messages: conversationMessages.map(m => ({ role: m.role as 'user' | 'assistant', content: m.content })),
    });

    const block = response.content[0];
    const text = block.type === 'text' ? block.text : '';

    return { text, provider: 'claude' };
  }

  async complete(prompt: string): Promise<LLMResponse> {
    return this.chat([{ role: 'user', content: prompt }]);
  }
}
