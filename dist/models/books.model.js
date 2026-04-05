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
    get BookModel () {
        return BookModel;
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
let BookModel = class BookModel extends _sequelize.Model {
    constructor(...args){
        super(...args), _define_property(this, "id", void 0), _define_property(this, "title", void 0), _define_property(this, "author", void 0), _define_property(this, "genre", void 0), _define_property(this, "is_available", void 0), _define_property(this, "price", void 0), _define_property(this, "stock_quantity", void 0), _define_property(this, "description", void 0), _define_property(this, "createdAt", void 0), _define_property(this, "updatedAt", void 0);
    }
};
function _default(sequelize) {
    BookModel.init({
        id: {
            type: _sequelize.DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        title: {
            type: _sequelize.DataTypes.STRING,
            allowNull: false
        },
        author: {
            type: _sequelize.DataTypes.STRING,
            allowNull: false
        },
        genre: {
            type: _sequelize.DataTypes.STRING,
            allowNull: false
        },
        is_available: {
            type: _sequelize.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },
        price: {
            type: _sequelize.DataTypes.INTEGER,
            allowNull: false
        },
        stock_quantity: {
            type: _sequelize.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 20
        },
        description: {
            type: _sequelize.DataTypes.STRING,
            allowNull: false
        }
    }, {
        sequelize,
        tableName: 'books'
    });
    return BookModel;
}

//# sourceMappingURL=books.model.js.map