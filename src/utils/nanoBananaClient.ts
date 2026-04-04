import * as fs from 'node:fs';
import * as path from 'node:path';
import axios from 'axios';
import { GEMINI_API_KEY, IMAGE_OUTPUT_DIR, NANOBANANA_MODEL } from '@config';

const GEMINI_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models';

export interface GeneratedImage {
  filename: string;
  outputPath: string;
  mimeType: string;
}

export class NanoBananaClient {
  private readonly apiKey: string;
  private readonly outputDir: string;
  private readonly model: string;

  constructor() {
    if (!GEMINI_API_KEY) throw new Error('GEMINI_API_KEY is not set');
    this.apiKey = GEMINI_API_KEY;
    this.outputDir = IMAGE_OUTPUT_DIR;
    this.model = NANOBANANA_MODEL;
  }

  async generateImage(prompt: string): Promise<GeneratedImage> {
    const url = `${GEMINI_BASE_URL}/${this.model}:generateContent`;

    const response = await axios.post(
      url,
      {
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { responseModalities: ['TEXT', 'IMAGE'] },
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': this.apiKey,
        },
      },
    );

    const parts: unknown[] = response.data.candidates?.[0]?.content?.parts ?? [];
    const imagePart = parts.find(
      (p: any) => p.inlineData?.mimeType?.startsWith('image/'),
    ) as { inlineData: { mimeType: string; data: string } } | undefined;

    if (!imagePart) {
      throw new Error('No image returned from NanoBanana/Gemini');
    }

    const { mimeType, data: base64Data } = imagePart.inlineData;
    const ext = mimeType.split('/')[1];
    const filename = `generated-${Date.now()}.${ext}`;
    const outputPath = path.join(this.outputDir, filename);

    fs.mkdirSync(this.outputDir, { recursive: true });
    fs.writeFileSync(outputPath, Buffer.from(base64Data, 'base64'));

    return { filename, outputPath, mimeType };
  }

  downloadImage(outputPath: string): Buffer {
    if (!fs.existsSync(outputPath)) {
      throw new Error(`Image not found at path: ${outputPath}`);
    }
    return fs.readFileSync(outputPath);
  }
}

export const nanoBananaClient = new NanoBananaClient();
