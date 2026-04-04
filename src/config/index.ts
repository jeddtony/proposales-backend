import { config } from 'dotenv';
config({ path: `.env.${process.env.NODE_ENV || 'development'}.local` });

export const CREDENTIALS = process.env.CREDENTIALS === 'true';
export const { NODE_ENV, PORT, SECRET_KEY, LOG_FORMAT, LOG_DIR, ORIGIN } = process.env;
export const { DB_USER, DB_PASSWORD, DB_HOST, DB_DATABASE } = process.env;
export const DB_PORT = process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306;
export const { PROPOSALES_API_KEY } = process.env;
export const { LLM_PROVIDER, OPENAI_API_KEY, HUGGINGFACE_API_KEY, VERCEL_AI_API_KEY, ANTHROPIC_API_KEY } = process.env;
export const { GEMINI_API_KEY, IMAGE_OUTPUT_DIR = 'generated-images', NANOBANANA_MODEL = 'gemini-2.5-flash-image' } = process.env;
export const { UPLOADCARE_PUB_KEY } = process.env;
