import { Service } from 'typedi';
import { DB } from '@database';
import { CreateProposalRequestDto } from '@dtos/proposalRequest.dto';
import { HttpException } from '@/exceptions/httpException';
import { ProposalRequest } from '@interfaces/proposalRequest.interface';
import { col, fn, literal } from 'sequelize';

@Service()
export class ProposalRequestService {
  public async getProposalRequests(page: number, limit: number): Promise<{ rows: ProposalRequest[]; count: number; total_pages: number }> {
    const offset = (page - 1) * limit;
    const { rows, count } = await DB.ProposalRequest.findAndCountAll({
      order: [['created_at', 'DESC']],
      limit,
      offset,
    });
    return { rows, count, total_pages: Math.ceil(count / limit) };
  }

  public async getProposalRequestById(id: number): Promise<ProposalRequest> {
    const record = await DB.ProposalRequest.findByPk(id);
    if (!record) throw new HttpException(404, 'Proposal request not found');
    return record;
  }

  public async createProposalRequest(data: CreateProposalRequestDto): Promise<ProposalRequest> {
    return DB.ProposalRequest.create({ ...data });
  }

  public async getClients(page: number, limit: number): Promise<{ rows: ProposalRequest[]; count: number; total_pages: number }> {
    const offset = (page - 1) * limit;

    const { rows, count } = await DB.ProposalRequest.findAndCountAll({
      attributes: [
        'email',
        'name',
        'phone_number',
        'company_name',
        [fn('COUNT', col('email')), 'total_requests'],
        [fn('MAX', col('created_at')), 'last_request_at'],
      ],
      group: ['email', 'name', 'phone_number', 'company_name'],
      order: [[literal('last_request_at'), 'DESC']],
      limit,
      offset,
      subQuery: false,
    });

    return { rows, count: count.length, total_pages: Math.ceil(count.length / limit) };
  }
}
