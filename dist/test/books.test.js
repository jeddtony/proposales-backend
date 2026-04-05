"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _testdbmock = require("./utils/test-db-mock");
const _sequelize = require("sequelize");
const _supertest = /*#__PURE__*/ _interop_require_default(require("supertest"));
const _booksroute = require("../routes/books.route");
const _testserver = require("./utils/test-server");
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
jest.mock('@middlewares/auth.middleware', ()=>({
        AuthMiddleware: (req, res, next)=>next()
    }));
let testServer;
beforeAll(async ()=>{
    testServer = new _testserver.TestServer([
        new _booksroute.BooksRoute()
    ]);
    await testServer.start();
}, 10000);
afterAll(async ()=>{
    if (testServer) {
        await testServer.stop();
    }
}, 10000);
afterEach(()=>{
    jest.clearAllMocks();
});
describe('Testing Books', ()=>{
    describe('[GET] /books', ()=>{
        it('response findAll books', async ()=>{
            const DB = (0, _testdbmock.getMockedDB)();
            DB.Books.findAll = jest.fn().mockReturnValue([
                {
                    id: 1,
                    title: 'The Lord of the Rings',
                    author: 'J.R.R. Tolkien',
                    genre: 'Fantasy',
                    is_available: true,
                    price: 2500,
                    stock_quantity: 10,
                    description: 'An epic fantasy novel',
                    createdAt: new Date(),
                    updatedAt: new Date()
                },
                {
                    id: 2,
                    title: 'Dune',
                    author: 'Frank Herbert',
                    genre: 'Science Fiction',
                    is_available: true,
                    price: 2200,
                    stock_quantity: 5,
                    description: 'A science fiction masterpiece',
                    createdAt: new Date(),
                    updatedAt: new Date()
                },
                {
                    id: 3,
                    title: '1984',
                    author: 'George Orwell',
                    genre: 'Dystopian',
                    is_available: false,
                    price: 1800,
                    stock_quantity: 0,
                    description: 'A dystopian social science fiction novel',
                    createdAt: new Date(),
                    updatedAt: new Date()
                }
            ]);
            _sequelize.Sequelize.authenticate = jest.fn();
            const response = await (0, _supertest.default)(testServer.getServer()).get('/books');
            expect(response.status).toBe(200);
        });
        it('response findAll books with search by title', async ()=>{
            const DB = (0, _testdbmock.getMockedDB)();
            DB.Books.findAll = jest.fn().mockReturnValue([
                {
                    id: 1,
                    title: 'The Lord of the Rings',
                    author: 'J.R.R. Tolkien',
                    genre: 'Fantasy',
                    is_available: true,
                    price: 2500,
                    stock_quantity: 10,
                    description: 'An epic fantasy novel',
                    createdAt: new Date(),
                    updatedAt: new Date()
                }
            ]);
            _sequelize.Sequelize.authenticate = jest.fn();
            const response = await (0, _supertest.default)(testServer.getServer()).get('/books?title=lord');
            expect(response.status).toBe(200);
        });
        it('response findAll books with search by author', async ()=>{
            const DB = (0, _testdbmock.getMockedDB)();
            DB.Books.findAll = jest.fn().mockReturnValue([
                {
                    id: 1,
                    title: 'The Lord of the Rings',
                    author: 'J.R.R. Tolkien',
                    genre: 'Fantasy',
                    is_available: true,
                    price: 2500,
                    stock_quantity: 10,
                    description: 'An epic fantasy novel',
                    createdAt: new Date(),
                    updatedAt: new Date()
                },
                {
                    id: 4,
                    title: 'The Hobbit',
                    author: 'J.R.R. Tolkien',
                    genre: 'Fantasy',
                    is_available: true,
                    price: 2000,
                    stock_quantity: 8,
                    description: 'A fantasy novel',
                    createdAt: new Date(),
                    updatedAt: new Date()
                }
            ]);
            _sequelize.Sequelize.authenticate = jest.fn();
            const response = await (0, _supertest.default)(testServer.getServer()).get('/books?author=tolkien');
            expect(response.status).toBe(200);
        });
        it('response findAll books with search by genre', async ()=>{
            const DB = (0, _testdbmock.getMockedDB)();
            DB.Books.findAll = jest.fn().mockReturnValue([
                {
                    id: 1,
                    title: 'The Lord of the Rings',
                    author: 'J.R.R. Tolkien',
                    genre: 'Fantasy',
                    is_available: true,
                    price: 2500,
                    stock_quantity: 10,
                    description: 'An epic fantasy novel',
                    createdAt: new Date(),
                    updatedAt: new Date()
                },
                {
                    id: 4,
                    title: 'The Hobbit',
                    author: 'J.R.R. Tolkien',
                    genre: 'Fantasy',
                    is_available: true,
                    price: 2000,
                    stock_quantity: 8,
                    description: 'A fantasy novel',
                    createdAt: new Date(),
                    updatedAt: new Date()
                }
            ]);
            _sequelize.Sequelize.authenticate = jest.fn();
            const response = await (0, _supertest.default)(testServer.getServer()).get('/books?genre=fantasy');
            expect(response.status).toBe(200);
        });
    });
    describe('[POST] /books', ()=>{
        it('response Create book', async ()=>{
            const bookData = {
                title: 'Test Book',
                author: 'Test Author',
                genre: 'Test Genre',
                price: 1500,
                stock_quantity: 5,
                description: "A test book description"
            };
            const DB = (0, _testdbmock.getMockedDB)();
            DB.Books.findOne = jest.fn().mockReturnValue(null);
            DB.Books.create = jest.fn().mockReturnValue(_object_spread_props(_object_spread({
                id: 1
            }, bookData), {
                is_available: true,
                createdAt: new Date(),
                updatedAt: new Date()
            }));
            _sequelize.Sequelize.authenticate = jest.fn();
            const response = await (0, _supertest.default)(testServer.getServer()).post('/books').send(bookData);
            expect(response.status).toBe(201);
        });
    });
    describe('[GET] /books/:id', ()=>{
        it('response findOne book', async ()=>{
            const bookId = 1;
            const DB = (0, _testdbmock.getMockedDB)();
            DB.Books.findByPk = jest.fn().mockReturnValue({
                id: 1,
                title: 'The Lord of the Rings',
                author: 'J.R.R. Tolkien',
                genre: 'Fantasy',
                is_available: true,
                price: 2500,
                stock_quantity: 10,
                description: 'An epic fantasy novel',
                createdAt: new Date(),
                updatedAt: new Date()
            });
            _sequelize.Sequelize.authenticate = jest.fn();
            const response = await (0, _supertest.default)(testServer.getServer()).get(`/books/${bookId}`);
            expect(response.status).toBe(200);
        });
    });
});

//# sourceMappingURL=books.test.js.map