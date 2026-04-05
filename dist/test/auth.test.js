"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _testdbmock = require("./utils/test-db-mock");
const _bcrypt = /*#__PURE__*/ _interop_require_default(require("bcrypt"));
const _sequelize = require("sequelize");
const _supertest = /*#__PURE__*/ _interop_require_default(require("supertest"));
const _authroute = require("../routes/auth.route");
const _testserver = require("./utils/test-server");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
let testServer;
beforeAll(async ()=>{
    testServer = new _testserver.TestServer([
        new _authroute.AuthRoute()
    ]);
    await testServer.start();
});
afterAll(async ()=>{
    if (testServer) {
        await testServer.stop();
    }
});
describe('Testing Auth', ()=>{
    describe('[POST] /signup', ()=>{
        it('response should have the Create userData', async ()=>{
            const userData = {
                email: 'test@email.com',
                password: 'q1w2e3r4!'
            };
            const DB = (0, _testdbmock.getMockedDB)();
            DB.Users.findOne = jest.fn().mockReturnValue(null);
            DB.Users.create = jest.fn().mockReturnValue({
                id: 1,
                email: userData.email,
                password: await _bcrypt.default.hash(userData.password, 10)
            });
            _sequelize.Sequelize.authenticate = jest.fn();
            return (0, _supertest.default)(testServer.getServer()).post('/signup').send(userData).expect(201);
        });
    });
    describe('[POST] /login', ()=>{
        it('response should have the Set-Cookie header with the Authorization token', async ()=>{
            const userData = {
                email: 'test@email.com',
                password: 'q1w2e3r4!'
            };
            const DB = (0, _testdbmock.getMockedDB)();
            DB.Users.findOne = jest.fn().mockReturnValue({
                id: 1,
                email: userData.email,
                password: await _bcrypt.default.hash(userData.password, 10)
            });
            _sequelize.Sequelize.authenticate = jest.fn();
            return (0, _supertest.default)(testServer.getServer()).post('/login').send(userData).expect('Set-Cookie', /^Authorization=.+/);
        });
    });
});

//# sourceMappingURL=auth.test.js.map