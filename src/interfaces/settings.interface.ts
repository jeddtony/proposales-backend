export type LLMProviderOption = 'claude' | 'openai' | 'huggingface' | 'vercel-ai';

export interface Settings {
  id: number;
  llm_provider: LLMProviderOption;
  created_at?: Date;
  updated_at?: Date;
}
