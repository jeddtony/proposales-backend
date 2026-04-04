import { InferenceClient } from '@huggingface/inference';
import { HUGGINGFACE_API_KEY } from '@config';
import { LLMMessage, LLMProvider, LLMResponse } from '@interfaces/llm.interface';

export class HuggingFaceProvider implements LLMProvider {
  private readonly client: InferenceClient;
  private readonly model: string;

  constructor(model = 'meta-llama/Llama-3.1-8B-Instruct') {
    if (!HUGGINGFACE_API_KEY) throw new Error('HUGGINGFACE_API_KEY is not set');
    this.client = new InferenceClient(HUGGINGFACE_API_KEY);
    this.model = model;
  }

  async chat(messages: LLMMessage[]): Promise<LLMResponse> {
    const response = await this.client.chatCompletion({
      model: this.model,
      messages,
    });

    return {
      text: response.choices[0].message.content ?? '',
      provider: 'huggingface',
    };
  }

  async complete(prompt: string): Promise<LLMResponse> {
    return this.chat([{ role: 'user', content: prompt }]);
  }
}
