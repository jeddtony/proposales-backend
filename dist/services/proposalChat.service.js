"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ProposalChatService", {
    enumerable: true,
    get: function() {
        return ProposalChatService;
    }
});
const _nodecrypto = require("node:crypto");
const _typedi = require("typedi");
const _database = require("../database");
const _httpException = require("../exceptions/httpException");
const _proposalesClient = require("../utils/proposalesClient");
const _config = require("../config");
const _llm = require("../utils/llm");
const _proposalAI = require("../utils/proposalAI");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let ProposalChatService = class ProposalChatService {
    async getChatHistory(proposalRequestId) {
        return _database.DB.ProposalChat.findAll({
            where: {
                proposal_request_id: proposalRequestId
            },
            order: [
                [
                    'created_at',
                    'ASC'
                ]
            ]
        });
    }
    async initializeChat(proposalRequestId) {
        const proposalRequest = await _database.DB.ProposalRequest.findByPk(proposalRequestId);
        if (!proposalRequest) throw new _httpException.HttpException(404, 'Proposal request not found');
        const existing = await _database.DB.ProposalChat.findOne({
            where: {
                proposal_request_id: proposalRequestId
            }
        });
        if (existing) throw new _httpException.HttpException(409, 'Chat already initialized for this proposal request');
        const summary = await (0, _proposalAI.generateExperienceSummary)(proposalRequest);
        return _database.DB.ProposalChat.create({
            proposal_request_id: proposalRequestId,
            role: 'assistant',
            message: summary
        });
    }
    async getRelevantContent(proposalRequestId) {
        const lastAssistantMessage = await _database.DB.ProposalChat.findOne({
            where: {
                proposal_request_id: proposalRequestId,
                role: 'assistant'
            },
            order: [
                [
                    'created_at',
                    'DESC'
                ]
            ]
        });
        if (!lastAssistantMessage) throw new _httpException.HttpException(404, 'No assistant message found for this proposal request. Initialize the chat first.');
        const { data: allContent } = await _proposalesClient.proposalesClient.listContent();
        if (allContent.length === 0) return [];
        const contentSummaries = allContent.map((item, index)=>{
            var _Object_values_, _Object_values_1;
            const title = (_Object_values_ = Object.values(item.title)[0]) !== null && _Object_values_ !== void 0 ? _Object_values_ : '';
            const description = (_Object_values_1 = Object.values(item.description)[0]) !== null && _Object_values_1 !== void 0 ? _Object_values_1 : '';
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
        const response = await _llm.llm.complete(prompt);
        let relevantIndexes = [];
        try {
            const match = response.text.match(/\[[\d,\s]*\]/);
            if (match) relevantIndexes = JSON.parse(match[0]);
        } catch (unused) {
            relevantIndexes = [];
        }
        return relevantIndexes.filter((i)=>i >= 0 && i < allContent.length).map((i)=>allContent[i]);
    }
    async generateProposalDraft(proposalRequestId) {
        if (!_config.PROPOSALES_COMPANY_ID) throw new _httpException.HttpException(500, 'PROPOSALES_COMPANY_ID is not set');
        const proposalRequest = await _database.DB.ProposalRequest.findByPk(proposalRequestId);
        if (!proposalRequest) throw new _httpException.HttpException(404, 'Proposal request not found');
        const relevantContent = await this.getRelevantContent(proposalRequestId);
        const blocks = relevantContent.map((item)=>{
            var _Object_values_, _item_images;
            const title = (_Object_values_ = Object.values(item.title)[0]) !== null && _Object_values_ !== void 0 ? _Object_values_ : '';
            const imageUuids = ((_item_images = item.images) !== null && _item_images !== void 0 ? _item_images : []).map((img)=>img.uuid).filter(Boolean);
            return {
                type: 'product-block',
                uuid: (0, _nodecrypto.randomUUID)(),
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
                        value_saved_with_tax: false
                    }
                ]
            };
        });
        const { proposal } = await _proposalesClient.proposalesClient.createProposal({
            company_id: Number(_config.PROPOSALES_COMPANY_ID),
            language: 'en',
            title_md: `Proposal for ${proposalRequest.company_name}`,
            description_md: proposalRequest.details,
            recipient: {
                first_name: proposalRequest.name,
                email: proposalRequest.email,
                phone: proposalRequest.phone_number,
                company_name: proposalRequest.company_name
            },
            tax_options: {
                mode: 'standard',
                tax_included: false
            },
            blocks
        });
        await proposalRequest.update({
            proposal_uuid: proposal.uuid
        });
        const { data } = await _proposalesClient.proposalesClient.getProposal(proposal.uuid);
        return data;
    }
    async sendMessage(proposalRequestId, userMessage) {
        const proposalRequest = await _database.DB.ProposalRequest.findByPk(proposalRequestId);
        if (!proposalRequest) throw new _httpException.HttpException(404, 'Proposal request not found');
        await _database.DB.ProposalChat.create({
            proposal_request_id: proposalRequestId,
            role: 'user',
            message: userMessage
        });
        const history = await this.getChatHistory(proposalRequestId);
        const messages = [
            {
                role: 'system',
                content: `You are an expert event and proposal consultant helping a client refine their event proposal.
The client's RFP details: ${proposalRequest.details}
Company: ${proposalRequest.company_name}
Continue the conversation naturally, answering questions and refining the proposal experience based on the client's feedback.`
            },
            ...history.map((entry)=>({
                    role: entry.role,
                    content: entry.message
                }))
        ];
        const response = await _llm.llm.chat(messages);
        return _database.DB.ProposalChat.create({
            proposal_request_id: proposalRequestId,
            role: 'assistant',
            message: response.text
        });
    }
};
ProposalChatService = _ts_decorate([
    (0, _typedi.Service)()
], ProposalChatService);

//# sourceMappingURL=proposalChat.service.js.map