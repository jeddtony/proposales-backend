import * as https from 'https';
import { PROPOSALES_API_KEY } from '@config';

const BASE_HOST = 'api.proposales.com';
const BASE_PATH = '';

// --- Entity types ---

export interface Company {
  id: number;
  created_at: number;
  name: string;
  currency: string;
  tax_mode: 'standard' | 'simplified' | 'none';
  registration_number: string;
  website_url: string;
}

export type ProposalRecipient =
  | { id: number }
  | {
      first_name?: string;
      last_name?: string;
      email?: string;
      phone?: string;
      company_name?: string;
      sources?: {
        integration?: {
          id: number;
          contactId: string;
          metadata: Record<string, unknown>;
        };
      };
    };

export interface ProposalBlock {
  [key: string]: unknown;
}

export interface ProposalAttachment {
  id: number;
  filename: string;
  created_at: number;
}

export interface Proposal {
  uuid: string;
  title: string;
  title_md: string;
  description_html: string;
  description_md: string;
  status: string;
  currency: string;
  value_with_tax: number;
  value_without_tax: number;
  recipient_name: string;
  recipient_email: string;
  recipient_phone: string;
  company_name: string;
  company_email: string;
  company_phone: string;
  contact_name: string;
  contact_email: string;
  expires_at: number | null;
  archived_at: number | null;
  blocks: ProposalBlock[];
  attachments: ProposalAttachment[];
  signatures: unknown[];
  language: string;
  data: Record<string, unknown>;
}

export interface ProposalSummary {
  created_at: number;
  updated_at: number;
  title: string;
  uuid: string;
  series_uuid: string;
  company_id: number;
  version: number;
  status: string;
  data: Record<string, unknown>;
}

export interface ContentImage {
  uuid: string;
  filename?: string;
  mime_type?: string;
  url?: string;
  size?: number;
  height?: number;
  width?: number;
}

export interface ContentItem {
  created_at: number;
  description: Record<string, string>;
  product_id: number;
  variation_id: number;
  title: Record<string, string>;
  is_archived?: boolean;
  sources?: Record<string, unknown>;
  images?: ContentImage[];
  integration_id: number;
  integration_metadata: Record<string, unknown>;
}

// --- Request param types ---

export interface CreateProposalParams {
  company_id: number;
  language?: string;
  creator_email?: string;
  contact_email?: string;
  background_image?: { id: number; uuid: string };
  background_video?: { id: number; uuid: string };
  title_md?: string;
  description_md?: string;
  recipient?: ProposalRecipient;
  data?: Record<string, unknown>;
  invoicing_enabled?: boolean;
  tax_options?: { mode?: string; tax_included?: boolean; tax_label_key?: string };
  blocks?: ProposalBlock[];
  attachments?: unknown[];
}

export interface ListContentParams {
  company_id?: number;
  variation_id?: string;
  product_id?: string;
  include_archived?: boolean;
  include_sources?: boolean;
}

export interface SearchProposalsParams {
  company_id: number;
  filter?: Record<string, string>;
  limit?: number;
}

export interface CreateContentParams {
  company_id: number;
  language: string;
  title: string;
  description?: string;
  images?: ContentImage[];
}

export interface CreateRfpParams {
  email: string;
  company_id?: number;
  company_name?: string;
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  message?: string;
  language?: string;
  start_date?: string;
  end_date?: string;
  is_test?: string;
  silent_confirmation?: string;
  [key: string]: unknown;
}

// --- HTTP helper ---

function httpsRequest<T>(options: https.RequestOptions, body?: string, redirectCount = 0): Promise<T> {
  return new Promise((resolve, reject) => {
    const req = https.request(options, res => {
      const status = res.statusCode ?? 0;

      if ((status === 301 || status === 302 || status === 307 || status === 308) && res.headers.location) {
        if (redirectCount >= 5) return reject(new Error('Too many redirects'));
        const redirectUrl = new URL(res.headers.location);
        const redirectOptions: https.RequestOptions = {
          ...options,
          hostname: redirectUrl.hostname,
          path: redirectUrl.pathname + redirectUrl.search,
        };
        return resolve(httpsRequest<T>(redirectOptions, body, redirectCount + 1));
      }

      let raw = '';
      res.on('data', chunk => (raw += chunk));
      res.on('end', () => {
        if (!raw.trim()) {
          if (status >= 200 && status < 300) return resolve({} as T);
          return reject(new Error(`API error ${status}: empty response`));
        }

        let json: unknown;
        try {
          json = JSON.parse(raw);
        } catch {
          return reject(new Error(`Failed to parse response (status ${status}): ${raw}`));
        }

        if (status >= 200 && status < 300) {
          resolve(json as T);
        } else {
          const message = (json as { error?: { message?: string } })?.error?.message ?? res.statusMessage;
          reject(new Error(`API error ${status}: ${message}`));
        }
      });
    });

    req.on('error', reject);
    if (body) req.write(body);
    req.end();
  });
}

