"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HuggingFaceProvider = void 0;
const inference_1 = require("@huggingface/inference");
const _config_1 = require("@config");
class HuggingFaceProvider {
    constructor(model = 'meta-llama/Llama-3.1-8B-Instruct') {
        if (!_config_1.HUGGINGFACE_API_KEY)
            throw new Error('HUGGINGFACE_API_KEY is not set');
        this.client = new inference_1.InferenceClient(_config_1.HUGGINGFACE_API_KEY);
        this.model = model;
    }
    async chat(messages) {
        var _a;
        const response = await this.client.chatCompletion({
            model: this.model,
            messages,
        });
        return {
            text: (_a = response.choices[0].message.content) !== null && _a !== void 0 ? _a : '',
            provider: 'huggingface',
        };
    }
    async complete(prompt) {
        return this.chat([{ role: 'user', content: prompt }]);
    }
}
exports.HuggingFaceProvider = HuggingFaceProvider;
//# sourceMappingURL=huggingFaceProvider.js.map