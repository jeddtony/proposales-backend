"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderItemsModel = void 0;
const sequelize_1 = require("sequelize");
class OrderItemsModel extends sequelize_1.Model {
}
exports.OrderItemsModel = OrderItemsModel;
function default_1(sequelize) {
    OrderItemsModel.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
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
        book_id: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'books',
                key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
        },
        quantity: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
        },
        price_at_purchase: {
            type: sequelize_1.DataTypes.FLOAT,
            allowNull: false,
        },
    }, {
        tableName: 'order_items',
        sequelize,
    });
    return OrderItemsModel;
}
exports.default = default_1;
//# sourceMappingURL=orderItems.model.js.map