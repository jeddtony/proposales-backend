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
    get NanoBananaClient () {
        return NanoBananaClient;
    },
    get nanoBananaClient () {
        return nanoBananaClient;
    }
});
const _nodefs = /*#__PURE__*/ _interop_require_wildcard(require("node:fs"));
const _nodepath = /*#__PURE__*/ _interop_require_wildcard(require("node:path"));
const _axios = /*#__PURE__*/ _interop_require_default(require("axios"));
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
const GEMINI_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models';
let NanoBananaClient = class NanoBananaClient {
    async generateImage(prompt) {
        var _ref;
        var _response_data_candidates__content, _response_data_candidates_, _response_data_candidates;
        const url = `${GEMINI_BASE_URL}/${this.model}:generateContent`;
        const response = await _axios.default.post(url, {
            contents: [
                {
                    parts: [
                        {
                            text: prompt
                        }
                    ]
                }
            ],
            generationConfig: {
                responseModalities: [
                    'TEXT',
                    'IMAGE'
                ]
            }
        }, {
            headers: {
                'Content-Type': 'application/json',
                'x-goog-api-key': this.apiKey
            }
        });
        const parts = (_ref = (_response_data_candidates = response.data.candidates) === null || _response_data_candidates === void 0 ? void 0 : (_response_data_candidates_ = _response_data_candidates[0]) === null || _response_data_candidates_ === void 0 ? void 0 : (_response_data_candidates__content = _response_data_candidates_.content) === null || _response_data_candidates__content === void 0 ? void 0 : _response_data_candidates__content.parts) !== null && _ref !== void 0 ? _ref : [];
        const imagePart = parts.find((p)=>{
            var _p_inlineData_mimeType, _p_inlineData;
            return (_p_inlineData = p.inlineData) === null || _p_inlineData === void 0 ? void 0 : (_p_inlineData_mimeType = _p_inlineData.mimeType) === null || _p_inlineData_mimeType === void 0 ? void 0 : _p_inlineData_mimeType.startsWith('image/');
        });
        if (!imagePart) {
            throw new Error('No image returned from NanoBanana/Gemini');
        }
        const { mimeType, data: base64Data } = imagePart.inlineData;
        const ext = mimeType.split('/')[1];
        const filename = `generated-${Date.now()}.${ext}`;
        const outputPath = _nodepath.join(this.outputDir, filename);
        _nodefs.mkdirSync(this.outputDir, {
            recursive: true
        });
        _nodefs.writeFileSync(outputPath, Buffer.from(base64Data, 'base64'));
        return {
            filename,
            outputPath,
            mimeType
        };
    }
    downloadImage(outputPath) {
        if (!_nodefs.existsSync(outputPath)) {
            throw new Error(`Image not found at path: ${outputPath}`);
        }
        return _nodefs.readFileSync(outputPath);
    }
    constructor(){
        _define_property(this, "apiKey", void 0);
        _define_property(this, "outputDir", void 0);
        _define_property(this, "model", void 0);
        if (!_config.GEMINI_API_KEY) throw new Error('GEMINI_API_KEY is not set');
        this.apiKey = _config.GEMINI_API_KEY;
        this.outputDir = _config.IMAGE_OUTPUT_DIR;
        this.model = _config.NANOBANANA_MODEL;
    }
};
const nanoBananaClient = new NanoBananaClient();

//# sourceMappingURL=nanoBananaClient.js.map