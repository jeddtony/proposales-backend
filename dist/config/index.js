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
    get ANTHROPIC_API_KEY () {
        return ANTHROPIC_API_KEY;
    },
    get CREDENTIALS () {
        return CREDENTIALS;
    },
    get DB_DATABASE () {
        return DB_DATABASE;
    },
    get DB_HOST () {
        return DB_HOST;
    },
    get DB_PASSWORD () {
        return DB_PASSWORD;
    },
    get DB_PORT () {
        return DB_PORT;
    },
    get DB_USER () {
        return DB_USER;
    },
    get GEMINI_API_KEY () {
        return GEMINI_API_KEY;
    },
    get HUGGINGFACE_API_KEY () {
        return HUGGINGFACE_API_KEY;
    },
    get IMAGE_OUTPUT_DIR () {
        return IMAGE_OUTPUT_DIR;
    },
    get LLM_PROVIDER () {
        return LLM_PROVIDER;
    },
    get LOG_DIR () {
        return LOG_DIR;
    },
    get LOG_FORMAT () {
        return LOG_FORMAT;
    },
    get NANOBANANA_MODEL () {
        return NANOBANANA_MODEL;
    },
    get NODE_ENV () {
        return NODE_ENV;
    },
    get OPENAI_API_KEY () {
        return OPENAI_API_KEY;
    },
    get ORIGIN () {
        return ORIGIN;
    },
    get PORT () {
        return PORT;
    },
    get PROPOSALES_API_KEY () {
        return PROPOSALES_API_KEY;
    },
    get PROPOSALES_COMPANY_ID () {
        return PROPOSALES_COMPANY_ID;
    },
    get SECRET_KEY () {
        return SECRET_KEY;
    },
    get UPLOADCARE_PUB_KEY () {
        return UPLOADCARE_PUB_KEY;
    },
    get VERCEL_AI_API_KEY () {
        return VERCEL_AI_API_KEY;
    }
});
const _dotenv = require("dotenv");
(0, _dotenv.config)({
    path: `.env.${process.env.NODE_ENV || 'development'}.local`
});
const CREDENTIALS = process.env.CREDENTIALS === 'true';
const { NODE_ENV, PORT, SECRET_KEY, LOG_FORMAT, LOG_DIR, ORIGIN } = process.env;
const { DB_USER, DB_PASSWORD, DB_HOST, DB_DATABASE } = process.env;
const DB_PORT = process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306;
const { PROPOSALES_API_KEY } = process.env;
const { LLM_PROVIDER, OPENAI_API_KEY, HUGGINGFACE_API_KEY, VERCEL_AI_API_KEY, ANTHROPIC_API_KEY } = process.env;
const { GEMINI_API_KEY, IMAGE_OUTPUT_DIR = 'generated-images', NANOBANANA_MODEL = 'gemini-2.5-flash-image' } = process.env;
const { UPLOADCARE_PUB_KEY } = process.env;
const { PROPOSALES_COMPANY_ID } = process.env;

//# sourceMappingURL=index.js.map