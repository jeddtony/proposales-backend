"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.llm = void 0;
const _config_1 = require("@config");
const openaiProvider_1 = require("./openaiProvider");
const huggingFaceProvider_1 = require("./huggingFaceProvider");
const vercelAIProvider_1 = require("./vercelAIProvider");
const claudeProvider_1 = require("./claudeProvider");
function createLLMProvider() {
    switch (_config_1.LLM_PROVIDER) {
        case 'openai':
            return new openaiProvider_1.OpenAIProvider();
        case 'huggingface':
            return new huggingFaceProvider_1.HuggingFaceProvider();
        case 'vercel-ai':
            return new vercelAIProvider_1.VercelAIProvider();
        case 'claude':
            return new claudeProvider_1.ClaudeProvider();
        default:
            throw new Error(`Unknown LLM_PROVIDER "${_config_1.LLM_PROVIDER}". Valid options: openai, huggingface, vercel-ai, claude`);
    }
}
exports.llm = createLLMProvider();
//# sourceMappingURL=index.js.map