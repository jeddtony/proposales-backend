import OpenAI from 'openai';
import { OPENAI_API_KEY } from '@config';
import { LLMMessage, LLMProvider, LLMResponse } from '@interfaces/llm.interface';

export class OpenAIProvider implements LLMProvider {
  private readonly client: OpenAI;
  private readonly model: string;

  constructor(model = 'gpt-4o-mini') {
    if (!OPENAI_API_KEY) throw new Error('OPENAI_API_KEY is not set');
    this.client = new OpenAI({ apiKey: OPENAI_API_KEY });
    this.model = model;
  }

  async chat(messages: LLMMessage[]): Promise<LLMResponse> {
    const response = await this.client.chat.completions.create({
      model: this.model,
      messages,
    });

    return {
      text: response.choices[0].message.content ?? '',
      provider: 'openai',
    };
  }

  async complete(prompt: string): Promise<LLMResponse> {
    return this.chat([{ role: 'user', content: prompt }]);
  }
}
