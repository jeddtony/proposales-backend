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
    get TransactionModel () {
        return TransactionModel;
    },
    get default () {
        return _default;
    }
});
const _sequelize = require("sequelize");
const _transactioninterface = require("../interfaces/transaction.interface");
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
let TransactionModel = class TransactionModel extends _sequelize.Model {
    constructor(...args){
        super(...args), _define_property(this, "id", void 0), _define_property(this, "user_id", void 0), _define_property(this, "order_id", void 0), _define_property(this, "reference_id", void 0), _define_property(this, "amount", void 0), _define_property(this, "status", void 0), _define_property(this, "created_at", void 0), _define_property(this, "updated_at", void 0);
    }
};
function _default(sequelize) {
    TransactionModel.init({
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
        reference_id: {
            type: _sequelize.DataTypes.STRING,
            allowNull: false
        },
        amount: {
            type: _sequelize.DataTypes.FLOAT,
            allowNull: false
        },
        status: {
            type: _sequelize.DataTypes.ENUM(...Object.values(_transactioninterface.TransactionStatus)),
            allowNull: false,
            defaultValue: _transactioninterface.TransactionStatus.PENDING
        }
    }, {
        tableName: 'transactions',
        sequelize
    });
    return TransactionModel;
}

//# sourceMappingURL=transaction.model.js.map