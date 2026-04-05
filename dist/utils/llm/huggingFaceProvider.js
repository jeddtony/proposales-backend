"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "HuggingFaceProvider", {
    enumerable: true,
    get: function() {
        return HuggingFaceProvider;
    }
});
const _inference = require("@huggingface/inference");
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
let HuggingFaceProvider = class HuggingFaceProvider {
    async chat(messages) {
        var _response_choices__message_content;
        const response = await this.client.chatCompletion({
            model: this.model,
            messages
        });
        return {
            text: (_response_choices__message_content = response.choices[0].message.content) !== null && _response_choices__message_content !== void 0 ? _response_choices__message_content : '',
            provider: 'huggingface'
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
    constructor(model = 'meta-llama/Llama-3.1-8B-Instruct'){
        _define_property(this, "client", void 0);
        _define_property(this, "model", void 0);
        if (!_config.HUGGINGFACE_API_KEY) throw new Error('HUGGINGFACE_API_KEY is not set');
        this.client = new _inference.InferenceClient(_config.HUGGINGFACE_API_KEY);
        this.model = model;
    }
};

//# sourceMappingURL=huggingFaceProvider.js.map