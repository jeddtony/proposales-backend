"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _testdbmock = require("./utils/test-db-mock");
const _sequelize = require("sequelize");
const _supertest = /*#__PURE__*/ _interop_require_default(require("supertest"));
const _orderroute = require("../routes/order.route");
const _testserver = require("./utils/test-server");
const _orderinterface = require("../interfaces/order.interface");
const _transactioninterface = require("../interfaces/transaction.interface");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
jest.mock('@middlewares/auth.middleware', ()=>({
        AuthMiddleware: (req, res, next)=>{
            req.user = {
                id: 1
            };
            next();
        }
    }));
let testServer;
beforeAll(async ()=>{
    testServer = new _testserver.TestServer([
        new _orderroute.OrderRoute()
    ]);
    await testServer.start();
});
afterAll(async ()=>{
    if (testServer) {
        await testServer.stop();
    }
});
describe('Testing Orders', ()=>{
    describe('[POST] /order', ()=>{
        it('response create order successfully', async ()=>{
            const orderData = {
                user_id: 1,
                order_date: new Date()
            };
            const DB = (0, _testdbmock.getMockedDB)();
            DB.ShoppingCart.findOne = jest.fn().mockReturnValue({
                id: 1,
                user_id: 1,
                createdAt: new Date(),
                updatedAt: new Date()
            });
            DB.ShoppingCartItems.findAll = jest.fn().mockReturnValue([
                {
                    id: 1,
                    shopping_cart_id: 1,
                    book_id: 1,
                    quantity: 2,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    book: {
                        id: 1,
                        title: 'The Great Gatsby',
                        author: 'F. Scott Fitzgerald',
                        price: 1500,
                        stock_quantity: 10
                    }
                },
                {
                    id: 2,
                    shopping_cart_id: 1,
                    book_id: 2,
                    quantity: 1,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    book: {
                        id: 2,
                        title: 'To Kill a Mockingbird',
                        author: 'Harper Lee',
                        price: 1200,
                        stock_quantity: 5
                    }
                }
            ]);
            DB.Books.findByPk = jest.fn().mockImplementation((id)=>{
                const books = {
                    1: {
                        id: 1,
                        title: 'The Great Gatsby',
                        stock_quantity: 10
                    },
                    2: {
                        id: 2,
                        title: 'To Kill a Mockingbird',
                        stock_quantity: 5
                    }
                };
                return books[id];
            });
            DB.Order.create = jest.fn().mockReturnValue({
                id: 1,
                user_id: 1,
                order_date: new Date(),
                total_amount: 4200,
                status: _orderinterface.OrderStatus.PENDING,
                createdAt: new Date(),
                updatedAt: new Date()
            });
            DB.OrderItems.bulkCreate = jest.fn().mockResolvedValue([
                {
                    id: 1,
                    order_id: 1,
                    book_id: 1,
                    quantity: 2,
                    price_at_purchase: 1500
                },
                {
                    id: 2,
                    order_id: 1,
                    book_id: 2,
                    quantity: 1,
                    price_at_purchase: 1200
                }
            ]);
            DB.Books.decrement = jest.fn().mockResolvedValue(1);
            DB.ShoppingCartItems.destroy = jest.fn().mockResolvedValue(2);
            DB.sequelize.transaction = jest.fn().mockImplementation(async (callback)=>{
                const mockTransaction = {
                    commit: jest.fn(),
                    rollback: jest.fn(),
                    LOCK: {
                        UPDATE: 'UPDATE'
                    }
                };
                if (callback) {
                    await callback(mockTransaction);
                }
                return mockTransaction;
            });
            _sequelize.Sequelize.authenticate = jest.fn();
            return (0, _supertest.default)(testServer.getServer()).post('/order').send(orderData).expect(201);
        });
        it('response error - shopping cart not found', async ()=>{
            const orderData = {
                user_id: 1,
                order_date: new Date()
            };
            const DB = (0, _testdbmock.getMockedDB)();
            DB.ShoppingCart.findOne = jest.fn().mockReturnValue(null);
            _sequelize.Sequelize.authenticate = jest.fn();
            return (0, _supertest.default)(testServer.getServer()).post('/order').send(orderData).expect(500);
        });
        it('response error - shopping cart is empty', async ()=>{
            const orderData = {
                user_id: 1,
                order_date: new Date()
            };
            const DB = (0, _testdbmock.getMockedDB)();
            DB.ShoppingCart.findOne = jest.fn().mockReturnValue({
                id: 1,
                user_id: 1,
                createdAt: new Date(),
                updatedAt: new Date()
            });
            DB.ShoppingCartItems.findAll = jest.fn().mockReturnValue([]);
            _sequelize.Sequelize.authenticate = jest.fn();
            return (0, _supertest.default)(testServer.getServer()).post('/order').send(orderData).expect(500);
        });
        it('response error - insufficient stock', async ()=>{
            const orderData = {
                user_id: 1,
                order_date: new Date()
            };
            const DB = (0, _testdbmock.getMockedDB)();
            DB.ShoppingCart.findOne = jest.fn().mockReturnValue({
                id: 1,
                user_id: 1,
                createdAt: new Date(),
                updatedAt: new Date()
            });
            DB.ShoppingCartItems.findAll = jest.fn().mockReturnValue([
                {
                    id: 1,
                    shopping_cart_id: 1,
                    book_id: 1,
                    quantity: 5,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    book: {
                        id: 1,
                        title: 'The Great Gatsby',
                        author: 'F. Scott Fitzgerald',
                        price: 1500,
                        stock_quantity: 10
                    }
                }
            ]);
            DB.Books.findByPk = jest.fn().mockReturnValue({
                id: 1,
                title: 'The Great Gatsby',
                stock_quantity: 2
            });
            DB.sequelize.transaction = jest.fn().mockImplementation(async (callback)=>{
                const mockTransaction = {
                    commit: jest.fn(),
                    rollback: jest.fn(),
                    LOCK: {
                        UPDATE: 'UPDATE'
                    }
                };
                if (callback) {
                    await callback(mockTransaction);
                }
                return mockTransaction;
            });
            _sequelize.Sequelize.authenticate = jest.fn();
            return (0, _supertest.default)(testServer.getServer()).post('/order').send(orderData).expect(500);
        });
    });
    describe('[GET] /order/history', ()=>{
        it('response get order history successfully', async ()=>{
            const DB = (0, _testdbmock.getMockedDB)();
            DB.Order.findAll = jest.fn().mockReturnValue([
                {
                    id: 1,
                    user_id: 1,
                    order_date: new Date(),
                    total_amount: 4200,
                    status: _orderinterface.OrderStatus.PAID,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    items: [
                        {
                            id: 1,
                            order_id: 1,
                            book_id: 1,
                            quantity: 2,
                            price_at_purchase: 1500,
                            book: {
                                id: 1,
                                title: 'The Great Gatsby',
                                author: 'F. Scott Fitzgerald',
                                price: 1500
                            }
                        },
                        {
                            id: 2,
                            order_id: 1,
                            book_id: 2,
                            quantity: 1,
                            price_at_purchase: 1200,
                            book: {
                                id: 2,
                                title: 'To Kill a Mockingbird',
                                author: 'Harper Lee',
                                price: 1200
                            }
                        }
                    ]
                },
                {
                    id: 2,
                    user_id: 1,
                    order_date: new Date(),
                    total_amount: 1800,
                    status: _orderinterface.OrderStatus.PENDING,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    items: [
                        {
                            id: 3,
                            order_id: 2,
                            book_id: 3,
                            quantity: 1,
                            price_at_purchase: 1800,
                            book: {
                                id: 3,
                                title: '1984',
                                author: 'George Orwell',
                                price: 1800
                            }
                        }
                    ]
                }
            ]);
            _sequelize.Sequelize.authenticate = jest.fn();
            return (0, _supertest.default)(testServer.getServer()).get('/order/history').expect(200);
        });
        it('response get empty order history', async ()=>{
            const DB = (0, _testdbmock.getMockedDB)();
            DB.Order.findAll = jest.fn().mockReturnValue([]);
            _sequelize.Sequelize.authenticate = jest.fn();
            return (0, _supertest.default)(testServer.getServer()).get('/order/history').expect(200);
        });
    });
    describe('[PATCH] /order/:id/pay', ()=>{
        it('response mark order as paid successfully', async ()=>{
            const orderId = 1;
            const DB = (0, _testdbmock.getMockedDB)();
            DB.Order.findOne = jest.fn().mockReturnValue({
                id: 1,
                user_id: 1,
                order_date: new Date(),
                total_amount: 4200,
                status: _orderinterface.OrderStatus.PENDING,
                createdAt: new Date(),
                updatedAt: new Date()
            });
            DB.Order.update = jest.fn().mockResolvedValue([
                1
            ]);
            DB.Transaction.create = jest.fn().mockReturnValue({
                id: 1,
                user_id: 1,
                order_id: 1,
                reference_id: 'TXN-1234567890-1',
                amount: 4200,
                status: _transactioninterface.TransactionStatus.SUCCESSFUL,
                createdAt: new Date(),
                updatedAt: new Date()
            });
            DB.Order.findByPk = jest.fn().mockReturnValue({
                id: 1,
                user_id: 1,
                order_date: new Date(),
                total_amount: 4200,
                status: _orderinterface.OrderStatus.PAID,
                createdAt: new Date(),
                updatedAt: new Date(),
                items: [
                    {
                        id: 1,
                        order_id: 1,
                        book_id: 1,
                        quantity: 2,
                        price_at_purchase: 1500,
                        book: {
                            id: 1,
                            title: 'The Great Gatsby',
                            author: 'F. Scott Fitzgerald'
                        }
                    }
                ],
                transaction: {
                    id: 1,
                    user_id: 1,
                    order_id: 1,
                    reference_id: 'TXN-1234567890-1',
                    amount: 4200,
                    status: _transactioninterface.TransactionStatus.SUCCESSFUL
                }
            });
            DB.sequelize.transaction = jest.fn().mockImplementation(async (callback)=>{
                const mockTransaction = {
                    commit: jest.fn(),
                    rollback: jest.fn(),
                    LOCK: {
                        UPDATE: 'UPDATE'
                    }
                };
                if (callback) {
                    await callback(mockTransaction);
                }
                return mockTransaction;
            });
            _sequelize.Sequelize.authenticate = jest.fn();
            return (0, _supertest.default)(testServer.getServer()).patch(`/order/${orderId}/pay`).expect(200);
        });
        it('response error - order not found', async ()=>{
            const orderId = 999;
            const DB = (0, _testdbmock.getMockedDB)();
            DB.Order.findOne = jest.fn().mockReturnValue(null);
            DB.sequelize.transaction = jest.fn().mockImplementation(async (callback)=>{
                const mockTransaction = {
                    commit: jest.fn(),
                    rollback: jest.fn(),
                    LOCK: {
                        UPDATE: 'UPDATE'
                    }
                };
                if (callback) {
                    await callback(mockTransaction);
                }
                return mockTransaction;
            });
            _sequelize.Sequelize.authenticate = jest.fn();
            return (0, _supertest.default)(testServer.getServer()).patch(`/order/${orderId}/pay`).expect(500);
        });
        it('response error - order already paid', async ()=>{
            const orderId = 1;
            const DB = (0, _testdbmock.getMockedDB)();
            DB.Order.findOne = jest.fn().mockReturnValue({
                id: 1,
                user_id: 1,
                order_date: new Date(),
                total_amount: 4200,
                status: _orderinterface.OrderStatus.PAID,
                createdAt: new Date(),
                updatedAt: new Date()
            });
            DB.sequelize.transaction = jest.fn().mockImplementation(async (callback)=>{
                const mockTransaction = {
                    commit: jest.fn(),
                    rollback: jest.fn(),
                    LOCK: {
                        UPDATE: 'UPDATE'
                    }
                };
                if (callback) {
                    await callback(mockTransaction);
                }
                return mockTransaction;
            });
            _sequelize.Sequelize.authenticate = jest.fn();
            return (0, _supertest.default)(testServer.getServer()).patch(`/order/${orderId}/pay`).expect(500);
        });
        it('response error - invalid order ID', async ()=>{
            _sequelize.Sequelize.authenticate = jest.fn();
            return (0, _supertest.default)(testServer.getServer()).patch('/order/invalid/pay').expect(400);
        });
    });
});

//# sourceMappingURL=orders.test.js.map