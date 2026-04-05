import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';
import { ProposalChatService } from '@services/proposalChat.service';

export class ProposalChatController {
  public proposalChatService = Container.get(ProposalChatService);

  public getChatHistory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const history = await this.proposalChatService.getChatHistory(id);
      res.status(200).json({ data: history, message: 'Chat history retrieved successfully' });
    } catch (error) {
      next(error);
    }
  };

  public initializeChat = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const firstMessage = await this.proposalChatService.initializeChat(id);
      res.status(201).json({ data: firstMessage, message: 'Chat initialized successfully' });
    } catch (error) {
      next(error);
    }
  };

  public sendMessage = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const { message } = req.body;
      const reply = await this.proposalChatService.sendMessage(id, message);
      res.status(200).json({ data: reply, message: 'Message sent successfully' });
    } catch (error) {
      next(error);
    }
  };

  public getRelevantContent = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const content = await this.proposalChatService.getRelevantContent(id);
      res.status(200).json({ data: content, message: 'Relevant content retrieved successfully' });
    } catch (error) {
      next(error);
    }
  };

  public generateProposalDraft = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const draft = await this.proposalChatService.generateProposalDraft(id);
      res.status(200).json(draft);
    } catch (error) {
      next(error);
    }
  };
}
