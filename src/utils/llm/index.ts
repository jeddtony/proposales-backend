import { LLM_PROVIDER } from '@config';
import { LLMProvider } from '@interfaces/llm.interface';
import { OpenAIProvider } from './openaiProvider';
import { HuggingFaceProvider } from './huggingFaceProvider';
import { VercelAIProvider } from './vercelAIProvider';
import { ClaudeProvider } from './claudeProvider';

function createLLMProvider(): LLMProvider {
  switch (LLM_PROVIDER) {
    case 'openai':
      return new OpenAIProvider();
    case 'huggingface':
      return new HuggingFaceProvider();
    case 'vercel-ai':
      return new VercelAIProvider();
    case 'claude':
      return new ClaudeProvider();
    default:
      throw new Error(`Unknown LLM_PROVIDER "${LLM_PROVIDER}". Valid options: openai, huggingface, vercel-ai, claude`);
  }
}

export const llm: LLMProvider = createLLMProvider();
export { LLMProvider, LLMMessage, LLMResponse } from '@interfaces/llm.interface';
