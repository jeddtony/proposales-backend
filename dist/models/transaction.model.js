"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionModel = void 0;
const sequelize_1 = require("sequelize");
const transaction_interface_1 = require("@interfaces/transaction.interface");
class TransactionModel extends sequelize_1.Model {
}
exports.TransactionModel = TransactionModel;
function default_1(sequelize) {
    TransactionModel.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        user_id: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
        },
        order_id: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'orders',
                key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
        },
        reference_id: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        amount: {
            type: sequelize_1.DataTypes.FLOAT,
            allowNull: false,
        },
        status: {
            type: sequelize_1.DataTypes.ENUM(...Object.values(transaction_interface_1.TransactionStatus)),
            allowNull: false,
            defaultValue: transaction_interface_1.TransactionStatus.PENDING,
        },
    }, {
        tableName: 'transactions',
        sequelize,
    });
    return TransactionModel;
}
exports.default = default_1;
//# sourceMappingURL=transaction.model.js.map