import { Router, Request, Response, NextFunction } from 'express';
import { ProposalRequestController } from '@controllers/proposalRequest.controller';
import { ProposalChatController } from '@controllers/proposalChat.controller';
import { CreateProposalRequestDto } from '@dtos/proposalRequest.dto';
import { Routes } from '@interfaces/routes.interface';
import { ValidationMiddleware } from '@middlewares/validation.middleware';
import { proposalesClient } from '@utils/proposalesClient';
import { llm } from '@utils/llm';
import { nanoBananaClient } from '@utils/nanoBananaClient';
import { uploadCareClient } from '@utils/uploadCareClient';

export class ProposalRequestRoute implements Routes {
  public router = Router();
  public proposalRequest = new ProposalRequestController();
  public proposalChat = new ProposalChatController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get('/proposal-requests', this.proposalRequest.getProposalRequests);
    this.router.get('/proposal-requests/:id', this.proposalRequest.getProposalRequestById);
    this.router.post('/proposal-requests', ValidationMiddleware(CreateProposalRequestDto), this.proposalRequest.createProposalRequest);
    this.router.get('/proposal-requests/:id/experience-summary', this.proposalRequest.generateExperienceSummary);

    this.router.post('/proposal-requests/:id/chat/initialize', this.proposalChat.initializeChat);
    this.router.get('/proposal-requests/:id/chat', this.proposalChat.getChatHistory);
    this.router.post('/proposal-requests/:id/chat', this.proposalChat.sendMessage);
    this.router.get('/proposal-requests/:id/relevant-content', this.proposalChat.getRelevantContent);
    this.router.get('/proposal-requests/:id/proposal-draft', this.proposalChat.generateProposalDraft);

    this.router.get('/proposales/content', async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { variation_id, product_id, include_archived, include_sources } = req.query as Record<string, string>;
        const data = await proposalesClient.listContent({
          ...(variation_id && { variation_id }),
          ...(product_id && { product_id }),
          ...(include_archived && { include_archived: include_archived === 'true' }),
          ...(include_sources && { include_sources: include_sources === 'true' }),
        });
        res.status(200).json(data);
      } catch (error) {
        next(error);
      }
    });

    this.router.get('/test/companies', async (_req: Request, res: Response, next: NextFunction) => {
      try {
        const data = await proposalesClient.listCompanies();
        res.status(200).json(data);
      } catch (error) {
        next(error);
      }
    });

    this.router.post('/test/llm', async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { prompt } = req.body;
        const result = await llm.complete(prompt ?? 'Say hello!');
        res.status(200).json(result);
      } catch (error) {
        next(error);
      }
    });

    this.router.post('/test/generate-image', async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { prompt } = req.body;
        const image = await nanoBananaClient.generateImage(prompt ?? 'A beautiful sunset');
        const buffer = nanoBananaClient.downloadImage(image.outputPath);

        res.setHeader('Content-Type', image.mimeType);
        res.setHeader('Content-Disposition', `attachment; filename="${image.filename}"`);
        res.send(buffer);
      } catch (error) {
        next(error);
      }
    });

    this.router.post('/test/generate-and-upload-image', async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { prompt } = req.body;
        const image = await nanoBananaClient.generateImage(prompt ?? 'A beautiful sunset');
        const buffer = nanoBananaClient.downloadImage(image.outputPath);
        const uploaded = await uploadCareClient.uploadBuffer(buffer, image.filename, image.mimeType);

        res.status(200).json({ ...uploaded, filename: image.filename });
      } catch (error) {
        next(error);
      }
    });
  }
}
