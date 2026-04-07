import { Router } from 'express';
import { DashboardController } from '@controllers/dashboard.controller';
import { Routes } from '@interfaces/routes.interface';
import { AuthMiddleware } from '@middlewares/auth.middleware';

export class DashboardRoute implements Routes {
  public router = Router();
  public dashboard = new DashboardController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get('/dashboard/stats', AuthMiddleware, this.dashboard.getStats);
  }
}
