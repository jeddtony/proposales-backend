"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClaudeProvider = void 0;
const tslib_1 = require("tslib");
const sdk_1 = tslib_1.__importDefault(require("@anthropic-ai/sdk"));
const _config_1 = require("@config");
class ClaudeProvider {
    constructor(model = 'claude-sonnet-4-6') {
        if (!_config_1.ANTHROPIC_API_KEY)
            throw new Error('ANTHROPIC_API_KEY is not set');
        this.client = new sdk_1.default({ apiKey: _config_1.ANTHROPIC_API_KEY });
        this.model = model;
    }
    async chat(messages) {
        const systemMessage = messages.find(m => m.role === 'system');
        const conversationMessages = messages.filter(m => m.role !== 'system');
        const response = await this.client.messages.create({
            model: this.model,
            max_tokens: 1024,
            system: systemMessage === null || systemMessage === void 0 ? void 0 : systemMessage.content,
            messages: conversationMessages.map(m => ({ role: m.role, content: m.content })),
        });
        const block = response.content[0];
        const text = block.type === 'text' ? block.text : '';
        return { text, provider: 'claude' };
    }
    async complete(prompt) {
        return this.chat([{ role: 'user', content: prompt }]);
    }
}
exports.ClaudeProvider = ClaudeProvider;
//# sourceMappingURL=claudeProvider.js.map