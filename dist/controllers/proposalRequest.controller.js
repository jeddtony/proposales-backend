"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProposalRequestController = void 0;
const typedi_1 = require("typedi");
const proposalRequest_service_1 = require("@services/proposalRequest.service");
const proposalAI_1 = require("@utils/proposalAI");
class ProposalRequestController {
    constructor() {
        this.proposalRequestService = typedi_1.Container.get(proposalRequest_service_1.ProposalRequestService);
        this.getProposalRequests = async (_req, res, next) => {
            try {
                const records = await this.proposalRequestService.getProposalRequests();
                res.status(200).json({ data: records, message: 'Proposal requests retrieved successfully' });
            }
            catch (error) {
                next(error);
            }
        };
        this.getProposalRequestById = async (req, res, next) => {
            try {
                const id = Number(req.params.id);
                const record = await this.proposalRequestService.getProposalRequestById(id);
                res.status(200).json({ data: record, message: 'Proposal request retrieved successfully' });
            }
            catch (error) {
                next(error);
            }
        };
        this.createProposalRequest = async (req, res, next) => {
            try {
                const data = req.body;
                const created = await this.proposalRequestService.createProposalRequest(data);
                res.status(201).json({ data: created, message: 'Proposal request submitted successfully' });
            }
            catch (error) {
                next(error);
            }
        };
        this.generateExperienceSummary = async (req, res, next) => {
            try {
                const id = Number(req.params.id);
                const proposalRequest = await this.proposalRequestService.getProposalRequestById(id);
                const summary = await (0, proposalAI_1.generateExperienceSummary)(proposalRequest);
                res.status(200).json({ data: { summary }, message: 'Experience summary generated successfully' });
            }
            catch (error) {
                next(error);
            }
        };
    }
}
exports.ProposalRequestController = ProposalRequestController;
//# sourceMappingURL=proposalRequest.controller.js.map