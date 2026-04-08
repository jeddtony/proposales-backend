import { getLLM } from '@utils/llm';
import { ProposalRequest } from '@interfaces/proposalRequest.interface';
import * as ExperienceSummaryPrompt from '@prompts/experienceSummary.prompt';

export async function generateExperienceSummary(proposalRequest: ProposalRequest): Promise<string> {
  const llm = await getLLM();
  const response = await llm.chat([
    { role: 'system', content: ExperienceSummaryPrompt.system() },
    { role: 'user', content: ExperienceSummaryPrompt.user(proposalRequest) },
  ]);

  return response.text;
}
