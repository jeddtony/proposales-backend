import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';
import { DashboardService } from '@services/dashboard.service';

export class DashboardController {
  public dashboardService = Container.get(DashboardService);

  public getStats = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const stats = await this.dashboardService.getStats();
      res.status(200).json({ data: stats, message: 'Dashboard stats retrieved successfully' });
    } catch (error) {
      next(error);
    }
  };
}
