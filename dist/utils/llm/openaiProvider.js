"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenAIProvider = void 0;
const tslib_1 = require("tslib");
const openai_1 = tslib_1.__importDefault(require("openai"));
const _config_1 = require("@config");
class OpenAIProvider {
    constructor(model = 'gpt-4o-mini') {
        if (!_config_1.OPENAI_API_KEY)
            throw new Error('OPENAI_API_KEY is not set');
        this.client = new openai_1.default({ apiKey: _config_1.OPENAI_API_KEY });
        this.model = model;
    }
    async chat(messages) {
        var _a;
        const response = await this.client.chat.completions.create({
            model: this.model,
            messages,
        });
        return {
            text: (_a = response.choices[0].message.content) !== null && _a !== void 0 ? _a : '',
            provider: 'openai',
        };
    }
    async complete(prompt) {
        return this.chat([{ role: 'user', content: prompt }]);
    }
}
exports.OpenAIProvider = OpenAIProvider;
//# sourceMappingURL=openaiProvider.js.map