"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ShoppingCartRoute", {
    enumerable: true,
    get: function() {
        return ShoppingCartRoute;
    }
});
const _express = require("express");
const _shoppingCartcontroller = require("../controllers/shoppingCart.controller");
const _authmiddleware = require("../middlewares/auth.middleware");
const _validationmiddleware = require("../middlewares/validation.middleware");
const _shoppingCartdto = require("../dtos/shoppingCart.dto");
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
let ShoppingCartRoute = class ShoppingCartRoute {
    initializeRoutes() {
        this.router.get(`${this.path}`, _authmiddleware.AuthMiddleware, this.shoppingCart.getShoppingCart);
        this.router.post(`${this.path}`, _authmiddleware.AuthMiddleware, (0, _validationmiddleware.ValidationMiddleware)(_shoppingCartdto.AddBookToShoppingCartRequestDto), this.shoppingCart.addBookToShoppingCart);
    }
    constructor(){
        _define_property(this, "path", '/shopping-cart');
        _define_property(this, "router", (0, _express.Router)());
        _define_property(this, "shoppingCart", new _shoppingCartcontroller.ShoppingCartController());
        this.initializeRoutes();
    }
};

//# sourceMappingURL=shoppingCart.route.js.map