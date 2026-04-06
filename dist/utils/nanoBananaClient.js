"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nanoBananaClient = exports.NanoBananaClient = void 0;
const tslib_1 = require("tslib");
const fs = tslib_1.__importStar(require("node:fs"));
const path = tslib_1.__importStar(require("node:path"));
const axios_1 = tslib_1.__importDefault(require("axios"));
const _config_1 = require("@config");
const GEMINI_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models';
class NanoBananaClient {
    constructor() {
        if (!_config_1.GEMINI_API_KEY)
            throw new Error('GEMINI_API_KEY is not set');
        this.apiKey = _config_1.GEMINI_API_KEY;
        this.outputDir = _config_1.IMAGE_OUTPUT_DIR;
        this.model = _config_1.NANOBANANA_MODEL;
    }
    async generateImage(prompt) {
        var _a, _b, _c, _d;
        const url = `${GEMINI_BASE_URL}/${this.model}:generateContent`;
        const response = await axios_1.default.post(url, {
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { responseModalities: ['TEXT', 'IMAGE'] },
        }, {
            headers: {
                'Content-Type': 'application/json',
                'x-goog-api-key': this.apiKey,
            },
        });
        const parts = (_d = (_c = (_b = (_a = response.data.candidates) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.content) === null || _c === void 0 ? void 0 : _c.parts) !== null && _d !== void 0 ? _d : [];
        const imagePart = parts.find((p) => { var _a, _b; return (_b = (_a = p.inlineData) === null || _a === void 0 ? void 0 : _a.mimeType) === null || _b === void 0 ? void 0 : _b.startsWith('image/'); });
        if (!imagePart) {
            throw new Error('No image returned from NanoBanana/Gemini');
        }
        const { mimeType, data: base64Data } = imagePart.inlineData;
        const ext = mimeType.split('/')[1];
        const filename = `generated-${Date.now()}.${ext}`;
        const outputPath = path.join(this.outputDir, filename);
        fs.mkdirSync(this.outputDir, { recursive: true });
        fs.writeFileSync(outputPath, Buffer.from(base64Data, 'base64'));
        return { filename, outputPath, mimeType };
    }
    downloadImage(outputPath) {
        if (!fs.existsSync(outputPath)) {
            throw new Error(`Image not found at path: ${outputPath}`);
        }
        return fs.readFileSync(outputPath);
    }
}
exports.NanoBananaClient = NanoBananaClient;
exports.nanoBananaClient = new NanoBananaClient();
//# sourceMappingURL=nanoBananaClient.js.map