import { Service } from 'typedi';
import { DB } from '@database';
import { HttpException } from '@/exceptions/httpException';
import { Settings, LLMProviderOption } from '@interfaces/settings.interface';

@Service()
export class SettingsService {
  public async getSettings(): Promise<Settings> {
    const settings = await DB.Settings.findOne({ order: [['id', 'ASC']] });
    if (!settings) throw new HttpException(404, 'Settings not found');
    return settings;
  }

  public async updateSettings(data: { llm_provider: LLMProviderOption }): Promise<Settings> {
    const settings = await DB.Settings.findOne({ order: [['id', 'ASC']] });
    if (!settings) throw new HttpException(404, 'Settings not found');
    return settings.update(data);
  }
}
