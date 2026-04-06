"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const order_interface_1 = require("@interfaces/order.interface");
const _database_1 = require("@database");
const transaction_interface_1 = require("@interfaces/transaction.interface");
class OrderService {
    constructor() {
        this.order = _database_1.DB.Order;
        this.orderItems = _database_1.DB.OrderItems;
        this.shoppingCart = _database_1.DB.ShoppingCart;
        this.shoppingCartItems = _database_1.DB.ShoppingCartItems;
    }
    /**
     * Creates a new order from the user's shopping cart
     * @returns {Promise<Order>} The created order
     */
    async createOrder(orderData) {
        const transaction = await _database_1.DB.sequelize.transaction();
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
        }
        catch (error) {
            await transaction.rollback();
            throw error;
        }
    }
    /**
     * Gets the shopping cart for a user
     * @returns {Promise<any>} The shopping cart record
     */
    async getShoppingCart(userId) {
        const shoppingCart = await this.shoppingCart.findOne({ where: { user_id: userId } });
        if (!shoppingCart) {
            throw new Error('Shopping cart not found');
        }
        return shoppingCart;
    }
    /**
     * Gets all items in a shopping cart
     * @returns {Promise<any[]>} Array of cart items with associated book data
     */
    async getCartItems(cartId) {
        const cartItems = await this.shoppingCartItems.findAll({
            where: { shopping_cart_id: cartId },
            include: [{ model: _database_1.DB.Books, as: 'book' }],
        });
        if (cartItems.length === 0) {
            throw new Error('Shopping cart items not found');
        }
        return cartItems;
    }
    /**
     * Creates the order record
     * @returns {Promise<Order>} The created order record
     */
    async createOrderRecord(orderData, cartItems) {
        const totalAmount = cartItems.reduce((acc, item) => acc + item.book.price * item.quantity, 0);
        return await this.order.create(Object.assign(Object.assign({}, orderData), { total_amount: totalAmount }));
    }
    /**
     * Creates order items records
     * @returns {Promise<void>}
     */
    async createOrderItems(orderId, cartItems, transaction) {
        const orderItems = cartItems.map(item => ({
            order_id: orderId,
            book_id: item.book_id,
            quantity: item.quantity,
            price_at_purchase: item.book.price,
        }));
        await this.orderItems.bulkCreate(orderItems, { transaction });
    }
    /**
     * Clears the shopping items
     * @returns {Promise<void>}
     */
    async clearShoppingCart(cartId) {
        await this.shoppingCartItems.destroy({ where: { shopping_cart_id: cartId } });
    }
    /**
     * Checks inventory availability and locks books for update using pessimistic locking
     * @param {any[]} cartItems
     * @param {any} transaction
     * @returns {Promise<void>}
     */
    async checkAndLockInventory(cartItems, transaction) {
        for (const item of cartItems) {
            const book = await _database_1.DB.Books.findByPk(item.book_id, {
                lock: transaction.LOCK.UPDATE,
                transaction,
            });
            if (!book) {
                throw new Error(`Book with ID ${item.book_id} not found`);
            }
            if (book.stock_quantity < item.quantity) {
                throw new Error(`Insufficient stock for book "${book.title}". Available: ${book.stock_quantity}, Requested: ${item.quantity}`);
            }
        }
    }
    /**
     * Updates book inventory by decrementing quantities
     * @param {any[]} cartItems
     * @param {any} transaction
     * @returns {Promise<void>}
     */
    async updateBookInventory(cartItems, transaction) {
        for (const item of cartItems) {
            await _database_1.DB.Books.decrement('stock_quantity', {
                by: item.quantity,
                where: { id: item.book_id },
                transaction,
            });
        }
    }
    /**
     * Gets order history for a user
     * @param {number} userId
     * @returns {Promise<Order[]>}
     */
    async getOrderHistory(userId) {
        const orders = await this.order.findAll({
            where: { user_id: userId },
            include: [
                {
                    model: this.orderItems,
                    as: 'items',
                    include: [
                        {
                            model: _database_1.DB.Books,
                            as: 'book',
                        },
                    ],
                },
            ],
            order: [['createdAt', 'DESC']],
        });
        return orders;
    }
    /**
     * Marks an order as paid and creates a transaction record
     * @param {number} orderId
     * @param {number} userId
     * @returns {Promise<Order>}
     */
    async markOrderAsPaid(orderId, userId) {
        const transaction = await _database_1.DB.sequelize.transaction();
        try {
            const order = await this.order.findOne({
                where: { id: orderId, user_id: userId },
                lock: transaction.LOCK.UPDATE,
                transaction,
            });
            if (!order) {
                throw new Error('Order not found');
            }
            if (order.status === order_interface_1.OrderStatus.PAID) {
                throw new Error('Order is already marked as paid');
            }
            await this.order.update({ status: order_interface_1.OrderStatus.PAID }, { where: { id: orderId }, transaction });
            const referenceId = `TXN-${Date.now()}-${orderId}`;
            await _database_1.DB.Transaction.create({
                user_id: userId,
                order_id: orderId,
                reference_id: referenceId,
                amount: order.total_amount,
                status: transaction_interface_1.TransactionStatus.SUCCESSFUL,
            }, { transaction });
            await transaction.commit();
            return await this.order.findByPk(orderId, {
                include: [
                    {
                        model: this.orderItems,
                        as: 'items',
                        include: [
                            {
                                model: _database_1.DB.Books,
                                as: 'book',
                            },
                        ],
                    },
                    {
                        model: _database_1.DB.Transaction,
                        as: 'transaction',
                    },
                ],
            });
        }
        catch (error) {
            await transaction.rollback();
            throw error;
        }
    }
}
exports.default = OrderService;
//# sourceMappingURL=orderService.service.js.map