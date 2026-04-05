"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ProposalChatController", {
    enumerable: true,
    get: function() {
        return ProposalChatController;
    }
});
const _typedi = require("typedi");
const _proposalChatservice = require("../services/proposalChat.service");
function _define_property(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
let ProposalChatController = class ProposalChatController {
    constructor(){
        _define_property(this, "proposalChatService", _typedi.Container.get(_proposalChatservice.ProposalChatService));
        _define_property(this, "getChatHistory", async (req, res, next)=>{
            try {
                const id = Number(req.params.id);
                const history = await this.proposalChatService.getChatHistory(id);
                res.status(200).json({
                    data: history,
                    message: 'Chat history retrieved successfully'
                });
            } catch (error) {
                next(error);
            }
        });
        _define_property(this, "initializeChat", async (req, res, next)=>{
            try {
                const id = Number(req.params.id);
                const firstMessage = await this.proposalChatService.initializeChat(id);
                res.status(201).json({
                    data: firstMessage,
                    message: 'Chat initialized successfully'
                });
            } catch (error) {
                next(error);
            }
        });
        _define_property(this, "sendMessage", async (req, res, next)=>{
            try {
                const id = Number(req.params.id);
                const { message } = req.body;
                const reply = await this.proposalChatService.sendMessage(id, message);
                res.status(200).json({
                    data: reply,
                    message: 'Message sent successfully'
                });
            } catch (error) {
                next(error);
            }
        });
        _define_property(this, "getRelevantContent", async (req, res, next)=>{
            try {
                const id = Number(req.params.id);
                const content = await this.proposalChatService.getRelevantContent(id);
                res.status(200).json({
                    data: content,
                    message: 'Relevant content retrieved successfully'
                });
            } catch (error) {
                next(error);
            }
        });
        _define_property(this, "generateProposalDraft", async (req, res, next)=>{
            try {
                const id = Number(req.params.id);
                const draft = await this.proposalChatService.generateProposalDraft(id);
                res.status(200).json(draft);
            } catch (error) {
                next(error);
            }
        });
    }
};

//# sourceMappingURL=proposalChat.controller.js.map