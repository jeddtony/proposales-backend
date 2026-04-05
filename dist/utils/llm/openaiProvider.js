"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "OpenAIProvider", {
    enumerable: true,
    get: function() {
        return OpenAIProvider;
    }
});
const _openai = /*#__PURE__*/ _interop_require_default(require("openai"));
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
let OpenAIProvider = class OpenAIProvider {
    async chat(messages) {
        var _response_choices__message_content;
        const response = await this.client.chat.completions.create({
            model: this.model,
            messages
        });
        return {
            text: (_response_choices__message_content = response.choices[0].message.content) !== null && _response_choices__message_content !== void 0 ? _response_choices__message_content : '',
            provider: 'openai'
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
    constructor(model = 'gpt-4o-mini'){
        _define_property(this, "client", void 0);
        _define_property(this, "model", void 0);
        if (!_config.OPENAI_API_KEY) throw new Error('OPENAI_API_KEY is not set');
        this.client = new _openai.default({
            apiKey: _config.OPENAI_API_KEY
        });
        this.model = model;
    }
};

//# sourceMappingURL=openaiProvider.js.map