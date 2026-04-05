"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get ShoppingCartItemsModel () {
        return ShoppingCartItemsModel;
    },
    get default () {
        return _default;
    }
});
const _sequelize = require("sequelize");
function _define_property(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
let ShoppingCartItemsModel = class ShoppingCartItemsModel extends _sequelize.Model {
    constructor(...args){
        super(...args), _define_property(this, "id", void 0), _define_property(this, "shopping_cart_id", void 0), _define_property(this, "book_id", void 0), _define_property(this, "quantity", void 0), _define_property(this, "book", void 0), _define_property(this, "createdAt", void 0), _define_property(this, "updatedAt", void 0);
    }
};
function _default(sequelize) {
    ShoppingCartItemsModel.init({
        id: {
            type: _sequelize.DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        shopping_cart_id: {
            type: _sequelize.DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'shopping_carts',
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE'
        },
        book_id: {
            type: _sequelize.DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'books',
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE'
        },
        quantity: {
            type: _sequelize.DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        tableName: 'shopping_cart_items',
        sequelize
    });
    return ShoppingCartItemsModel;
}

//# sourceMappingURL=shoppingCartItems.model.js.map