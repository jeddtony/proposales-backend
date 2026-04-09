import { Sequelize, DataTypes, Model, Optional } from 'sequelize';
import { User } from '@interfaces/users.interface';

export type UserCreationAttributes = Optional<User, 'id' | 'email' | 'password'>;

export class UserModel extends Model<User, UserCreationAttributes> implements User {
  public declare id: number;
  public declare email: string;
  public declare password: string;

  public declare readonly createdAt: Date;
  public declare readonly updatedAt: Date;
}

export default function (sequelize: Sequelize): typeof UserModel {
  UserModel.init(
    {
      id: {
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      email: {
        allowNull: false,
        type: DataTypes.STRING(45),
      },
      password: {
        allowNull: false,
        type: DataTypes.STRING(255),
      },
    },
    {
      tableName: 'users',
      sequelize,
      scopes: {
        withPassword: {
          attributes: ['id', 'email', 'password', 'createdAt', 'updatedAt'],
        },
      },
    },
  );

  return UserModel;
}
