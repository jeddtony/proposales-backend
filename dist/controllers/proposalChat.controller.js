"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProposalChatController = void 0;
const typedi_1 = require("typedi");
const proposalChat_service_1 = require("@services/proposalChat.service");
class ProposalChatController {
    constructor() {
        this.proposalChatService = typedi_1.Container.get(proposalChat_service_1.ProposalChatService);
        this.getChatHistory = async (req, res, next) => {
            try {
                const id = Number(req.params.id);
                const history = await this.proposalChatService.getChatHistory(id);
                res.status(200).json({ data: history, message: 'Chat history retrieved successfully' });
            }
            catch (error) {
                next(error);
            }
        };
        this.initializeChat = async (req, res, next) => {
            try {
                const id = Number(req.params.id);
                const firstMessage = await this.proposalChatService.initializeChat(id);
                res.status(201).json({ data: firstMessage, message: 'Chat initialized successfully' });
            }
            catch (error) {
                next(error);
            }
        };
        this.sendMessage = async (req, res, next) => {
            try {
                const id = Number(req.params.id);
                const { message } = req.body;
                const reply = await this.proposalChatService.sendMessage(id, message);
                res.status(200).json({ data: reply, message: 'Message sent successfully' });
            }
            catch (error) {
                next(error);
            }
        };
        this.getRelevantContent = async (req, res, next) => {
            try {
                const id = Number(req.params.id);
                const content = await this.proposalChatService.getRelevantContent(id);
                res.status(200).json({ data: content, message: 'Relevant content retrieved successfully' });
            }
            catch (error) {
                next(error);
            }
        };
        this.generateProposalDraft = async (req, res, next) => {
            try {
                const id = Number(req.params.id);
                const draft = await this.proposalChatService.generateProposalDraft(id);
                res.status(200).json(draft);
            }
            catch (error) {
                next(error);
            }
        };
    }
}
exports.ProposalChatController = ProposalChatController;
//# sourceMappingURL=proposalChat.controller.js.map