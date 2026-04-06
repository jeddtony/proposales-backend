"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderController = void 0;
const tslib_1 = require("tslib");
const orderService_service_1 = tslib_1.__importDefault(require("@services/orderService.service"));
class OrderController {
    constructor() {
        this.orderService = new orderService_service_1.default();
        this.createOrder = async (req, res, next) => {
            try {
                const userId = req.user.id;
                const orderData = req.body;
                const createOrderData = await this.orderService.createOrder(Object.assign(Object.assign({}, orderData), { user_id: userId, order_date: new Date() }));
                res.status(201).json({ data: createOrderData, message: 'created' });
            }
            catch (error) {
                next(error);
            }
        };
        this.getOrderHistory = async (req, res, next) => {
            try {
                const userId = req.user.id;
                const orderHistory = await this.orderService.getOrderHistory(userId);
                res.status(200).json({ data: orderHistory, message: 'Order history retrieved' });
            }
            catch (error) {
                next(error);
            }
        };
        this.markOrderAsPaid = async (req, res, next) => {
            try {
                const userId = req.user.id;
                const orderId = Number(req.params.id);
                if (isNaN(orderId)) {
                    res.status(400).json({ message: 'Invalid order ID' });
                    return;
                }
                const updatedOrder = await this.orderService.markOrderAsPaid(orderId, userId);
                res.status(200).json({ data: updatedOrder, message: 'Order marked as paid successfully' });
            }
            catch (error) {
                next(error);
            }
        };
    }
}
exports.OrderController = OrderController;
//# sourceMappingURL=order.controller.js.map