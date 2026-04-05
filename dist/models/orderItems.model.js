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
    get OrderItemsModel () {
        return OrderItemsModel;
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
let OrderItemsModel = class OrderItemsModel extends _sequelize.Model {
    constructor(...args){
        super(...args), _define_property(this, "id", void 0), _define_property(this, "order_id", void 0), _define_property(this, "book_id", void 0), _define_property(this, "quantity", void 0), _define_property(this, "price_at_purchase", void 0), _define_property(this, "created_at", void 0), _define_property(this, "updated_at", void 0);
    }
};
function _default(sequelize) {
    OrderItemsModel.init({
        id: {
            type: _sequelize.DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        order_id: {
            type: _sequelize.DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'orders',
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
        },
        price_at_purchase: {
            type: _sequelize.DataTypes.FLOAT,
            allowNull: false
        }
    }, {
        tableName: 'order_items',
        sequelize
    });
    return OrderItemsModel;
}

//# sourceMappingURL=orderItems.model.js.map