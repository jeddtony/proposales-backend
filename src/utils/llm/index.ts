import { DB } from '@database';
import { LLM_PROVIDER } from '@config';
import { LLMProvider } from '@interfaces/llm.interface';
import { LLMProviderOption } from '@interfaces/settings.interface';
import { OpenAIProvider } from './openaiProvider';
import { HuggingFaceProvider } from './huggingFaceProvider';
import { VercelAIProvider } from './vercelAIProvider';
import { ClaudeProvider } from './claudeProvider';

export function createLLMProvider(providerName: string): LLMProvider {
  switch (providerName) {
    case 'openai':
      return new OpenAIProvider();
    case 'huggingface':
      return new HuggingFaceProvider();
    case 'vercel-ai':
      return new VercelAIProvider();
    case 'claude':
      return new ClaudeProvider();
    default:
      throw new Error(`Unknown LLM provider "${providerName}". Valid options: openai, huggingface, vercel-ai, claude`);
  }
}

export async function getLLM(): Promise<LLMProvider> {
  const settings = await DB.Settings.findOne({ order: [['id', 'ASC']] });
  const provider: LLMProviderOption = (settings?.llm_provider as LLMProviderOption) ?? (LLM_PROVIDER as LLMProviderOption) ?? 'claude';
  return createLLMProvider(provider);
}

export { LLMProvider, LLMMessage, LLMResponse } from '@interfaces/llm.interface';
