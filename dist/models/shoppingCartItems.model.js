"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShoppingCartItemsModel = void 0;
const sequelize_1 = require("sequelize");
class ShoppingCartItemsModel extends sequelize_1.Model {
}
exports.ShoppingCartItemsModel = ShoppingCartItemsModel;
function default_1(sequelize) {
    ShoppingCartItemsModel.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        shopping_cart_id: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'shopping_carts',
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
    }, {
        tableName: 'shopping_cart_items',
        sequelize,
    });
    return ShoppingCartItemsModel;
}
exports.default = default_1;
//# sourceMappingURL=shoppingCartItems.model.js.map