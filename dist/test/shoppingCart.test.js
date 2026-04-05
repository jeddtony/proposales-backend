"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _testdbmock = require("./utils/test-db-mock");
const _sequelize = require("sequelize");
const _supertest = /*#__PURE__*/ _interop_require_default(require("supertest"));
const _shoppingCartroute = require("../routes/shoppingCart.route");
const _testserver = require("./utils/test-server");
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
        new _shoppingCartroute.ShoppingCartRoute()
    ]);
    await testServer.start();
});
afterAll(async ()=>{
    if (testServer) {
        await testServer.stop();
    }
});
describe('[POST] /shopping-cart', ()=>{
    it('response add book to shopping cart successfully', async ()=>{
        const DB = (0, _testdbmock.getMockedDB)();
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
            updatedAt: new Date()
        });
        DB.ShoppingCart.findOne = jest.fn().mockReturnValue({
            id: 1,
            user_id: 1,
            createdAt: new Date(),
            updatedAt: new Date()
        });
        DB.ShoppingCartItems.findOne = jest.fn().mockReturnValue(null);
        DB.ShoppingCartItems.create = jest.fn().mockReturnValue({
            id: 1,
            shopping_cart_id: 1,
            book_id: 1,
            quantity: 1,
            createdAt: new Date(),
            updatedAt: new Date()
        });
        _sequelize.Sequelize.authenticate = jest.fn();
        return (0, _supertest.default)(testServer.getServer()).post('/shopping-cart').send({
            book_id: 1
        }).expect(200);
    });
    it('response add book to shopping cart - creates new cart', async ()=>{
        const DB = (0, _testdbmock.getMockedDB)();
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
            updatedAt: new Date()
        });
        DB.ShoppingCart.findOne = jest.fn().mockReturnValue(null);
        DB.ShoppingCart.create = jest.fn().mockReturnValue({
            id: 1,
            user_id: 1,
            createdAt: new Date(),
            updatedAt: new Date()
        });
        DB.ShoppingCartItems.findOne = jest.fn().mockReturnValue(null);
        DB.ShoppingCartItems.create = jest.fn().mockReturnValue({
            id: 1,
            shopping_cart_id: 1,
            book_id: 1,
            quantity: 1,
            createdAt: new Date(),
            updatedAt: new Date()
        });
        _sequelize.Sequelize.authenticate = jest.fn();
        return (0, _supertest.default)(testServer.getServer()).post('/shopping-cart').send({
            book_id: 1
        }).expect(200);
    });
    it('response validation error - missing book_id', async ()=>{
        const DB = (0, _testdbmock.getMockedDB)();
        _sequelize.Sequelize.authenticate = jest.fn();
        return (0, _supertest.default)(testServer.getServer()).post('/shopping-cart').send({}).expect(400);
    });
    it('response validation error - invalid book_id', async ()=>{
        const DB = (0, _testdbmock.getMockedDB)();
        _sequelize.Sequelize.authenticate = jest.fn();
        return (0, _supertest.default)(testServer.getServer()).post('/shopping-cart').send({
            book_id: 0
        }).expect(400);
    });
    it('response validation error - book_id not a number', async ()=>{
        const DB = (0, _testdbmock.getMockedDB)();
        _sequelize.Sequelize.authenticate = jest.fn();
        return (0, _supertest.default)(testServer.getServer()).post('/shopping-cart').send({
            book_id: 'invalid'
        }).expect(400);
    });
    it('response error - book not found', async ()=>{
        const DB = (0, _testdbmock.getMockedDB)();
        DB.Books.findByPk = jest.fn().mockReturnValue(null);
        _sequelize.Sequelize.authenticate = jest.fn();
        return (0, _supertest.default)(testServer.getServer()).post('/shopping-cart').send({
            book_id: 999
        }).expect(500);
    });
    it('response error - book not available', async ()=>{
        const DB = (0, _testdbmock.getMockedDB)();
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
            updatedAt: new Date()
        });
        _sequelize.Sequelize.authenticate = jest.fn();
        return (0, _supertest.default)(testServer.getServer()).post('/shopping-cart').send({
            book_id: 1
        }).expect(500);
    });
    it('response error - book out of stock', async ()=>{
        const DB = (0, _testdbmock.getMockedDB)();
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
            updatedAt: new Date()
        });
        _sequelize.Sequelize.authenticate = jest.fn();
        return (0, _supertest.default)(testServer.getServer()).post('/shopping-cart').send({
            book_id: 1
        }).expect(500);
    });
    it('response error - book already in cart', async ()=>{
        const DB = (0, _testdbmock.getMockedDB)();
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
            updatedAt: new Date()
        });
        DB.ShoppingCart.findOne = jest.fn().mockReturnValue({
            id: 1,
            user_id: 1,
            createdAt: new Date(),
            updatedAt: new Date()
        });
        DB.ShoppingCartItems.findOne = jest.fn().mockReturnValue({
            id: 1,
            shopping_cart_id: 1,
            book_id: 1,
            quantity: 1,
            createdAt: new Date(),
            updatedAt: new Date()
        });
        _sequelize.Sequelize.authenticate = jest.fn();
        return (0, _supertest.default)(testServer.getServer()).post('/shopping-cart').send({
            book_id: 1
        }).expect(500);
    });
});
describe('Testing Shopping Cart', ()=>{
    describe('[GET] /shopping-cart', ()=>{
        it('response get shopping cart with items', async ()=>{
            const DB = (0, _testdbmock.getMockedDB)();
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
                        updatedAt: new Date()
                    },
                    {
                        id: 2,
                        shopping_cart_id: 1,
                        book_id: 2,
                        quantity: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    }
                ]
            });
            _sequelize.Sequelize.authenticate = jest.fn();
            return (0, _supertest.default)(testServer.getServer()).get('/shopping-cart').expect(200);
        });
        it('response get empty shopping cart', async ()=>{
            const DB = (0, _testdbmock.getMockedDB)();
            DB.ShoppingCart.findOne = jest.fn().mockReturnValue(null);
            _sequelize.Sequelize.authenticate = jest.fn();
            return (0, _supertest.default)(testServer.getServer()).get('/shopping-cart').expect(200);
        });
    });
});

//# sourceMappingURL=shoppingCart.test.js.map