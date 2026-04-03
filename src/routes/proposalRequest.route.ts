import { Router, Request, Response, NextFunction } from 'express';
import { ProposalRequestController } from '@controllers/proposalRequest.controller';
import { CreateProposalRequestDto } from '@dtos/proposalRequest.dto';
import { Routes } from '@interfaces/routes.interface';
import { ValidationMiddleware } from '@middlewares/validation.middleware';
import { proposalesClient } from '@utils/proposalesClient';

export class ProposalRequestRoute implements Routes {
  public router = Router();
  public proposalRequest = new ProposalRequestController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get('/proposal-requests', this.proposalRequest.getProposalRequests);
    this.router.get('/proposal-requests/:id', this.proposalRequest.getProposalRequestById);
    this.router.post('/proposal-requests', ValidationMiddleware(CreateProposalRequestDto), this.proposalRequest.createProposalRequest);

    this.router.get('/test/companies', async (_req: Request, res: Response, next: NextFunction) => {
      try {
        const data = await proposalesClient.listCompanies();
        res.status(200).json(data);
      } catch (error) {
        next(error);
      }
    });
  }
}
