import { Sequelize, DataTypes, Model } from 'sequelize';
import { OrderItems } from '@interfaces/orderItems.interface';

export class OrderItemsModel extends Model<OrderItems> implements OrderItems {
  public id: number;
  public order_id: number;
  public book_id: number;
  public quantity: number;
  public price_at_purchase: number;
  public created_at?: Date;
  public updated_at?: Date;
}

export default function (sequelize: Sequelize): typeof OrderItemsModel {
  OrderItemsModel.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
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
      book_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'books',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      price_at_purchase: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
    },
    {
      tableName: 'order_items',
      sequelize,
    },
  );

  return OrderItemsModel;
}
