import { Service } from 'typedi';
import { DB } from '@database';
import { Op, fn, col } from 'sequelize';

interface ProposalStat {
  label: string;
  percentage: number;
  count: string;
  highlight?: boolean;
}

@Service()
export class DashboardService {
  public async getStats(): Promise<{
    total_rfps: number;
    total_clients: number;
    rfps_last_7_days: number;
    proposal_stats: ProposalStat[];
  }> {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const [totalResult, clientsResult, recentResult, draftResult, pendingResult] = await Promise.all([
      DB.ProposalRequest.findAndCountAll({ attributes: ['id'] }),
      DB.ProposalRequest.findAndCountAll({
        attributes: [[fn('COUNT', col('email')), 'count']],
        group: ['email'],
      }),
      DB.ProposalRequest.findAndCountAll({
        attributes: ['id'],
        where: { created_at: { [Op.gte]: sevenDaysAgo } },
      }),
      DB.ProposalRequest.findAndCountAll({
        attributes: ['id'],
        where: { proposal_generated_at: { [Op.ne]: null } },
      }),
      DB.ProposalRequest.findAndCountAll({
        attributes: ['id'],
        where: { proposal_generated_at: null },
      }),
    ]);

    const draftCount = draftResult.count as number;
    const pendingCount = pendingResult.count as number;
    const pendingPct = draftCount > 0 ? Math.round((pendingCount / draftCount) * 100) : 0;

    return {
      total_rfps: totalResult.count as number,
      total_clients: (clientsResult.count as unknown[]).length,
      rfps_last_7_days: recentResult.count as number,
      proposal_stats: [
        { label: 'Draft', percentage: 100, count: `${draftCount} Proposals`, highlight: true },
        { label: 'Pending', percentage: pendingPct, count: `${pendingCount} RFPs` },
      ],
    };
  }
}
