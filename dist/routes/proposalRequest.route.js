"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProposalRequestRoute = void 0;
const express_1 = require("express");
const proposalRequest_controller_1 = require("@controllers/proposalRequest.controller");
const proposalChat_controller_1 = require("@controllers/proposalChat.controller");
const proposalRequest_dto_1 = require("@dtos/proposalRequest.dto");
const validation_middleware_1 = require("@middlewares/validation.middleware");
const proposalesClient_1 = require("@utils/proposalesClient");
const llm_1 = require("@utils/llm");
const nanoBananaClient_1 = require("@utils/nanoBananaClient");
const uploadCareClient_1 = require("@utils/uploadCareClient");
class ProposalRequestRoute {
    constructor() {
        this.router = (0, express_1.Router)();
        this.proposalRequest = new proposalRequest_controller_1.ProposalRequestController();
        this.proposalChat = new proposalChat_controller_1.ProposalChatController();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.get('/proposal-requests', this.proposalRequest.getProposalRequests);
        this.router.get('/proposal-requests/:id', this.proposalRequest.getProposalRequestById);
        this.router.post('/proposal-requests', (0, validation_middleware_1.ValidationMiddleware)(proposalRequest_dto_1.CreateProposalRequestDto), this.proposalRequest.createProposalRequest);
        this.router.get('/proposal-requests/:id/experience-summary', this.proposalRequest.generateExperienceSummary);
        this.router.post('/proposal-requests/:id/chat/initialize', this.proposalChat.initializeChat);
        this.router.get('/proposal-requests/:id/chat', this.proposalChat.getChatHistory);
        this.router.post('/proposal-requests/:id/chat', this.proposalChat.sendMessage);
        this.router.get('/proposal-requests/:id/relevant-content', this.proposalChat.getRelevantContent);
        this.router.get('/proposal-requests/:id/proposal-draft', this.proposalChat.generateProposalDraft);
        this.router.get('/proposales/content', async (req, res, next) => {
            try {
                const { variation_id, product_id, include_archived, include_sources } = req.query;
                const data = await proposalesClient_1.proposalesClient.listContent(Object.assign(Object.assign(Object.assign(Object.assign({}, (variation_id && { variation_id })), (product_id && { product_id })), (include_archived && { include_archived: include_archived === 'true' })), (include_sources && { include_sources: include_sources === 'true' })));
                res.status(200).json(data);
            }
            catch (error) {
                next(error);
            }
        });
        this.router.get('/test/companies', async (_req, res, next) => {
            try {
                const data = await proposalesClient_1.proposalesClient.listCompanies();
                res.status(200).json(data);
            }
            catch (error) {
                next(error);
            }
        });
        this.router.post('/test/llm', async (req, res, next) => {
            try {
                const { prompt } = req.body;
                const result = await llm_1.llm.complete(prompt !== null && prompt !== void 0 ? prompt : 'Say hello!');
                res.status(200).json(result);
            }
            catch (error) {
                next(error);
            }
        });
        this.router.post('/test/generate-image', async (req, res, next) => {
            try {
                const { prompt } = req.body;
                const image = await nanoBananaClient_1.nanoBananaClient.generateImage(prompt !== null && prompt !== void 0 ? prompt : 'A beautiful sunset');
                const buffer = nanoBananaClient_1.nanoBananaClient.downloadImage(image.outputPath);
                res.setHeader('Content-Type', image.mimeType);
                res.setHeader('Content-Disposition', `attachment; filename="${image.filename}"`);
                res.send(buffer);
            }
            catch (error) {
                next(error);
            }
        });
        this.router.post('/test/generate-and-upload-image', async (req, res, next) => {
            try {
                const { prompt } = req.body;
                const image = await nanoBananaClient_1.nanoBananaClient.generateImage(prompt !== null && prompt !== void 0 ? prompt : 'A beautiful sunset');
                const buffer = nanoBananaClient_1.nanoBananaClient.downloadImage(image.outputPath);
                const uploaded = await uploadCareClient_1.uploadCareClient.uploadBuffer(buffer, image.filename, image.mimeType);
                res.status(200).json(Object.assign(Object.assign({}, uploaded), { filename: image.filename }));
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.ProposalRequestRoute = ProposalRequestRoute;
//# sourceMappingURL=proposalRequest.route.js.map