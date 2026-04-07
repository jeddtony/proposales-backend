import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';
import { SettingsService } from '@services/settings.service';

export class SettingsController {
  public settingsService = Container.get(SettingsService);

  public getSettings = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const settings = await this.settingsService.getSettings();
      res.status(200).json({ data: settings, message: 'Settings retrieved successfully' });
    } catch (error) {
      next(error);
    }
  };

  public updateSettings = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { llm_provider } = req.body;
      const updated = await this.settingsService.updateSettings({ llm_provider });
      res.status(200).json({ data: updated, message: 'Settings updated successfully' });
    } catch (error) {
      next(error);
    }
  };
}
