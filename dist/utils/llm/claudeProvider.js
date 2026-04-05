"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ClaudeProvider", {
    enumerable: true,
    get: function() {
        return ClaudeProvider;
    }
});
const _sdk = /*#__PURE__*/ _interop_require_default(require("@anthropic-ai/sdk"));
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
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
let ClaudeProvider = class ClaudeProvider {
    async chat(messages) {
        const systemMessage = messages.find((m)=>m.role === 'system');
        const conversationMessages = messages.filter((m)=>m.role !== 'system');
        const response = await this.client.messages.create({
            model: this.model,
            max_tokens: 1024,
            system: systemMessage === null || systemMessage === void 0 ? void 0 : systemMessage.content,
            messages: conversationMessages.map((m)=>({
                    role: m.role,
                    content: m.content
                }))
        });
        const block = response.content[0];
        const text = block.type === 'text' ? block.text : '';
        return {
            text,
            provider: 'claude'
        };
    }
    async complete(prompt) {
        return this.chat([
            {
                role: 'user',
                content: prompt
            }
        ]);
    }
    constructor(model = 'claude-sonnet-4-6'){
        _define_property(this, "client", void 0);
        _define_property(this, "model", void 0);
        if (!_config.ANTHROPIC_API_KEY) throw new Error('ANTHROPIC_API_KEY is not set');
        this.client = new _sdk.default({
            apiKey: _config.ANTHROPIC_API_KEY
        });
        this.model = model;
    }
};

//# sourceMappingURL=claudeProvider.js.map