"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VercelAIProvider = void 0;
const ai_1 = require("ai");
const openai_1 = require("@ai-sdk/openai");
const _config_1 = require("@config");
class VercelAIProvider {
    constructor(modelId = 'gpt-4o-mini') {
        if (!_config_1.VERCEL_AI_API_KEY)
            throw new Error('VERCEL_AI_API_KEY is not set');
        const openai = (0, openai_1.createOpenAI)({ apiKey: _config_1.VERCEL_AI_API_KEY });
        this.model = openai(modelId);
    }
    async chat(messages) {
        const { text } = await (0, ai_1.generateText)({
            model: this.model,
            messages,
        });
        return { text, provider: 'vercel-ai' };
    }
    async complete(prompt) {
        const { text } = await (0, ai_1.generateText)({
            model: this.model,
            prompt,
        });
        return { text, provider: 'vercel-ai' };
    }
}
exports.VercelAIProvider = VercelAIProvider;
//# sourceMappingURL=vercelAIProvider.js.map