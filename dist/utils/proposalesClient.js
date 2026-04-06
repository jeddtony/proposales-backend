"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.proposalesClient = exports.ProposalesClient = void 0;
const tslib_1 = require("tslib");
const https = tslib_1.__importStar(require("https"));
const _config_1 = require("@config");
const BASE_HOST = 'api.proposales.com';
const BASE_PATH = '';
// --- HTTP helper ---
function httpsRequest(options, body, redirectCount = 0) {
    return new Promise((resolve, reject) => {
        const req = https.request(options, res => {
            var _a;
            const status = (_a = res.statusCode) !== null && _a !== void 0 ? _a : 0;
            if ((status === 301 || status === 302 || status === 307 || status === 308) && res.headers.location) {
                if (redirectCount >= 5)
                    return reject(new Error('Too many redirects'));
                const redirectUrl = new URL(res.headers.location);
                const redirectOptions = Object.assign(Object.assign({}, options), { hostname: redirectUrl.hostname, path: redirectUrl.pathname + redirectUrl.search });
                return resolve(httpsRequest(redirectOptions, body, redirectCount + 1));
            }
            let raw = '';
            res.on('data', chunk => (raw += chunk));
            res.on('end', () => {
                var _a, _b;
                if (!raw.trim()) {
                    if (status >= 200 && status < 300)
                        return resolve({});
                    return reject(new Error(`API error ${status}: empty response`));
                }
                let json;
                try {
                    json = JSON.parse(raw);
                }
                catch (_c) {
                    return reject(new Error(`Failed to parse response (status ${status}): ${raw}`));
                }
                if (status >= 200 && status < 300) {
                    resolve(json);
                }
                else {
                    const message = (_b = (_a = json === null || json === void 0 ? void 0 : json.error) === null || _a === void 0 ? void 0 : _a.message) !== null && _b !== void 0 ? _b : res.statusMessage;
                    reject(new Error(`API error ${status}: ${message}`));
                }
            });
        });
        req.on('error', reject);
        if (body)
            req.write(body);
        req.end();
    });
}
// --- Client ---
class ProposalesClient {
    constructor() {
        if (!_config_1.PROPOSALES_API_KEY)
            throw new Error('PROPOSALES_API_KEY is not set');
        this.token = _config_1.PROPOSALES_API_KEY;
    }
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
                'Content-Type': 'application/json',
            },
        };
    }
    request(method, path, options = {}) {
        const reqOptions = this.buildOptions(method, path, options.query);
        const body = options.body !== undefined ? JSON.stringify(options.body) : undefined;
        return httpsRequest(reqOptions, body);
    }
    // --- Companies ---
    listCompanies() {
        return this.request('GET', '/v3/companies');
    }
    // --- Proposals ---
    createProposal(params) {
        return this.request('POST', '/v3/proposals', { body: params });
    }
    getProposal(uuid) {
        return this.request('GET', `/v3/proposals/${uuid}`);
    }
    patchProposalData(uuid, data) {
        return this.request('PATCH', `/proposals/${uuid}/data`, { body: { data } });
    }
    searchProposals(params) {
        const query = { company_id: String(params.company_id) };
        if (params.limit !== undefined)
            query.limit = String(params.limit);
        if (params.filter) {
            for (const [key, value] of Object.entries(params.filter)) {
                query[`filter[${key}]`] = value;
            }
        }
        return this.request('GET', '/proposals/search', { query });
    }
    // --- Content ---
    listContent(params = {}) {
        const query = {};
        if (params.company_id !== undefined)
            query.company_id = String(params.company_id);
        if (params.variation_id !== undefined)
            query.variation_id = params.variation_id;
        if (params.product_id !== undefined)
            query.product_id = params.product_id;
        if (params.include_archived !== undefined)
            query.include_archived = String(params.include_archived);
        if (params.include_sources !== undefined)
            query.include_sources = String(params.include_sources);
        return this.request('GET', '/v3/content', { query });
    }
    createContent(params) {
        return this.request('POST', '/content', { body: params });
    }
    // --- Attachments ---
    listAttachments(companyId) {
        const query = {};
        if (companyId !== undefined)
            query.company_id = String(companyId);
        return this.request('GET', '/attachments', { query });
    }
    // --- Inbox / RFP (no auth required) ---
    createRfp(companyId, params) {
        const options = {
            hostname: BASE_HOST,
            path: `${BASE_PATH}/inbox?company_id=${companyId}`,
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
        };
        return httpsRequest(options, JSON.stringify(params));
    }
}
exports.ProposalesClient = ProposalesClient;
exports.proposalesClient = new ProposalesClient();
//# sourceMappingURL=proposalesClient.js.map