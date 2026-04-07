import { Sequelize, DataTypes, Model } from 'sequelize';
import { ProposalRequest } from '@interfaces/proposalRequest.interface';

export class ProposalRequestModel extends Model<ProposalRequest> implements ProposalRequest {
  public id: number;
  public name: string;
  public email: string;
  public phone_number: string;
  public company_name: string;
  public details: string;
  public event_date?: Date | null;
  public guests?: number | null;
  public budget?: number | null;
  public proposal_uuid?: string | null;
  public proposal_url?: string | null;
  public proposal_generated_at?: Date | null;
  public created_at?: Date;
  public updated_at?: Date;
}

export default function (sequelize: Sequelize): typeof ProposalRequestModel {
  ProposalRequestModel.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      phone_number: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      company_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      details: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      event_date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        defaultValue: null,
      },
      guests: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null,
      },
      budget: {
        type: DataTypes.FLOAT,
        allowNull: true,
        defaultValue: null,
      },
      proposal_uuid: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null,
      },
      proposal_url: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null,
      },
      proposal_generated_at: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null,
      },
    },
    {
      tableName: 'proposal_requests',
      sequelize,
    },
  );

  return ProposalRequestModel;
}
