"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const test_db_mock_1 = require("./utils/test-db-mock");
const sequelize_1 = require("sequelize");
const supertest_1 = tslib_1.__importDefault(require("supertest"));
const shoppingCart_route_1 = require("@routes/shoppingCart.route");
const test_server_1 = require("./utils/test-server");
// Mock the auth middleware to always pass
jest.mock('@middlewares/auth.middleware', () => ({
    AuthMiddleware: (req, res, next) => {
        // Mock user data
        req.user = { id: 1 };
        next();
    },
}));
let testServer;
beforeAll(async () => {
    testServer = new test_server_1.TestServer([new shoppingCart_route_1.ShoppingCartRoute()]);
    await testServer.start();
});
afterAll(async () => {
    if (testServer) {
        await testServer.stop();
    }
});
describe('[POST] /shopping-cart', () => {
    it('response add book to shopping cart successfully', async () => {
        const DB = (0, test_db_mock_1.getMockedDB)();
        DB.Books.findByPk = jest.fn().mockReturnValue({
            id: 1,
            title: 'The Great Gatsby',
            author: 'F. Scott Fitzgerald',
            genre: 'Classic',
            is_available: true,
            price: 1500,
            stock_quantity: 10,
            description: 'A story of the fabulously wealthy Jay Gatsby',
            createdAt: new Date(),
            updatedAt: new Date(),
        });
        DB.ShoppingCart.findOne = jest.fn().mockReturnValue({
            id: 1,
            user_id: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
        });
        DB.ShoppingCartItems.findOne = jest.fn().mockReturnValue(null);
        DB.ShoppingCartItems.create = jest.fn().mockReturnValue({
            id: 1,
            shopping_cart_id: 1,
            book_id: 1,
            quantity: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
        });
        sequelize_1.Sequelize.authenticate = jest.fn();
        return (0, supertest_1.default)(testServer.getServer()).post('/shopping-cart').send({ book_id: 1 }).expect(200);
    });
    it('response add book to shopping cart - creates new cart', async () => {
        const DB = (0, test_db_mock_1.getMockedDB)();
        DB.Books.findByPk = jest.fn().mockReturnValue({
            id: 1,
            title: 'The Great Gatsby',
            author: 'F. Scott Fitzgerald',
            genre: 'Classic',
            is_available: true,
            price: 1500,
            stock_quantity: 10,
            description: 'A story of the fabulously wealthy Jay Gatsby',
            createdAt: new Date(),
            updatedAt: new Date(),
        });
        DB.ShoppingCart.findOne = jest.fn().mockReturnValue(null);
        DB.ShoppingCart.create = jest.fn().mockReturnValue({
            id: 1,
            user_id: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
        });
        DB.ShoppingCartItems.findOne = jest.fn().mockReturnValue(null);
        DB.ShoppingCartItems.create = jest.fn().mockReturnValue({
            id: 1,
            shopping_cart_id: 1,
            book_id: 1,
            quantity: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
        });
        sequelize_1.Sequelize.authenticate = jest.fn();
        return (0, supertest_1.default)(testServer.getServer()).post('/shopping-cart').send({ book_id: 1 }).expect(200);
    });
    it('response validation error - missing book_id', async () => {
        const DB = (0, test_db_mock_1.getMockedDB)();
        sequelize_1.Sequelize.authenticate = jest.fn();
        return (0, supertest_1.default)(testServer.getServer()).post('/shopping-cart').send({}).expect(400);
    });
    it('response validation error - invalid book_id', async () => {
        const DB = (0, test_db_mock_1.getMockedDB)();
        sequelize_1.Sequelize.authenticate = jest.fn();
        return (0, supertest_1.default)(testServer.getServer()).post('/shopping-cart').send({ book_id: 0 }).expect(400);
    });
    it('response validation error - book_id not a number', async () => {
        const DB = (0, test_db_mock_1.getMockedDB)();
        sequelize_1.Sequelize.authenticate = jest.fn();
        return (0, supertest_1.default)(testServer.getServer()).post('/shopping-cart').send({ book_id: 'invalid' }).expect(400);
    });
    it('response error - book not found', async () => {
        const DB = (0, test_db_mock_1.getMockedDB)();
        DB.Books.findByPk = jest.fn().mockReturnValue(null);
        sequelize_1.Sequelize.authenticate = jest.fn();
        return (0, supertest_1.default)(testServer.getServer()).post('/shopping-cart').send({ book_id: 999 }).expect(500);
    });
    it('response error - book not available', async () => {
        const DB = (0, test_db_mock_1.getMockedDB)();
        DB.Books.findByPk = jest.fn().mockReturnValue({
            id: 1,
            title: 'The Great Gatsby',
            author: 'F. Scott Fitzgerald',
            genre: 'Classic',
            is_available: false,
            price: 1500,
            stock_quantity: 10,
            description: 'A story of the fabulously wealthy Jay Gatsby',
            createdAt: new Date(),
            updatedAt: new Date(),
        });
        sequelize_1.Sequelize.authenticate = jest.fn();
        return (0, supertest_1.default)(testServer.getServer()).post('/shopping-cart').send({ book_id: 1 }).expect(500);
    });
    it('response error - book out of stock', async () => {
        const DB = (0, test_db_mock_1.getMockedDB)();
        DB.Books.findByPk = jest.fn().mockReturnValue({
            id: 1,
            title: 'The Great Gatsby',
            author: 'F. Scott Fitzgerald',
            genre: 'Classic',
            is_available: true,
            price: 1500,
            stock_quantity: 0,
            description: 'A story of the fabulously wealthy Jay Gatsby',
            createdAt: new Date(),
            updatedAt: new Date(),
        });
        sequelize_1.Sequelize.authenticate = jest.fn();
        return (0, supertest_1.default)(testServer.getServer()).post('/shopping-cart').send({ book_id: 1 }).expect(500);
    });
    it('response error - book already in cart', async () => {
        const DB = (0, test_db_mock_1.getMockedDB)();
        DB.Books.findByPk = jest.fn().mockReturnValue({
            id: 1,
            title: 'The Great Gatsby',
            author: 'F. Scott Fitzgerald',
            genre: 'Classic',
            is_available: true,
            price: 1500,
            stock_quantity: 10,
            description: 'A story of the fabulously wealthy Jay Gatsby',
            createdAt: new Date(),
            updatedAt: new Date(),
        });
        DB.ShoppingCart.findOne = jest.fn().mockReturnValue({
            id: 1,
            user_id: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
        });
        DB.ShoppingCartItems.findOne = jest.fn().mockReturnValue({
            id: 1,
            shopping_cart_id: 1,
            book_id: 1,
            quantity: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
        });
        sequelize_1.Sequelize.authenticate = jest.fn();
        return (0, supertest_1.default)(testServer.getServer()).post('/shopping-cart').send({ book_id: 1 }).expect(500);
    });
});
describe('Testing Shopping Cart', () => {
    describe('[GET] /shopping-cart', () => {
        it('response get shopping cart with items', async () => {
            const DB = (0, test_db_mock_1.getMockedDB)();
            // Mock shopping cart with items
            DB.ShoppingCart.findOne = jest.fn().mockReturnValue({
                id: 1,
                user_id: 1,
                createdAt: new Date(),
                updatedAt: new Date(),
                items: [
                    {
                        id: 1,
                        shopping_cart_id: 1,
                        book_id: 1,
                        quantity: 2,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    },
                    {
                        id: 2,
                        shopping_cart_id: 1,
                        book_id: 2,
                        quantity: 1,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    },
                ],
            });
            sequelize_1.Sequelize.authenticate = jest.fn();
            return (0, supertest_1.default)(testServer.getServer()).get('/shopping-cart').expect(200);
        });
        it('response get empty shopping cart', async () => {
            const DB = (0, test_db_mock_1.getMockedDB)();
            // Mock empty shopping cart
            DB.ShoppingCart.findOne = jest.fn().mockReturnValue(null);
            sequelize_1.Sequelize.authenticate = jest.fn();
            return (0, supertest_1.default)(testServer.getServer()).get('/shopping-cart').expect(200);
        });
    });
});
//# sourceMappingURL=shoppingCart.test.js.map