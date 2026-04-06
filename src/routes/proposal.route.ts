import { Router } from 'express';
import { ProposalController } from '@controllers/proposal.controller';
import { Routes } from '@interfaces/routes.interface';
import { AuthMiddleware } from '@middlewares/auth.middleware';

export class ProposalRoute implements Routes {
  public router = Router();
  public proposal = new ProposalController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get('/proposals/:uuid', AuthMiddleware, this.proposal.getProposal);
    this.router.post('/proposals', AuthMiddleware, this.proposal.createProposal);
  }
}
