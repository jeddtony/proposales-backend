"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookModel = void 0;
const sequelize_1 = require("sequelize");
class BookModel extends sequelize_1.Model {
}
exports.BookModel = BookModel;
function default_1(sequelize) {
    BookModel.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        title: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        author: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        genre: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        is_available: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
        price: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
        },
        stock_quantity: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 20, // i created a default stock quantity for quick testing
        },
        description: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
    }, {
        sequelize,
        tableName: 'books',
    });
    return BookModel;
}
exports.default = default_1;
//# sourceMappingURL=books.model.js.map