// --- Client ---

export class ProposalesClient {
  private readonly token: string;

  constructor() {
    if (!PROPOSALES_API_KEY) throw new Error('PROPOSALES_API_KEY is not set');
    this.token = PROPOSALES_API_KEY;
  }

  private buildOptions(method: string, path: string, query?: Record<string, string>): https.RequestOptions {
    const versionedPath = /^\/v\d+\//.test(path) ? path : `${BASE_PATH}${path}`;
    let fullPath = versionedPath;

    if (query && Object.keys(query).length > 0) {
      fullPath += `?${new URLSearchParams(query).toString()}`;
    }

    return {
      hostname: BASE_HOST,
      path: fullPath,
      method,
      headers: {
        Authorization: `Bearer ${this.token}`,
        'Content-Type': 'application/json',
      },
    };
  }

  private request<T>(method: string, path: string, options: { body?: unknown; query?: Record<string, string> } = {}): Promise<T> {
    const reqOptions = this.buildOptions(method, path, options.query);
    const body = options.body !== undefined ? JSON.stringify(options.body) : undefined;
    return httpsRequest<T>(reqOptions, body);
  }

  // --- Companies ---

  listCompanies(): Promise<{ data: Company[] }> {
    return this.request('GET', '/v3/companies');
  }

  // --- Proposals ---

  createProposal(params: CreateProposalParams): Promise<{ proposal: { uuid: string; url: string } }> {
    return this.request('POST', '/v3/proposals', { body: params });
  }

  getProposal(uuid: string): Promise<{ data: Proposal }> {
    return this.request('GET', `/v3/proposals/${uuid}`);
  }

  patchProposalData(uuid: string, data: Record<string, unknown>): Promise<{ data: Record<string, unknown> }> {
    return this.request('PATCH', `/proposals/${uuid}/data`, { body: { data } });
  }

  searchProposals(params: SearchProposalsParams): Promise<{ data: ProposalSummary[] }> {
    const query: Record<string, string> = { company_id: String(params.company_id) };

    if (params.limit !== undefined) query.limit = String(params.limit);

    if (params.filter) {
      for (const [key, value] of Object.entries(params.filter)) {
        query[`filter[${key}]`] = value;
      }
    }

    return this.request('GET', '/proposals/search', { query });
  }

  // --- Content ---

  listContent(params: ListContentParams = {}): Promise<{ data: ContentItem[] }> {
    const query: Record<string, string> = {};

    if (params.company_id !== undefined) query.company_id = String(params.company_id);
    if (params.variation_id !== undefined) query.variation_id = params.variation_id;
    if (params.product_id !== undefined) query.product_id = params.product_id;
    if (params.include_archived !== undefined) query.include_archived = String(params.include_archived);
    if (params.include_sources !== undefined) query.include_sources = String(params.include_sources);

    return this.request('GET', '/v3/content', { query });
  }

  createContent(params: CreateContentParams): Promise<{ data: { product_id: number; variation_id: number; message: string } }> {
    return this.request('POST', '/content', { body: params });
  }

  // --- Attachments ---

  listAttachments(companyId?: number): Promise<{ attachments: ProposalAttachment[] }> {
    const query: Record<string, string> = {};
    if (companyId !== undefined) query.company_id = String(companyId);
    return this.request('GET', '/attachments', { query });
  }

  // --- Inbox / RFP (no auth required) ---

  createRfp(companyId: number, params: CreateRfpParams): Promise<{ id: number }> {
    const options: https.RequestOptions = {
      hostname: BASE_HOST,
      path: `${BASE_PATH}/inbox?company_id=${companyId}`,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    };
    return httpsRequest<{ id: number }>(options, JSON.stringify(params));
  }
}

export const proposalesClient = new ProposalesClient();
