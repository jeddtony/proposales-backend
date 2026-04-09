import { randomUUID } from 'node:crypto';
import { Service } from 'typedi';
import { DB } from '@database';
import { HttpException } from '@/exceptions/httpException';
import { ProposalChat } from '@interfaces/proposalChat.interface';
import { LLMMessage } from '@interfaces/llm.interface';
import { ContentItem, proposalesClient } from '@utils/proposalesClient';
import { PROPOSALES_COMPANY_ID } from '@config';
import { getLLM } from '@utils/llm';
import { generateExperienceSummary } from '@utils/proposalAI';
import * as ContentMatcherPrompt from '@prompts/contentMatcher.prompt';
import * as ProposalChatPrompt from '@prompts/proposalChat.prompt';

@Service()
export class ProposalChatService {
  public async getChatHistory(proposalRequestId: number): Promise<ProposalChat[]> {
    return DB.ProposalChat.findAll({
      where: { proposal_request_id: proposalRequestId },
      order: [['created_at', 'ASC']],
    });
  }

  public async initializeChat(proposalRequestId: number): Promise<ProposalChat> {
    const proposalRequest = await DB.ProposalRequest.findByPk(proposalRequestId);
    if (!proposalRequest) throw new HttpException(404, 'Proposal request not found');

    const existing = await DB.ProposalChat.findOne({ where: { proposal_request_id: proposalRequestId } });
    if (existing) throw new HttpException(409, 'Chat already initialized for this proposal request');

    const summary = await generateExperienceSummary(proposalRequest);

    return DB.ProposalChat.create({
      proposal_request_id: proposalRequestId,
      role: 'assistant',
      message: summary,
    });
  }

  public async getRelevantContent(proposalRequestId: number): Promise<ContentItem[]> {
    const history = await this.getChatHistory(proposalRequestId);

    if (history.length === 0) throw new HttpException(404, 'No chat history found for this proposal request. Initialize the chat first.');

    const { data: allContent } = await proposalesClient.listContent();

    if (allContent.length === 0) return [];

    const contentSummaries = allContent.map((item, index) => {
      const title = Object.values(item.title)[0] ?? '';
      const description = Object.values(item.description)[0] ?? '';
      return `[${index}] product_id:${item.product_id}, variation_id:${item.variation_id} | Title: "${title}" | Description: "${description}"`;
    });

    const chatHistory = history.map(entry => `${entry.role === 'assistant' ? 'Assistant' : 'Client'}: ${entry.message}`).join('\n\n');

    const prompt = ContentMatcherPrompt.user({
      chatHistory,
      contentSummaries,
    });

    const llm = await getLLM();
    const response = await llm.complete(prompt);

    let relevantIndexes: number[] = [];
    try {
      const match = response.text.match(/\[[\d,\s]*\]/);
      if (match) relevantIndexes = JSON.parse(match[0]);
    } catch {
      relevantIndexes = [];
    }

    return relevantIndexes.filter(i => i >= 0 && i < allContent.length).map(i => allContent[i]);
  }

  public async generateProposalDraft(proposalRequestId: number): Promise<Record<string, unknown>> {
    if (!PROPOSALES_COMPANY_ID) throw new HttpException(500, 'PROPOSALES_COMPANY_ID is not set');

    const proposalRequest = await DB.ProposalRequest.findByPk(proposalRequestId);
    if (!proposalRequest) throw new HttpException(404, 'Proposal request not found');

    const relevantContent = await this.getRelevantContent(proposalRequestId);

    const blocks = relevantContent.map((item: ContentItem) => {
      const title = Object.values(item.title)[0] ?? '';
      const imageUuids = (item.images ?? []).map(img => img.uuid).filter(Boolean);

      return {
        type: 'product-block',
        uuid: randomUUID(),
        title,
        currency: 'EUR',
        language: 'en',
        content_id: item.variation_id,
        unit: 'person',
        image_uuids: imageUuids,
        package_split: [
          {
            vat: 0,
            type: 'other',
            fixed: false,
            value_with_tax: 0,
            enable_discount: true,
            value_without_tax: 0,
            value_saved_with_tax: false,
          },
        ],
      };
    });

    const { proposal } = await proposalesClient.createProposal({
      company_id: Number(PROPOSALES_COMPANY_ID),
      language: 'en',
      title_md: `Proposal for ${proposalRequest.company_name}`,
      description_md: proposalRequest.details,
      recipient: {
        first_name: proposalRequest.name,
        email: proposalRequest.email,
        phone: proposalRequest.phone_number,
        company_name: proposalRequest.company_name,
      },
      tax_options: { mode: 'standard', tax_included: false },
      blocks,
    });

    await proposalRequest.update({ proposal_uuid: proposal.uuid, proposal_url: proposal.url, proposal_generated_at: new Date() });

    const { data } = await proposalesClient.getProposal(proposal.uuid);

    return data as unknown as Record<string, unknown>;
  }

  public async sendMessage(proposalRequestId: number, userMessage: string): Promise<ProposalChat> {
    const proposalRequest = await DB.ProposalRequest.findByPk(proposalRequestId);
    if (!proposalRequest) throw new HttpException(404, 'Proposal request not found');

    await DB.ProposalChat.create({
      proposal_request_id: proposalRequestId,
      role: 'user',
      message: userMessage,
    });

    const history = await this.getChatHistory(proposalRequestId);

    const messages: LLMMessage[] = [
      {
        role: 'system',
        content: ProposalChatPrompt.system({ details: proposalRequest.details, company_name: proposalRequest.company_name }),
      },
      ...history.map(entry => ({
        role: entry.role as 'user' | 'assistant',
        content: entry.message,
      })),
    ];

    const llm = await getLLM();
    const response = await llm.chat(messages);

    return DB.ProposalChat.create({
      proposal_request_id: proposalRequestId,
      role: 'assistant',
      message: response.text,
    });
  }
}
