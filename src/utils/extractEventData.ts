import { getLLM } from '@utils/llm';
import { ExtractedEventData } from '@interfaces/extractedEventData.interface';
import * as ExtractEventDataPrompt from '@prompts/extractEventData.prompt';

export async function extractEventData(details: string): Promise<ExtractedEventData> {
  const llm = await getLLM();
  const response = await llm.chat([
    { role: 'system', content: ExtractEventDataPrompt.system() },
    { role: 'user', content: ExtractEventDataPrompt.user(details) },
  ]);

  const match = response.text.match(/\{[\s\S]*\}/);
  if (!match) return {};

  try {
    return JSON.parse(match[0]) as ExtractedEventData;
  } catch {
    return {};
  }
}
