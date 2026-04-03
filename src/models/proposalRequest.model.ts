import { Sequelize, DataTypes, Model } from 'sequelize';
import { ProposalRequest } from '@interfaces/proposalRequest.interface';

export class ProposalRequestModel extends Model<ProposalRequest> implements ProposalRequest {
  public id: number;
  public name: string;
  public email: string;
  public phone_number: string;
  public company_name: string;
  public details: string;
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
    },
    {
      tableName: 'proposal_requests',
      sequelize,
    },
  );

  return ProposalRequestModel;
}
