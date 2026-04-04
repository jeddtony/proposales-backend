import axios from 'axios';
import FormData from 'form-data';
import { UPLOADCARE_PUB_KEY } from '@config';

const UPLOAD_URL = 'https://upload.uploadcare.com/base/';
const CDN_BASE = 'https://16r3itju75.ucarecd.net';

export interface UploadResult {
  uuid: string;
  url: string;
}

export class UploadCareClient {
  private readonly pubKey: string;

  constructor() {
    if (!UPLOADCARE_PUB_KEY) throw new Error('UPLOADCARE_PUB_KEY is not set');
    this.pubKey = UPLOADCARE_PUB_KEY;
  }

  async uploadBuffer(buffer: Buffer, filename: string, mimeType: string): Promise<UploadResult> {
    const form = new FormData();
    form.append('UPLOADCARE_PUB_KEY', this.pubKey);
    form.append('UPLOADCARE_STORE', '1');
    form.append('file', buffer, { filename, contentType: mimeType });

    const response = await axios.post(UPLOAD_URL, form, {
      headers: form.getHeaders(),
    });

    const uuid: string = response.data.file;
    const url = `${CDN_BASE}/${uuid}/`;

    return { uuid, url };
  }
}

export const uploadCareClient = new UploadCareClient();
