"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadCareClient = exports.UploadCareClient = void 0;
const tslib_1 = require("tslib");
const axios_1 = tslib_1.__importDefault(require("axios"));
const form_data_1 = tslib_1.__importDefault(require("form-data"));
const _config_1 = require("@config");
const UPLOAD_URL = 'https://upload.uploadcare.com/base/';
const CDN_BASE = 'https://16r3itju75.ucarecd.net';
class UploadCareClient {
    constructor() {
        if (!_config_1.UPLOADCARE_PUB_KEY)
            throw new Error('UPLOADCARE_PUB_KEY is not set');
        this.pubKey = _config_1.UPLOADCARE_PUB_KEY;
    }
    async uploadBuffer(buffer, filename, mimeType) {
        const form = new form_data_1.default();
        form.append('UPLOADCARE_PUB_KEY', this.pubKey);
        form.append('UPLOADCARE_STORE', '1');
        form.append('file', buffer, { filename, contentType: mimeType });
        const response = await axios_1.default.post(UPLOAD_URL, form, {
            headers: form.getHeaders(),
        });
        const uuid = response.data.file;
        const url = `${CDN_BASE}/${uuid}/`;
        return { uuid, url };
    }
}
exports.UploadCareClient = UploadCareClient;
exports.uploadCareClient = new UploadCareClient();
//# sourceMappingURL=uploadCareClient.js.map