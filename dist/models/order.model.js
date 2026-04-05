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
    get OrderModel () {
        return OrderModel;
    },
    get default () {
        return _default;
    }
});
const _sequelize = require("sequelize");
const _orderinterface = require("../interfaces/order.interface");
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
let OrderModel = class OrderModel extends _sequelize.Model {
    constructor(...args){
        super(...args), _define_property(this, "id", void 0), _define_property(this, "user_id", void 0), _define_property(this, "order_date", void 0), _define_property(this, "total_amount", void 0), _define_property(this, "status", void 0), _define_property(this, "created_at", void 0), _define_property(this, "updated_at", void 0);
    }
};
function _default(sequelize) {
    OrderModel.init({
        id: {
            type: _sequelize.DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        user_id: {
            type: _sequelize.DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE'
        },
        order_date: {
            type: _sequelize.DataTypes.DATE,
            allowNull: false
        },
        total_amount: {
            type: _sequelize.DataTypes.FLOAT,
            allowNull: false
        },
        status: {
            type: _sequelize.DataTypes.ENUM(...Object.values(_orderinterface.OrderStatus)),
            allowNull: false,
            defaultValue: _orderinterface.OrderStatus.PENDING
        }
    }, {
        tableName: 'orders',
        sequelize
    });
    return OrderModel;
}

//# sourceMappingURL=order.model.js.map