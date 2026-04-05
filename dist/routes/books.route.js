"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "BooksRoute", {
    enumerable: true,
    get: function() {
        return BooksRoute;
    }
});
const _express = require("express");
const _bookscontroller = require("../controllers/books.controller");
const _booksdto = require("../dtos/books.dto");
const _validationmiddleware = require("../middlewares/validation.middleware");
const _authmiddleware = require("../middlewares/auth.middleware");
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
let BooksRoute = class BooksRoute {
    initializeRoutes() {
        this.router.get(`${this.path}`, _authmiddleware.AuthMiddleware, this.books.getBooks);
        this.router.get(`${this.path}/:id`, _authmiddleware.AuthMiddleware, this.books.getBookById);
        this.router.post(`${this.path}`, _authmiddleware.AuthMiddleware, (0, _validationmiddleware.ValidationMiddleware)(_booksdto.CreateBookDto), this.books.createBook);
    }
    constructor(){
        _define_property(this, "path", '/books');
        _define_property(this, "router", (0, _express.Router)());
        _define_property(this, "books", new _bookscontroller.BooksController());
        this.initializeRoutes();
    }
};

//# sourceMappingURL=books.route.js.map