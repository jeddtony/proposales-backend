"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShoppingCartRoute = void 0;
const express_1 = require("express");
const shoppingCart_controller_1 = require("@controllers/shoppingCart.controller");
const auth_middleware_1 = require("@middlewares/auth.middleware");
const validation_middleware_1 = require("@middlewares/validation.middleware");
const shoppingCart_dto_1 = require("@dtos/shoppingCart.dto");
class ShoppingCartRoute {
    constructor() {
        this.path = '/shopping-cart';
        this.router = (0, express_1.Router)();
        this.shoppingCart = new shoppingCart_controller_1.ShoppingCartController();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.get(`${this.path}`, auth_middleware_1.AuthMiddleware, this.shoppingCart.getShoppingCart);
        this.router.post(`${this.path}`, auth_middleware_1.AuthMiddleware, (0, validation_middleware_1.ValidationMiddleware)(shoppingCart_dto_1.AddBookToShoppingCartRequestDto), this.shoppingCart.addBookToShoppingCart);
    }
}
exports.ShoppingCartRoute = ShoppingCartRoute;
//# sourceMappingURL=shoppingCart.route.js.map