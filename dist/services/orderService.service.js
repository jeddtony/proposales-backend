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
const _orderinterface = require("../interfaces/order.interface");
const _database = require("../database");
const _transactioninterface = require("../interfaces/transaction.interface");
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
let OrderService = class OrderService {
    async createOrder(orderData) {
        const transaction = await _database.DB.sequelize.transaction();
        try {
            const shoppingCart = await this.getShoppingCart(orderData.user_id);
            const cartItems = await this.getCartItems(shoppingCart.id);
            await this.checkAndLockInventory(cartItems, transaction);
            const order = await this.createOrderRecord(orderData, cartItems);
            await this.createOrderItems(order.id, cartItems, transaction);
            await this.updateBookInventory(cartItems, transaction);
            await this.clearShoppingCart(shoppingCart.id);
            await transaction.commit();
            return order;
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }
    async getShoppingCart(userId) {
        const shoppingCart = await this.shoppingCart.findOne({
            where: {
                user_id: userId
            }
        });
        if (!shoppingCart) {
            throw new Error('Shopping cart not found');
        }
        return shoppingCart;
    }
    async getCartItems(cartId) {
        const cartItems = await this.shoppingCartItems.findAll({
            where: {
                shopping_cart_id: cartId
            },
            include: [
                {
                    model: _database.DB.Books,
                    as: 'book'
                }
            ]
        });
        if (cartItems.length === 0) {
            throw new Error('Shopping cart items not found');
        }
        return cartItems;
    }
    async createOrderRecord(orderData, cartItems) {
        const totalAmount = cartItems.reduce((acc, item)=>acc + item.book.price * item.quantity, 0);
        return await this.order.create(_object_spread_props(_object_spread({}, orderData), {
            total_amount: totalAmount
        }));
    }
    async createOrderItems(orderId, cartItems, transaction) {
        const orderItems = cartItems.map((item)=>({
                order_id: orderId,
                book_id: item.book_id,
                quantity: item.quantity,
                price_at_purchase: item.book.price
            }));
        await this.orderItems.bulkCreate(orderItems, {
            transaction
        });
    }
    async clearShoppingCart(cartId) {
        await this.shoppingCartItems.destroy({
            where: {
                shopping_cart_id: cartId
            }
        });
    }
    async checkAndLockInventory(cartItems, transaction) {
        for (const item of cartItems){
            const book = await _database.DB.Books.findByPk(item.book_id, {
                lock: transaction.LOCK.UPDATE,
                transaction
            });
            if (!book) {
                throw new Error(`Book with ID ${item.book_id} not found`);
            }
            if (book.stock_quantity < item.quantity) {
                throw new Error(`Insufficient stock for book "${book.title}". Available: ${book.stock_quantity}, Requested: ${item.quantity}`);
            }
        }
    }
    async updateBookInventory(cartItems, transaction) {
        for (const item of cartItems){
            await _database.DB.Books.decrement('stock_quantity', {
                by: item.quantity,
                where: {
                    id: item.book_id
                },
                transaction
            });
        }
    }
    async getOrderHistory(userId) {
        const orders = await this.order.findAll({
            where: {
                user_id: userId
            },
            include: [
                {
                    model: this.orderItems,
                    as: 'items',
                    include: [
                        {
                            model: _database.DB.Books,
                            as: 'book'
                        }
                    ]
                }
            ],
            order: [
                [
                    'createdAt',
                    'DESC'
                ]
            ]
        });
        return orders;
    }
    async markOrderAsPaid(orderId, userId) {
        const transaction = await _database.DB.sequelize.transaction();
        try {
            const order = await this.order.findOne({
                where: {
                    id: orderId,
                    user_id: userId
                },
                lock: transaction.LOCK.UPDATE,
                transaction
            });
            if (!order) {
                throw new Error('Order not found');
            }
            if (order.status === _orderinterface.OrderStatus.PAID) {
                throw new Error('Order is already marked as paid');
            }
            await this.order.update({
                status: _orderinterface.OrderStatus.PAID
            }, {
                where: {
                    id: orderId
                },
                transaction
            });
            const referenceId = `TXN-${Date.now()}-${orderId}`;
            await _database.DB.Transaction.create({
                user_id: userId,
                order_id: orderId,
                reference_id: referenceId,
                amount: order.total_amount,
                status: _transactioninterface.TransactionStatus.SUCCESSFUL
            }, {
                transaction
            });
            await transaction.commit();
            return await this.order.findByPk(orderId, {
                include: [
                    {
                        model: this.orderItems,
                        as: 'items',
                        include: [
                            {
                                model: _database.DB.Books,
                                as: 'book'
                            }
                        ]
                    },
                    {
                        model: _database.DB.Transaction,
                        as: 'transaction'
                    }
                ]
            });
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }
    constructor(){
        _define_property(this, "order", _database.DB.Order);
        _define_property(this, "orderItems", _database.DB.OrderItems);
        _define_property(this, "shoppingCart", _database.DB.ShoppingCart);
        _define_property(this, "shoppingCartItems", _database.DB.ShoppingCartItems);
    }
};
const _default = OrderService;

//# sourceMappingURL=orderService.service.js.map