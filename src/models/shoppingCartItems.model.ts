import { Sequelize, DataTypes, Model } from 'sequelize';
import { ShoppingCartItems } from '@interfaces/shoppingCartItems.interface';
import { Book } from '@interfaces/books.interface';

export class ShoppingCartItemsModel extends Model<ShoppingCartItems> implements ShoppingCartItems {
  public id: number;
  public shopping_cart_id: number;
  public book_id: number;
  public quantity: number;
  public book?: Book;
  public createdAt!: Date;
  public updatedAt!: Date;
}

export default function (sequelize: Sequelize): typeof ShoppingCartItemsModel {
  ShoppingCartItemsModel.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      shopping_cart_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'shopping_carts',
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
    },
    {
      tableName: 'shopping_cart_items',
      sequelize,
    },
  );

  return ShoppingCartItemsModel;
}
