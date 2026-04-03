import { Service } from 'typedi';
import { DB } from '@database';
import { CreateProposalRequestDto } from '@dtos/proposalRequest.dto';
import { HttpException } from '@/exceptions/httpException';
import { ProposalRequest } from '@interfaces/proposalRequest.interface';

@Service()
export class ProposalRequestService {
  public async getProposalRequests(): Promise<ProposalRequest[]> {
    return DB.ProposalRequest.findAll();
  }

  public async getProposalRequestById(id: number): Promise<ProposalRequest> {
    const record = await DB.ProposalRequest.findByPk(id);
    if (!record) throw new HttpException(404, 'Proposal request not found');
    return record;
  }

  public async createProposalRequest(data: CreateProposalRequestDto): Promise<ProposalRequest> {
    return DB.ProposalRequest.create({ ...data });
  }
}
