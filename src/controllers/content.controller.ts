import { NextFunction, Request, Response } from 'express';
import * as xlsx from 'xlsx';
import { proposalesClient } from '@utils/proposalesClient';
import { PROPOSALES_COMPANY_ID } from '@config';

export class ContentController {
  public createContent = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!PROPOSALES_COMPANY_ID) throw new Error('PROPOSALES_COMPANY_ID is not set');
      const { language = 'en', title, description, image_url } = req.body;

      const result = await proposalesClient.createContent({
        company_id: Number(PROPOSALES_COMPANY_ID),
        language,
        title,
        ...(description && { description }),
        ...(image_url && { images: [{ uuid: '', url: image_url }] }),
      });

      res.status(201).json({ data: result.data, message: 'Content created successfully' });
    } catch (error) {
      next(error);
    }
  };

  public updateContent = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { variation_id, product_id, language = 'en', title, description, image_url } = req.body;

      const result = await proposalesClient.updateContent({
        ...(variation_id && { variation_id: Number(variation_id) }),
        ...(product_id && { product_id: Number(product_id) }),
        language,
        ...(title && { title }),
        ...(description && { description }),
        ...(image_url && { images: [{ uuid: '', url: image_url }] }),
      });

      res.status(200).json({ data: result.data, message: 'Content updated successfully' });
    } catch (error) {
      next(error);
    }
  };

  public deleteContent = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { product_id, variation_id } = req.query;

      if (!product_id && !variation_id) {
        res.status(400).json({ message: 'At least one of product_id or variation_id is required' });
        return;
      }

      const result = await proposalesClient.deleteContent({
        ...(product_id && { product_id: Number(product_id) }),
        ...(variation_id && { variation_id: Number(variation_id) }),
      });

      res.status(200).json({ data: result.data, message: 'Content deleted successfully' });
    } catch (error) {
      next(error);
    }
  };

  public bulkCreateContent = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.file) {
        res.status(400).json({ message: 'No file uploaded' });
        return;
      }

      const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = xlsx.utils.sheet_to_json<Record<string, string>>(sheet, { defval: '' });

      if (!PROPOSALES_COMPANY_ID) throw new Error('PROPOSALES_COMPANY_ID is not set');
      const companyId = Number(PROPOSALES_COMPANY_ID);

      const results: { row: number; status: 'success' | 'error'; data?: unknown; error?: string }[] = [];

      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];

        const title = row['title']?.trim();
        const language = row['language']?.trim() || 'en';
        const description = row['description']?.trim() || undefined;
        const image_url = row['image_url']?.trim() || undefined;

        if (!title) {
          results.push({ row: i + 2, status: 'error', error: 'Missing required field: title' });
          continue;
        }

        try {
          const result = await proposalesClient.createContent({
            company_id: companyId,
            language,
            title,
            ...(description && { description }),
            ...(image_url && { images: [{ uuid: '', url: image_url }] }),
          });
          results.push({ row: i + 2, status: 'success', data: result.data });
        } catch (err) {
          results.push({ row: i + 2, status: 'error', error: err instanceof Error ? err.message : 'Unknown error' });
        }
      }

      const succeeded = results.filter(r => r.status === 'success').length;
      const failed = results.filter(r => r.status === 'error').length;

      res.status(200).json({
        data: results,
        message: `Bulk upload complete: ${succeeded} succeeded, ${failed} failed`,
      });
    } catch (error) {
      next(error);
    }
  };
}
