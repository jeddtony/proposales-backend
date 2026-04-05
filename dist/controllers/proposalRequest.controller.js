"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ProposalRequestController", {
    enumerable: true,
    get: function() {
        return ProposalRequestController;
    }
});
const _typedi = require("typedi");
const _proposalRequestservice = require("../services/proposalRequest.service");
const _proposalAI = require("../utils/proposalAI");
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
let ProposalRequestController = class ProposalRequestController {
    constructor(){
        _define_property(this, "proposalRequestService", _typedi.Container.get(_proposalRequestservice.ProposalRequestService));
        _define_property(this, "getProposalRequests", async (_req, res, next)=>{
            try {
                const records = await this.proposalRequestService.getProposalRequests();
                res.status(200).json({
                    data: records,
                    message: 'Proposal requests retrieved successfully'
                });
            } catch (error) {
                next(error);
            }
        });
        _define_property(this, "getProposalRequestById", async (req, res, next)=>{
            try {
                const id = Number(req.params.id);
                const record = await this.proposalRequestService.getProposalRequestById(id);
                res.status(200).json({
                    data: record,
                    message: 'Proposal request retrieved successfully'
                });
            } catch (error) {
                next(error);
            }
        });
        _define_property(this, "createProposalRequest", async (req, res, next)=>{
            try {
                const data = req.body;
                const created = await this.proposalRequestService.createProposalRequest(data);
                res.status(201).json({
                    data: created,
                    message: 'Proposal request submitted successfully'
                });
            } catch (error) {
                next(error);
            }
        });
        _define_property(this, "generateExperienceSummary", async (req, res, next)=>{
            try {
                const id = Number(req.params.id);
                const proposalRequest = await this.proposalRequestService.getProposalRequestById(id);
                const summary = await (0, _proposalAI.generateExperienceSummary)(proposalRequest);
                res.status(200).json({
                    data: {
                        summary
                    },
                    message: 'Experience summary generated successfully'
                });
            } catch (error) {
                next(error);
            }
        });
    }
};

//# sourceMappingURL=proposalRequest.controller.js.map