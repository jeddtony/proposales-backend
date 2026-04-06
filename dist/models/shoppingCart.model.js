"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShoppingCartModel = void 0;
const sequelize_1 = require("sequelize");
class ShoppingCartModel extends sequelize_1.Model {
}
exports.ShoppingCartModel = ShoppingCartModel;
function default_1(sequelize) {
    ShoppingCartModel.init({
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
    }, {
        tableName: 'shopping_carts',
        sequelize,
    });
    return ShoppingCartModel;
}
exports.default = default_1;
//# sourceMappingURL=shoppingCart.model.js.map