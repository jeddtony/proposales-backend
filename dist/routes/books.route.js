"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BooksRoute = void 0;
const express_1 = require("express");
const books_controller_1 = require("@controllers/books.controller");
const books_dto_1 = require("@dtos/books.dto");
const validation_middleware_1 = require("@middlewares/validation.middleware");
const auth_middleware_1 = require("@middlewares/auth.middleware");
class BooksRoute {
    constructor() {
        this.path = '/books';
        this.router = (0, express_1.Router)();
        this.books = new books_controller_1.BooksController();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.get(`${this.path}`, auth_middleware_1.AuthMiddleware, this.books.getBooks);
        this.router.get(`${this.path}/:id`, auth_middleware_1.AuthMiddleware, this.books.getBookById);
        this.router.post(`${this.path}`, auth_middleware_1.AuthMiddleware, (0, validation_middleware_1.ValidationMiddleware)(books_dto_1.CreateBookDto), this.books.createBook);
    }
}
exports.BooksRoute = BooksRoute;
//# sourceMappingURL=books.route.js.map