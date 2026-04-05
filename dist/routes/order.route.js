"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "OrderRoute", {
    enumerable: true,
    get: function() {
        return OrderRoute;
    }
});
const _express = require("express");
const _ordercontroller = require("../controllers/order.controller");
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
let OrderRoute = class OrderRoute {
    initializeRoutes() {
        this.router.post(`${this.path}`, _authmiddleware.AuthMiddleware, this.order.createOrder);
        this.router.get(`${this.path}/history`, _authmiddleware.AuthMiddleware, this.order.getOrderHistory);
        this.router.patch(`${this.path}/:id/pay`, _authmiddleware.AuthMiddleware, this.order.markOrderAsPaid);
    }
    constructor(){
        _define_property(this, "path", '/order');
        _define_property(this, "router", (0, _express.Router)());
        _define_property(this, "order", new _ordercontroller.OrderController());
        this.initializeRoutes();
    }
};

//# sourceMappingURL=order.route.js.map