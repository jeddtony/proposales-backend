"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProposalRequestService = void 0;
const tslib_1 = require("tslib");
const typedi_1 = require("typedi");
const _database_1 = require("@database");
const httpException_1 = require("@/exceptions/httpException");
let ProposalRequestService = class ProposalRequestService {
    async getProposalRequests() {
        return _database_1.DB.ProposalRequest.findAll();
    }
    async getProposalRequestById(id) {
        const record = await _database_1.DB.ProposalRequest.findByPk(id);
        if (!record)
            throw new httpException_1.HttpException(404, 'Proposal request not found');
        return record;
    }
    async createProposalRequest(data) {
        return _database_1.DB.ProposalRequest.create(Object.assign({}, data));
    }
};
ProposalRequestService = tslib_1.__decorate([
    (0, typedi_1.Service)()
], ProposalRequestService);
exports.ProposalRequestService = ProposalRequestService;
//# sourceMappingURL=proposalRequest.service.js.map