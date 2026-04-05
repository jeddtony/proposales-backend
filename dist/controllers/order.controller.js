"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "OrderController", {
    enumerable: true,
    get: function() {
        return OrderController;
    }
});
const _orderServiceservice = /*#__PURE__*/ _interop_require_default(require("../services/orderService.service"));
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
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
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
let OrderController = class OrderController {
    constructor(){
        _define_property(this, "orderService", new _orderServiceservice.default());
        _define_property(this, "createOrder", async (req, res, next)=>{
            try {
                const userId = req.user.id;
                const orderData = req.body;
                const createOrderData = await this.orderService.createOrder(_object_spread_props(_object_spread({}, orderData), {
                    user_id: userId,
                    order_date: new Date()
                }));
                res.status(201).json({
                    data: createOrderData,
                    message: 'created'
                });
            } catch (error) {
                next(error);
            }
        });
        _define_property(this, "getOrderHistory", async (req, res, next)=>{
            try {
                const userId = req.user.id;
                const orderHistory = await this.orderService.getOrderHistory(userId);
                res.status(200).json({
                    data: orderHistory,
                    message: 'Order history retrieved'
                });
            } catch (error) {
                next(error);
            }
        });
        _define_property(this, "markOrderAsPaid", async (req, res, next)=>{
            try {
                const userId = req.user.id;
                const orderId = Number(req.params.id);
                if (isNaN(orderId)) {
                    res.status(400).json({
                        message: 'Invalid order ID'
                    });
                    return;
                }
                const updatedOrder = await this.orderService.markOrderAsPaid(orderId, userId);
                res.status(200).json({
                    data: updatedOrder,
                    message: 'Order marked as paid successfully'
                });
            } catch (error) {
                next(error);
            }
        });
    }
};

//# sourceMappingURL=order.controller.js.map