"use strict";
var _a, _b, _c, _d, _e, _f;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PROPOSALES_COMPANY_ID = exports.UPLOADCARE_PUB_KEY = exports.NANOBANANA_MODEL = exports.IMAGE_OUTPUT_DIR = exports.GEMINI_API_KEY = exports.ANTHROPIC_API_KEY = exports.VERCEL_AI_API_KEY = exports.HUGGINGFACE_API_KEY = exports.OPENAI_API_KEY = exports.LLM_PROVIDER = exports.PROPOSALES_API_KEY = exports.DB_PORT = exports.DB_DATABASE = exports.DB_HOST = exports.DB_PASSWORD = exports.DB_USER = exports.ORIGIN = exports.LOG_DIR = exports.LOG_FORMAT = exports.SECRET_KEY = exports.PORT = exports.NODE_ENV = exports.CREDENTIALS = void 0;
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)({ path: `.env.${process.env.NODE_ENV || 'development'}.local` });
exports.CREDENTIALS = process.env.CREDENTIALS === 'true';
_a = process.env, exports.NODE_ENV = _a.NODE_ENV, exports.PORT = _a.PORT, exports.SECRET_KEY = _a.SECRET_KEY, exports.LOG_FORMAT = _a.LOG_FORMAT, exports.LOG_DIR = _a.LOG_DIR, exports.ORIGIN = _a.ORIGIN;
_b = process.env, exports.DB_USER = _b.DB_USER, exports.DB_PASSWORD = _b.DB_PASSWORD, exports.DB_HOST = _b.DB_HOST, exports.DB_DATABASE = _b.DB_DATABASE;
exports.DB_PORT = process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306;
exports.PROPOSALES_API_KEY = process.env.PROPOSALES_API_KEY;
_c = process.env, exports.LLM_PROVIDER = _c.LLM_PROVIDER, exports.OPENAI_API_KEY = _c.OPENAI_API_KEY, exports.HUGGINGFACE_API_KEY = _c.HUGGINGFACE_API_KEY, exports.VERCEL_AI_API_KEY = _c.VERCEL_AI_API_KEY, exports.ANTHROPIC_API_KEY = _c.ANTHROPIC_API_KEY;
_d = process.env, exports.GEMINI_API_KEY = _d.GEMINI_API_KEY, _e = _d.IMAGE_OUTPUT_DIR, exports.IMAGE_OUTPUT_DIR = _e === void 0 ? 'generated-images' : _e, _f = _d.NANOBANANA_MODEL, exports.NANOBANANA_MODEL = _f === void 0 ? 'gemini-2.5-flash-image' : _f;
exports.UPLOADCARE_PUB_KEY = process.env.UPLOADCARE_PUB_KEY;
exports.PROPOSALES_COMPANY_ID = process.env.PROPOSALES_COMPANY_ID;
//# sourceMappingURL=index.js.map