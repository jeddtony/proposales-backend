import { Sequelize, DataTypes, Model } from 'sequelize';
import { Book } from '@interfaces/books.interface';

export class BookModel extends Model<Book> implements Book {
  public id: number;
  public title: string;
  public author: string;
  public genre: string;
  public is_available: boolean;
  public price: number;
  public stock_quantity: number;
  public description: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
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
