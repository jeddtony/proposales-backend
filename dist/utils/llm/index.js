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
    get LLMMessage () {
        return _llminterface.LLMMessage;
    },
    get LLMProvider () {
        return _llminterface.LLMProvider;
    },
    get LLMResponse () {
        return _llminterface.LLMResponse;
    },
    get llm () {
        return llm;
    }
});
const _config = require("../../config");
const _openaiProvider = require("./openaiProvider");
const _huggingFaceProvider = require("./huggingFaceProvider");
const _vercelAIProvider = require("./vercelAIProvider");
const _claudeProvider = require("./claudeProvider");
const _llminterface = require("../../interfaces/llm.interface");
function createLLMProvider() {
    switch(_config.LLM_PROVIDER){
        case 'openai':
            return new _openaiProvider.OpenAIProvider();
        case 'huggingface':
            return new _huggingFaceProvider.HuggingFaceProvider();
        case 'vercel-ai':
            return new _vercelAIProvider.VercelAIProvider();
        case 'claude':
            return new _claudeProvider.ClaudeProvider();
        default:
            throw new Error(`Unknown LLM_PROVIDER "${_config.LLM_PROVIDER}". Valid options: openai, huggingface, vercel-ai, claude`);
    }
}
const llm = createLLMProvider();

//# sourceMappingURL=index.js.map