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
    get UserModel () {
        return UserModel;
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
let UserModel = class UserModel extends _sequelize.Model {
    constructor(...args){
        super(...args), _define_property(this, "id", void 0), _define_property(this, "email", void 0), _define_property(this, "password", void 0), _define_property(this, "createdAt", void 0), _define_property(this, "updatedAt", void 0);
    }
};
function _default(sequelize) {
    UserModel.init({
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: _sequelize.DataTypes.INTEGER
        },
        email: {
            allowNull: false,
            type: _sequelize.DataTypes.STRING(45)
        },
        password: {
            allowNull: false,
            type: _sequelize.DataTypes.STRING(255)
        }
    }, {
        tableName: 'users',
        sequelize,
        defaultScope: {
            attributes: {
                exclude: [
                    'password'
                ]
            }
        },
        scopes: {
            withPassword: {
                attributes: {
                    exclude: []
                }
            }
        }
    });
    return UserModel;
}

//# sourceMappingURL=users.model.js.map