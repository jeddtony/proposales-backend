import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';
import { CreateProposalRequestDto } from '@dtos/proposalRequest.dto';
import { ProposalRequest } from '@interfaces/proposalRequest.interface';
import { ProposalRequestService } from '@services/proposalRequest.service';
import { generateExperienceSummary } from '@utils/proposalAI';

export class ProposalRequestController {
  public proposalRequestService = Container.get(ProposalRequestService);

  public getProposalRequests = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = Math.max(1, Number(req.query.page) || 1);
      const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 20));
      const { rows, count, total_pages } = await this.proposalRequestService.getProposalRequests(page, limit);
      res.status(200).json({ data: rows, meta: { page, limit, total: count, total_pages }, message: 'Proposal requests retrieved successfully' });
    } catch (error) {
      next(error);
    }
  };

  public getProposalRequestById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const record: ProposalRequest = await this.proposalRequestService.getProposalRequestById(id);
      res.status(200).json({ data: record, message: 'Proposal request retrieved successfully' });
    } catch (error) {
      next(error);
    }
  };

  public createProposalRequest = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data: CreateProposalRequestDto = req.body;
      const created: ProposalRequest = await this.proposalRequestService.createProposalRequest(data);

      res.status(201).json({ data: created, message: 'Proposal request submitted successfully' });
    } catch (error) {
      next(error);
    }
  };

  public getClients = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = Math.max(1, Number(req.query.page) || 1);
      const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 20));
      const { rows, count, total_pages } = await this.proposalRequestService.getClients(page, limit);
      res.status(200).json({ data: rows, meta: { page, limit, total: count, total_pages }, message: 'Clients retrieved successfully' });
    } catch (error) {
      next(error);
    }
  };

  public generateExperienceSummary = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const proposalRequest: ProposalRequest = await this.proposalRequestService.getProposalRequestById(id);
      const summary = await generateExperienceSummary(proposalRequest);

      res.status(200).json({ data: { summary }, message: 'Experience summary generated successfully' });
    } catch (error) {
      next(error);
    }
  };
}
