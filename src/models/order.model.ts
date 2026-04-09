import { Sequelize, DataTypes, Model } from 'sequelize';
import { Order, OrderStatus } from '@interfaces/order.interface';

export class OrderModel extends Model<Order> implements Order {
  public declare id: number;
  public declare user_id: number;
  public declare order_date: Date;
  public declare total_amount: number;
  public declare status: OrderStatus;
  public declare created_at?: Date;
  public declare updated_at?: Date;
}

export default function (sequelize: Sequelize): typeof OrderModel {
  OrderModel.init(
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
      order_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      total_amount: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM(...Object.values(OrderStatus)),
        allowNull: false,
        defaultValue: OrderStatus.PENDING,
      },
    },
    {
      tableName: 'orders',
      sequelize,
    },
  );

  return OrderModel;
}
