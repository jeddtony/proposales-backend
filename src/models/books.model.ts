import { Sequelize, DataTypes, Model } from 'sequelize';
import { Book } from '@interfaces/books.interface';

export class BookModel extends Model<Book> implements Book {
  public declare id: number;
  public declare title: string;
  public declare author: string;
  public declare genre: string;
  public declare is_available: boolean;
  public declare price: number;
  public declare stock_quantity: number;
  public declare description: string;

  public declare readonly createdAt: Date;
  public declare readonly updatedAt: Date;
}

export default function (sequelize: Sequelize): typeof BookModel {
  BookModel.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      author: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      genre: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      is_available: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      price: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      stock_quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 20, // i created a default stock quantity for quick testing
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: 'books',
    },
  );

  return BookModel;
}
