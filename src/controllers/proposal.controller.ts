import { NextFunction, Request, Response } from 'express';
import { DB } from '@database';
import { proposalesClient } from '@utils/proposalesClient';
import { PROPOSALES_COMPANY_ID } from '@config';

export class ProposalController {
  public getProposal = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { uuid } = req.params;
      const { data } = await proposalesClient.getProposal(uuid);
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  };

  public createProposal = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!PROPOSALES_COMPANY_ID) throw new Error('PROPOSALES_COMPANY_ID is not set');

      const { proposal_request_id, language, title_md, description_md, recipient, tax_options, blocks, invoicing_enabled, creator_email, contact_email } =
        req.body;

      const { proposal } = await proposalesClient.createProposal({
        company_id: Number(PROPOSALES_COMPANY_ID),
        language,
        title_md,
        description_md,
        recipient,
        tax_options,
        blocks,
        invoicing_enabled,
        creator_email,
        contact_email,
      });

      if (proposal_request_id) {
        const proposalRequest = await DB.ProposalRequest.findByPk(proposal_request_id);
        if (proposalRequest) {
          await proposalRequest.update({ proposal_uuid: proposal.uuid, proposal_url: proposal.url, proposal_generated_at: new Date() });
        }
      }

      const { data } = await proposalesClient.getProposal(proposal.uuid);

      res.status(201).json(data);
    } catch (error) {
      next(error);
    }
  };
}
