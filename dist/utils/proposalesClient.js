"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get ProposalesClient () {
        return ProposalesClient;
    },
    get proposalesClient () {
        return proposalesClient;
    }
});
const _https = /*#__PURE__*/ _interop_require_wildcard(require("https"));
const _config = require("../config");
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
function _getRequireWildcardCache(nodeInterop) {
    if (typeof WeakMap !== "function") return null;
    var cacheBabelInterop = new WeakMap();
    var cacheNodeInterop = new WeakMap();
    return (_getRequireWildcardCache = function(nodeInterop) {
        return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
    })(nodeInterop);
}
function _interop_require_wildcard(obj, nodeInterop) {
    if (!nodeInterop && obj && obj.__esModule) {
        return obj;
    }
    if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
        return {
            default: obj
        };
    }
    var cache = _getRequireWildcardCache(nodeInterop);
    if (cache && cache.has(obj)) {
        return cache.get(obj);
    }
    var newObj = {
        __proto__: null
    };
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for(var key in obj){
        if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
            var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
            if (desc && (desc.get || desc.set)) {
                Object.defineProperty(newObj, key, desc);
            } else {
                newObj[key] = obj[key];
            }
        }
    }
    newObj.default = obj;
    if (cache) {
        cache.set(obj, newObj);
    }
    return newObj;
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
const BASE_HOST = 'api.proposales.com';
const BASE_PATH = '';
function httpsRequest(options, body, redirectCount = 0) {
    return new Promise((resolve, reject)=>{
        const req = _https.request(options, (res)=>{
            var _res_statusCode;
            const status = (_res_statusCode = res.statusCode) !== null && _res_statusCode !== void 0 ? _res_statusCode : 0;
            if ((status === 301 || status === 302 || status === 307 || status === 308) && res.headers.location) {
                if (redirectCount >= 5) return reject(new Error('Too many redirects'));
                const redirectUrl = new URL(res.headers.location);
                const redirectOptions = _object_spread_props(_object_spread({}, options), {
                    hostname: redirectUrl.hostname,
                    path: redirectUrl.pathname + redirectUrl.search
                });
                return resolve(httpsRequest(redirectOptions, body, redirectCount + 1));
            }
            let raw = '';
            res.on('data', (chunk)=>raw += chunk);
            res.on('end', ()=>{
                if (!raw.trim()) {
                    if (status >= 200 && status < 300) return resolve({});
                    return reject(new Error(`API error ${status}: empty response`));
                }
                let json;
                try {
                    json = JSON.parse(raw);
                } catch (unused) {
                    return reject(new Error(`Failed to parse response (status ${status}): ${raw}`));
                }
                if (status >= 200 && status < 300) {
                    resolve(json);
                } else {
                    var _ref;
                    var _json_error;
                    const message = (_ref = json === null || json === void 0 ? void 0 : (_json_error = json.error) === null || _json_error === void 0 ? void 0 : _json_error.message) !== null && _ref !== void 0 ? _ref : res.statusMessage;
                    reject(new Error(`API error ${status}: ${message}`));
                }
            });
        });
        req.on('error', reject);
        if (body) req.write(body);
        req.end();
    });
}
let ProposalesClient = class ProposalesClient {
    buildOptions(method, path, query) {
        const versionedPath = /^\/v\d+\//.test(path) ? path : `${BASE_PATH}${path}`;
        let fullPath = versionedPath;
        if (query && Object.keys(query).length > 0) {
            fullPath += `?${new URLSearchParams(query).toString()}`;
        }
        return {
            hostname: BASE_HOST,
            path: fullPath,
            method,
            headers: {
                Authorization: `Bearer ${this.token}`,
                'Content-Type': 'application/json'
            }
        };
    }
    request(method, path, options = {}) {
        const reqOptions = this.buildOptions(method, path, options.query);
        const body = options.body !== undefined ? JSON.stringify(options.body) : undefined;
        return httpsRequest(reqOptions, body);
    }
    listCompanies() {
        return this.request('GET', '/v3/companies');
    }
    createProposal(params) {
        return this.request('POST', '/v3/proposals', {
            body: params
        });
    }
    getProposal(uuid) {
        return this.request('GET', `/v3/proposals/${uuid}`);
    }
    patchProposalData(uuid, data) {
        return this.request('PATCH', `/proposals/${uuid}/data`, {
            body: {
                data
            }
        });
    }
    searchProposals(params) {
        const query = {
            company_id: String(params.company_id)
        };
        if (params.limit !== undefined) query.limit = String(params.limit);
        if (params.filter) {
            for (const [key, value] of Object.entries(params.filter)){
                query[`filter[${key}]`] = value;
            }
        }
        return this.request('GET', '/proposals/search', {
            query
        });
    }
    listContent(params = {}) {
        const query = {};
        if (params.company_id !== undefined) query.company_id = String(params.company_id);
        if (params.variation_id !== undefined) query.variation_id = params.variation_id;
        if (params.product_id !== undefined) query.product_id = params.product_id;
        if (params.include_archived !== undefined) query.include_archived = String(params.include_archived);
        if (params.include_sources !== undefined) query.include_sources = String(params.include_sources);
        return this.request('GET', '/v3/content', {
            query
        });
    }
    createContent(params) {
        return this.request('POST', '/content', {
            body: params
        });
    }
    listAttachments(companyId) {
        const query = {};
        if (companyId !== undefined) query.company_id = String(companyId);
        return this.request('GET', '/attachments', {
            query
        });
    }
    createRfp(companyId, params) {
        const options = {
            hostname: BASE_HOST,
            path: `${BASE_PATH}/inbox?company_id=${companyId}`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        };
        return httpsRequest(options, JSON.stringify(params));
    }
    constructor(){
        _define_property(this, "token", void 0);
        if (!_config.PROPOSALES_API_KEY) throw new Error('PROPOSALES_API_KEY is not set');
        this.token = _config.PROPOSALES_API_KEY;
    }
};
const proposalesClient = new ProposalesClient();

//# sourceMappingURL=proposalesClient.js.map