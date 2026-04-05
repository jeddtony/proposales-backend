"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return _default;
    }
});
const _database = require("../database");
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
function _object_spread(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = arguments[i] != null ? arguments[i] : {};
        var ownKeys = Object.keys(source);
        if (typeof Object.getOwnPropertySymbols === "function") {
            ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
                return Object.getOwnPropertyDescriptor(source, sym).enumerable;
            }));
        }
        ownKeys.forEach(function(key) {
            _define_property(target, key, source[key]);
        });
    }
    return target;
}
function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);
    if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(object);
        if (enumerableOnly) {
            symbols = symbols.filter(function(sym) {
                return Object.getOwnPropertyDescriptor(object, sym).enumerable;
            });
        }
        keys.push.apply(keys, symbols);
    }
    return keys;
}
function _object_spread_props(target, source) {
    source = source != null ? source : {};
    if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
        ownKeys(Object(source)).forEach(function(key) {
            Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
    }
    return target;
}
let BookService = class BookService {
    async findAllBooks() {
        const allBooks = await this.books.findAll();
        return allBooks;
    }
    async findBookById(bookId) {
        const book = await this.books.findByPk(bookId);
        return book;
    }
    async checkBookExists(title, author) {
        const existingBook = await this.books.findOne({
            where: {
                title,
                author
            }
        });
        return existingBook;
    }
    async createBook(bookData) {
        const existingBook = await this.checkBookExists(bookData.title, bookData.author);
        if (existingBook) {
            throw new Error(`A book with title "${bookData.title}" by "${bookData.author}" already exists`);
        }
        const bookToCreate = _object_spread_props(_object_spread({}, bookData), {
            is_available: bookData.stock_quantity > 0
        });
        const book = await this.books.create(bookToCreate);
        return book;
    }
    async searchBooks(query) {
        const { Op } = require('sequelize');
        const books = await this.books.findAll({
            where: {
                [Op.or]: [
                    {
                        title: {
                            [Op.like]: `%${query}%`
                        }
                    },
                    {
                        author: {
                            [Op.like]: `%${query}%`
                        }
                    },
                    {
                        genre: {
                            [Op.like]: `%${query}%`
                        }
                    }
                ]
            }
        });
        return books;
    }
    constructor(){
        _define_property(this, "books", _database.DB.Books);
    }
};
const _default = BookService;

//# sourceMappingURL=books.service.js.map