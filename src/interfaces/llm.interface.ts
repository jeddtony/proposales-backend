export interface LLMMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface LLMResponse {
  text: string;
  provider: string;
}

export interface LLMProvider {
  chat(messages: LLMMessage[]): Promise<LLMResponse>;
  complete(prompt: string): Promise<LLMResponse>;
}
