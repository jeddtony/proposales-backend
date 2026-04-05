"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "VercelAIProvider", {
    enumerable: true,
    get: function() {
        return VercelAIProvider;
    }
});
const _ai = require("ai");
const _openai = require("@ai-sdk/openai");
const _config = require("../../config");
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
let VercelAIProvider = class VercelAIProvider {
    async chat(messages) {
        const { text } = await (0, _ai.generateText)({
            model: this.model,
            messages
        });
        return {
            text,
            provider: 'vercel-ai'
        };
    }
    async complete(prompt) {
        const { text } = await (0, _ai.generateText)({
            model: this.model,
            prompt
        });
        return {
            text,
            provider: 'vercel-ai'
        };
    }
    constructor(modelId = 'gpt-4o-mini'){
        _define_property(this, "model", void 0);
        if (!_config.VERCEL_AI_API_KEY) throw new Error('VERCEL_AI_API_KEY is not set');
        const openai = (0, _openai.createOpenAI)({
            apiKey: _config.VERCEL_AI_API_KEY
        });
        this.model = openai(modelId);
    }
};

//# sourceMappingURL=vercelAIProvider.js.map