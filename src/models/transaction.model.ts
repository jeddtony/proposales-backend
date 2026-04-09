import { Sequelize, DataTypes, Model } from 'sequelize';
import { Transaction, TransactionStatus } from '@interfaces/transaction.interface';

export class TransactionModel extends Model<Transaction> implements Transaction {
  public declare id: number;
  public declare user_id: number;
  public declare order_id: number;
  public declare reference_id: string;
  public declare amount: number;
  public declare status: TransactionStatus;
  public declare created_at?: Date;
  public declare updated_at?: Date;
}

export default function (sequelize: Sequelize): typeof TransactionModel {
  TransactionModel.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      order_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'orders',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      reference_id: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      amount: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM(...Object.values(TransactionStatus)),
        allowNull: false,
        defaultValue: TransactionStatus.PENDING,
      },
    },
    {
      tableName: 'transactions',
      sequelize,
    },
  );

  return TransactionModel;
}
