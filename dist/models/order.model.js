"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderModel = void 0;
const sequelize_1 = require("sequelize");
const order_interface_1 = require("@interfaces/order.interface");
class OrderModel extends sequelize_1.Model {
}
exports.OrderModel = OrderModel;
function default_1(sequelize) {
    OrderModel.init({
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
        order_date: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
        },
        total_amount: {
            type: sequelize_1.DataTypes.FLOAT,
            allowNull: false,
        },
        status: {
            type: sequelize_1.DataTypes.ENUM(...Object.values(order_interface_1.OrderStatus)),
            allowNull: false,
            defaultValue: order_interface_1.OrderStatus.PENDING,
        },
    }, {
        tableName: 'orders',
        sequelize,
    });
    return OrderModel;
}
exports.default = default_1;
//# sourceMappingURL=order.model.js.map