"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProposalChatService = void 0;
const tslib_1 = require("tslib");
const node_crypto_1 = require("node:crypto");
const typedi_1 = require("typedi");
const _database_1 = require("@database");
const httpException_1 = require("@/exceptions/httpException");
const proposalesClient_1 = require("@utils/proposalesClient");
const _config_1 = require("@config");
const llm_1 = require("@utils/llm");
const proposalAI_1 = require("@utils/proposalAI");
let ProposalChatService = class ProposalChatService {
    async getChatHistory(proposalRequestId) {
        return _database_1.DB.ProposalChat.findAll({
            where: { proposal_request_id: proposalRequestId },
            order: [['created_at', 'ASC']],
        });
    }
    async initializeChat(proposalRequestId) {
        const proposalRequest = await _database_1.DB.ProposalRequest.findByPk(proposalRequestId);
        if (!proposalRequest)
            throw new httpException_1.HttpException(404, 'Proposal request not found');
        const existing = await _database_1.DB.ProposalChat.findOne({ where: { proposal_request_id: proposalRequestId } });
        if (existing)
            throw new httpException_1.HttpException(409, 'Chat already initialized for this proposal request');
        const summary = await (0, proposalAI_1.generateExperienceSummary)(proposalRequest);
        return _database_1.DB.ProposalChat.create({
            proposal_request_id: proposalRequestId,
            role: 'assistant',
            message: summary,
        });
    }
    async getRelevantContent(proposalRequestId) {
        const lastAssistantMessage = await _database_1.DB.ProposalChat.findOne({
            where: { proposal_request_id: proposalRequestId, role: 'assistant' },
            order: [['created_at', 'DESC']],
        });
        if (!lastAssistantMessage)
            throw new httpException_1.HttpException(404, 'No assistant message found for this proposal request. Initialize the chat first.');
        const { data: allContent } = await proposalesClient_1.proposalesClient.listContent();
        if (allContent.length === 0)
            return [];
        const contentSummaries = allContent.map((item, index) => {
            var _a, _b;
            const title = (_a = Object.values(item.title)[0]) !== null && _a !== void 0 ? _a : '';
            const description = (_b = Object.values(item.description)[0]) !== null && _b !== void 0 ? _b : '';
            return `[${index}] product_id:${item.product_id}, variation_id:${item.variation_id} | Title: "${title}" | Description: "${description}"`;
        });
        const prompt = `You are a proposal content matcher.

Given the following event/proposal experience summary:
"""
${lastAssistantMessage.message}
"""

And the following list of available content items (indexed):
${contentSummaries.join('\n')}

Return ONLY a JSON array of the indexes of content items that are relevant to the event experience described above.
Example response: [0, 3, 7]
Return an empty array if nothing is relevant. Do not include any explanation, only the JSON array.`;
        const response = await llm_1.llm.complete(prompt);
        let relevantIndexes = [];
        try {
            const match = response.text.match(/\[[\d,\s]*\]/);
            if (match)
                relevantIndexes = JSON.parse(match[0]);
        }
        catch (_a) {
            relevantIndexes = [];
        }
        return relevantIndexes.filter(i => i >= 0 && i < allContent.length).map(i => allContent[i]);
    }
    async generateProposalDraft(proposalRequestId) {
        if (!_config_1.PROPOSALES_COMPANY_ID)
            throw new httpException_1.HttpException(500, 'PROPOSALES_COMPANY_ID is not set');
        const proposalRequest = await _database_1.DB.ProposalRequest.findByPk(proposalRequestId);
        if (!proposalRequest)
            throw new httpException_1.HttpException(404, 'Proposal request not found');
        const relevantContent = await this.getRelevantContent(proposalRequestId);
        const blocks = relevantContent.map((item) => {
            var _a, _b;
            const title = (_a = Object.values(item.title)[0]) !== null && _a !== void 0 ? _a : '';
            const imageUuids = ((_b = item.images) !== null && _b !== void 0 ? _b : []).map(img => img.uuid).filter(Boolean);
            return {
                type: 'product-block',
                uuid: (0, node_crypto_1.randomUUID)(),
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
        const { proposal } = await proposalesClient_1.proposalesClient.createProposal({
            company_id: Number(_config_1.PROPOSALES_COMPANY_ID),
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

        await proposalRequest.update({ proposal_uuid: proposal.uuid, proposal_url: proposal.url });
        const { data } = await proposalesClient_1.proposalesClient.getProposal(proposal.uuid);
        return data;
    }
    async sendMessage(proposalRequestId, userMessage) {
        const proposalRequest = await _database_1.DB.ProposalRequest.findByPk(proposalRequestId);
        if (!proposalRequest)
            throw new httpException_1.HttpException(404, 'Proposal request not found');
        await _database_1.DB.ProposalChat.create({
            proposal_request_id: proposalRequestId,
            role: 'user',
            message: userMessage,
        });
        const history = await this.getChatHistory(proposalRequestId);
        const messages = [
            {
                role: 'system',
                content: `You are an expert event and proposal consultant helping a client refine their event proposal.
The client's RFP details: ${proposalRequest.details}
Company: ${proposalRequest.company_name}
Continue the conversation naturally, answering questions and refining the proposal experience based on the client's feedback.`,
            },
            ...history.map(entry => ({
                role: entry.role,
                content: entry.message,
            })),
        ];
        const response = await llm_1.llm.chat(messages);
        return _database_1.DB.ProposalChat.create({
            proposal_request_id: proposalRequestId,
            role: 'assistant',
            message: response.text,
        });
    }
};
ProposalChatService = tslib_1.__decorate([
    (0, typedi_1.Service)()
], ProposalChatService);
exports.ProposalChatService = ProposalChatService;
//# sourceMappingURL=proposalChat.service.js.map