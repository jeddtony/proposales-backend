import { Sequelize, DataTypes, Model } from 'sequelize';
import { ProposalChat, ChatRole } from '@interfaces/proposalChat.interface';

export class ProposalChatModel extends Model<ProposalChat> implements ProposalChat {
  public id: number;
  public proposal_request_id: number;
  public role: ChatRole;
  public message: string;
  public created_at?: Date;
  public updated_at?: Date;
}

export default function (sequelize: Sequelize): typeof ProposalChatModel {
  ProposalChatModel.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      proposal_request_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'proposal_requests',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      role: {
        type: DataTypes.ENUM('assistant', 'user'),
        allowNull: false,
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      tableName: 'proposal_chats',
      sequelize,
    },
  );

  return ProposalChatModel;
}
