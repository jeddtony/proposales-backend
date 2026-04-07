import { Sequelize, DataTypes, Model } from 'sequelize';
import { Settings, LLMProviderOption } from '@interfaces/settings.interface';

export class SettingsModel extends Model<Settings> implements Settings {
  public id: number;
  public llm_provider: LLMProviderOption;
  public created_at?: Date;
  public updated_at?: Date;
}

export default function (sequelize: Sequelize): typeof SettingsModel {
  SettingsModel.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      llm_provider: {
        type: DataTypes.ENUM('claude', 'openai', 'huggingface', 'vercel-ai'),
        allowNull: false,
        defaultValue: 'claude',
      },
    },
    {
      tableName: 'settings',
      sequelize,
    },
  );

  return SettingsModel;
}
