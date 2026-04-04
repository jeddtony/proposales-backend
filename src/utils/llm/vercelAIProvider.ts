import { generateText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { VERCEL_AI_API_KEY } from '@config';
import { LLMMessage, LLMProvider, LLMResponse } from '@interfaces/llm.interface';

export class VercelAIProvider implements LLMProvider {
  private readonly model: ReturnType<ReturnType<typeof createOpenAI>>;

  constructor(modelId = 'gpt-4o-mini') {
    if (!VERCEL_AI_API_KEY) throw new Error('VERCEL_AI_API_KEY is not set');
    const openai = createOpenAI({ apiKey: VERCEL_AI_API_KEY });
    this.model = openai(modelId);
  }

  async chat(messages: LLMMessage[]): Promise<LLMResponse> {
    const { text } = await generateText({
      model: this.model,
      messages,
    });

    return { text, provider: 'vercel-ai' };
  }

  async complete(prompt: string): Promise<LLMResponse> {
    const { text } = await generateText({
      model: this.model,
      prompt,
    });

    return { text, provider: 'vercel-ai' };
  }
}
