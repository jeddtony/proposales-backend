# Proposale API Integration

A Node.js/Express backend that integrates with the [Proposales API](https://docs.proposales.com) to manage proposal requests, AI-powered proposal generation, content management, and image generation.

---

## Tech Stack

- **Runtime**: Node.js + TypeScript
- **Framework**: Express
- **ORM**: Sequelize (MySQL)
- **AI/LLM**: Anthropic Claude, OpenAI, HuggingFace, Vercel AI SDK (configurable via env)
- **Image Generation**: NanoBanana (Gemini API)
- **File Storage**: UploadCare
- **Proposal Management**: Proposales API

---

## Getting Started

### Prerequisites

- Node.js 18+
- MySQL database

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env.development.local` file with the following:

```env
# Server
NODE_ENV=development
PORT=3000
SECRET_KEY=your_secret_key
ORIGIN=*
CREDENTIALS=true
LOG_FORMAT=dev
LOG_DIR=logs

# Database
DB_HOST=localhost
DB_PORT=3306
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_DATABASE=your_db_name

# Proposales
PROPOSALES_API_KEY=your_proposales_api_key
PROPOSALES_COMPANY_ID=your_company_id

# LLM (choose one provider)
LLM_PROVIDER=claude             # claude | openai | huggingface | vercel-ai
ANTHROPIC_API_KEY=sk-ant-...
OPENAI_API_KEY=sk-...
HUGGINGFACE_API_KEY=hf_...
VERCEL_AI_API_KEY=sk-...

# Image Generation (NanoBanana/Gemini)
GEMINI_API_KEY=your_gemini_key
NANOBANANA_MODEL=gemini-2.5-flash-image
IMAGE_OUTPUT_DIR=generated-images

# UploadCare
UPLOADCARE_PUB_KEY=your_uploadcare_public_key
```

### Database Setup

```bash
# Run all migrations
npm run migration:run

# Undo last migration
npx sequelize db:migrate:undo
```

### Running the Server

```bash
# Development
npm run dev

# Production
npm start
```

---

## API Endpoints

### Authentication
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `POST` | `/signup` | Register a new user | No |
| `POST` | `/login` | Login and receive auth cookie | No |
| `POST` | `/logout` | Logout | Yes |

---

### Proposal Requests (RFPs)
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `POST` | `/proposal-requests` | Submit a new RFP | No |
| `GET` | `/proposal-requests` | List all RFPs (paginated) | Yes |
| `GET` | `/proposal-requests/:id` | Get a single RFP | Yes |

**Pagination query params:** `?page=1&limit=20`

---

### Clients
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `GET` | `/clients` | List unique clients grouped by email (paginated) | Yes |

**Pagination query params:** `?page=1&limit=20`

---

### AI Chat (Proposal Conversation)
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `POST` | `/proposal-requests/:id/chat/initialize` | Generate experience summary and start chat | Yes |
| `GET` | `/proposal-requests/:id/chat` | Get full chat history | Yes |
| `POST` | `/proposal-requests/:id/chat` | Send a message and get AI reply | Yes |
| `GET` | `/proposal-requests/:id/experience-summary` | Generate a one-off experience summary | Yes |
| `GET` | `/proposal-requests/:id/relevant-content` | Fetch Proposales content relevant to the chat | Yes |
| `GET` | `/proposal-requests/:id/proposal-draft` | Generate and create a proposal on Proposales | Yes |

---

### Proposals
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `POST` | `/proposals` | Create a proposal on Proposales | Yes |
| `GET` | `/proposals/:uuid` | Fetch a proposal from Proposales | Yes |

**Create proposal request body:**
```json
{
  "proposal_request_id": 1,
  "title_md": "Proposal for Acme Corp",
  "description_md": "A premium event experience for 300 guests",
  "language": "en",
  "recipient": {
    "first_name": "Jane",
    "last_name": "Smith",
    "email": "jane@acmecorp.com",
    "phone": "+46701234567",
    "company_name": "Acme Corp"
  },
  "tax_options": { "mode": "standard", "tax_included": false },
  "blocks": []
}
```

---

### Content Management (Proposales)
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `GET` | `/proposales/content` | List all content in Proposales account | Yes |
| `POST` | `/content` | Create a content item | Yes |
| `PUT` | `/content` | Update a content item | Yes |
| `DELETE` | `/content` | Delete a content item | Yes |
| `POST` | `/content/bulk-upload` | Bulk upload content from spreadsheet | Yes |

**Bulk upload spreadsheet columns:**

| Column | Required | Description |
|---|---|---|
| `title` | Yes | Content title |
| `language` | No | ISO code, defaults to `en` |
| `description` | No | Content description |
| `image_url` | No | Publicly accessible image URL |

Accepts `.xlsx`, `.xls`, `.csv`. Send as `multipart/form-data` with field name `file`.

---

### Image Generation (NanoBanana)
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `POST` | `/test/generate-image` | Generate an image and return as file download | Yes |
| `POST` | `/test/generate-and-upload-image` | Generate an image and upload to UploadCare | Yes |

**Request body:**
```json
{ "prompt": "A futuristic city at night" }
```

---

### Test Endpoints
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `GET` | `/test/companies` | Fetch Proposales companies | Yes |
| `POST` | `/test/llm` | Test the configured LLM provider | Yes |

---

## LLM Providers

Set `LLM_PROVIDER` in your `.env` to switch providers:

| Value | Provider | Model |
|---|---|---|
| `claude` | Anthropic Claude | `claude-sonnet-4-6` |
| `openai` | OpenAI | `gpt-4o-mini` |
| `huggingface` | HuggingFace | `meta-llama/Llama-3.1-8B-Instruct` |
| `vercel-ai` | Vercel AI SDK (OpenAI) | `gpt-4o-mini` |

---

## Database Migrations

| Migration | Description |
|---|---|
| `20260403000000-create-proposal-requests` | Creates `proposal_requests` table |
| `20260404000000-create-proposal-chats` | Creates `proposal_chats` table |
| `20260405000000-add-proposal-uuid-to-proposal-requests` | Adds `proposal_uuid`, `proposal_url`, `proposal_generated_at` columns |
