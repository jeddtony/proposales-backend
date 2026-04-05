"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ProposalRequestRoute", {
    enumerable: true,
    get: function() {
        return ProposalRequestRoute;
    }
});
const _express = require("express");
const _proposalRequestcontroller = require("../controllers/proposalRequest.controller");
const _proposalChatcontroller = require("../controllers/proposalChat.controller");
const _proposalRequestdto = require("../dtos/proposalRequest.dto");
const _validationmiddleware = require("../middlewares/validation.middleware");
const _proposalesClient = require("../utils/proposalesClient");
const _llm = require("../utils/llm");
const _nanoBananaClient = require("../utils/nanoBananaClient");
const _uploadCareClient = require("../utils/uploadCareClient");
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
function _object_spread(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = arguments[i] != null ? arguments[i] : {};
        var ownKeys = Object.keys(source);
        if (typeof Object.getOwnPropertySymbols === "function") {
            ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
                return Object.getOwnPropertyDescriptor(source, sym).enumerable;
            }));
        }
        ownKeys.forEach(function(key) {
            _define_property(target, key, source[key]);
        });
    }
    return target;
}
function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);
    if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(object);
        if (enumerableOnly) {
            symbols = symbols.filter(function(sym) {
                return Object.getOwnPropertyDescriptor(object, sym).enumerable;
            });
        }
        keys.push.apply(keys, symbols);
    }
    return keys;
}
function _object_spread_props(target, source) {
    source = source != null ? source : {};
    if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
        ownKeys(Object(source)).forEach(function(key) {
            Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
    }
    return target;
}
let ProposalRequestRoute = class ProposalRequestRoute {
    initializeRoutes() {
        this.router.get('/proposal-requests', this.proposalRequest.getProposalRequests);
        this.router.get('/proposal-requests/:id', this.proposalRequest.getProposalRequestById);
        this.router.post('/proposal-requests', (0, _validationmiddleware.ValidationMiddleware)(_proposalRequestdto.CreateProposalRequestDto), this.proposalRequest.createProposalRequest);
        this.router.get('/proposal-requests/:id/experience-summary', this.proposalRequest.generateExperienceSummary);
        this.router.post('/proposal-requests/:id/chat/initialize', this.proposalChat.initializeChat);
        this.router.get('/proposal-requests/:id/chat', this.proposalChat.getChatHistory);
        this.router.post('/proposal-requests/:id/chat', this.proposalChat.sendMessage);
        this.router.get('/proposal-requests/:id/relevant-content', this.proposalChat.getRelevantContent);
        this.router.get('/proposal-requests/:id/proposal-draft', this.proposalChat.generateProposalDraft);
        this.router.get('/proposales/content', async (req, res, next)=>{
            try {
                const { variation_id, product_id, include_archived, include_sources } = req.query;
                const data = await _proposalesClient.proposalesClient.listContent(_object_spread({}, variation_id && {
                    variation_id
                }, product_id && {
                    product_id
                }, include_archived && {
                    include_archived: include_archived === 'true'
                }, include_sources && {
                    include_sources: include_sources === 'true'
                }));
                res.status(200).json(data);
            } catch (error) {
                next(error);
            }
        });
        this.router.get('/test/companies', async (_req, res, next)=>{
            try {
                const data = await _proposalesClient.proposalesClient.listCompanies();
                res.status(200).json(data);
            } catch (error) {
                next(error);
            }
        });
        this.router.post('/test/llm', async (req, res, next)=>{
            try {
                const { prompt } = req.body;
                const result = await _llm.llm.complete(prompt !== null && prompt !== void 0 ? prompt : 'Say hello!');
                res.status(200).json(result);
            } catch (error) {
                next(error);
            }
        });
        this.router.post('/test/generate-image', async (req, res, next)=>{
            try {
                const { prompt } = req.body;
                const image = await _nanoBananaClient.nanoBananaClient.generateImage(prompt !== null && prompt !== void 0 ? prompt : 'A beautiful sunset');
                const buffer = _nanoBananaClient.nanoBananaClient.downloadImage(image.outputPath);
                res.setHeader('Content-Type', image.mimeType);
                res.setHeader('Content-Disposition', `attachment; filename="${image.filename}"`);
                res.send(buffer);
            } catch (error) {
                next(error);
            }
        });
        this.router.post('/test/generate-and-upload-image', async (req, res, next)=>{
            try {
                const { prompt } = req.body;
                const image = await _nanoBananaClient.nanoBananaClient.generateImage(prompt !== null && prompt !== void 0 ? prompt : 'A beautiful sunset');
                const buffer = _nanoBananaClient.nanoBananaClient.downloadImage(image.outputPath);
                const uploaded = await _uploadCareClient.uploadCareClient.uploadBuffer(buffer, image.filename, image.mimeType);
                res.status(200).json(_object_spread_props(_object_spread({}, uploaded), {
                    filename: image.filename
                }));
            } catch (error) {
                next(error);
            }
        });
    }
    constructor(){
        _define_property(this, "router", (0, _express.Router)());
        _define_property(this, "proposalRequest", new _proposalRequestcontroller.ProposalRequestController());
        _define_property(this, "proposalChat", new _proposalChatcontroller.ProposalChatController());
        this.initializeRoutes();
    }
};

//# sourceMappingURL=proposalRequest.route.js.map