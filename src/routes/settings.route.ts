import { Router } from 'express';
import { SettingsController } from '@controllers/settings.controller';
import { Routes } from '@interfaces/routes.interface';
import { AuthMiddleware } from '@middlewares/auth.middleware';

export class SettingsRoute implements Routes {
  public router = Router();
  public settings = new SettingsController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get('/settings', AuthMiddleware, this.settings.getSettings);
    this.router.put('/settings', AuthMiddleware, this.settings.updateSettings);
  }
}
