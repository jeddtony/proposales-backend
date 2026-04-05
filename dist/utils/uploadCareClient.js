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
    get UploadCareClient () {
        return UploadCareClient;
    },
    get uploadCareClient () {
        return uploadCareClient;
    }
});
const _axios = /*#__PURE__*/ _interop_require_default(require("axios"));
const _formdata = /*#__PURE__*/ _interop_require_default(require("form-data"));
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
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const UPLOAD_URL = 'https://upload.uploadcare.com/base/';
const CDN_BASE = 'https://16r3itju75.ucarecd.net';
let UploadCareClient = class UploadCareClient {
    async uploadBuffer(buffer, filename, mimeType) {
        const form = new _formdata.default();
        form.append('UPLOADCARE_PUB_KEY', this.pubKey);
        form.append('UPLOADCARE_STORE', '1');
        form.append('file', buffer, {
            filename,
            contentType: mimeType
        });
        const response = await _axios.default.post(UPLOAD_URL, form, {
            headers: form.getHeaders()
        });
        const uuid = response.data.file;
        const url = `${CDN_BASE}/${uuid}/`;
        return {
            uuid,
            url
        };
    }
    constructor(){
        _define_property(this, "pubKey", void 0);
        if (!_config.UPLOADCARE_PUB_KEY) throw new Error('UPLOADCARE_PUB_KEY is not set');
        this.pubKey = _config.UPLOADCARE_PUB_KEY;
    }
};
const uploadCareClient = new UploadCareClient();

//# sourceMappingURL=uploadCareClient.js.map