import { Sequelize, DataTypes, Model } from 'sequelize';
import { ShoppingCart } from '@interfaces/shoppingCart.interface';

export class ShoppingCartModel extends Model<ShoppingCart> implements ShoppingCart {
  public id: number;
  public user_id: number;
  public createdAt!: Date;
  public updatedAt!: Date;
}

export default function (sequelize: Sequelize): typeof ShoppingCartModel {
  ShoppingCartModel.init(
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
    },
    {
      tableName: 'shopping_carts',
      sequelize,
    },
  );

  return ShoppingCartModel;
}