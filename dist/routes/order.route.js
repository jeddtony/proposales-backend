"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderRoute = void 0;
const express_1 = require("express");
const order_controller_1 = require("@controllers/order.controller");
const auth_middleware_1 = require("@middlewares/auth.middleware");
class OrderRoute {
    constructor() {
        this.path = '/order';
        this.router = (0, express_1.Router)();
        this.order = new order_controller_1.OrderController();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.post(`${this.path}`, auth_middleware_1.AuthMiddleware, this.order.createOrder);
        this.router.get(`${this.path}/history`, auth_middleware_1.AuthMiddleware, this.order.getOrderHistory);
        this.router.patch(`${this.path}/:id/pay`, auth_middleware_1.AuthMiddleware, this.order.markOrderAsPaid);
    }
}
exports.OrderRoute = OrderRoute;
//# sourceMappingURL=order.route.js.map