"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ProposalRequestService", {
    enumerable: true,
    get: function() {
        return ProposalRequestService;
    }
});
const _typedi = require("typedi");
const _database = require("../database");
const _httpException = require("../exceptions/httpException");
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
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let ProposalRequestService = class ProposalRequestService {
    async getProposalRequests() {
        return _database.DB.ProposalRequest.findAll();
    }
    async getProposalRequestById(id) {
        const record = await _database.DB.ProposalRequest.findByPk(id);
        if (!record) throw new _httpException.HttpException(404, 'Proposal request not found');
        return record;
    }
    async createProposalRequest(data) {
        return _database.DB.ProposalRequest.create(_object_spread({}, data));
    }
};
ProposalRequestService = _ts_decorate([
    (0, _typedi.Service)()
], ProposalRequestService);

//# sourceMappingURL=proposalRequest.service.js.map