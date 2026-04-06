"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const test_db_mock_1 = require("./utils/test-db-mock");
const bcrypt_1 = tslib_1.__importDefault(require("bcrypt"));
const sequelize_1 = require("sequelize");
const supertest_1 = tslib_1.__importDefault(require("supertest"));
const auth_route_1 = require("@routes/auth.route");
const test_server_1 = require("./utils/test-server");
let testServer;
beforeAll(async () => {
    testServer = new test_server_1.TestServer([new auth_route_1.AuthRoute()]);
    await testServer.start();
});
afterAll(async () => {
    if (testServer) {
        await testServer.stop();
    }
});
describe('Testing Auth', () => {
    describe('[POST] /signup', () => {
        it('response should have the Create userData', async () => {
            const userData = {
                email: 'test@email.com',
                password: 'q1w2e3r4!',
            };
            const DB = (0, test_db_mock_1.getMockedDB)();
            DB.Users.findOne = jest.fn().mockReturnValue(null);
            DB.Users.create = jest.fn().mockReturnValue({
                id: 1,
                email: userData.email,
                password: await bcrypt_1.default.hash(userData.password, 10),
            });
            sequelize_1.Sequelize.authenticate = jest.fn();
            return (0, supertest_1.default)(testServer.getServer()).post('/signup').send(userData).expect(201);
        });
    });
    describe('[POST] /login', () => {
        it('response should have the Set-Cookie header with the Authorization token', async () => {
            const userData = {
                email: 'test@email.com',
                password: 'q1w2e3r4!',
            };
            const DB = (0, test_db_mock_1.getMockedDB)();
            DB.Users.findOne = jest.fn().mockReturnValue({
                id: 1,
                email: userData.email,
                password: await bcrypt_1.default.hash(userData.password, 10),
            });
            sequelize_1.Sequelize.authenticate = jest.fn();
            return (0, supertest_1.default)(testServer.getServer())
                .post('/login')
                .send(userData)
                .expect('Set-Cookie', /^Authorization=.+/);
        });
    });
    // describe('[POST] /logout', () => {
    //   it('logout Set-Cookie Authorization=; Max-age=0', async () => {
    //     const authRoute = new AuthRoute();
    //     const app = new App([authRoute]);
    //     return request(app.getServer())
    //       .post('/logout')
    //       .expect('Set-Cookie', /^Authorization=\;/);
    //   });
    // });
});
//# sourceMappingURL=auth.test.js.map