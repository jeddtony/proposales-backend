"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const tslib_1 = require("tslib");
const bcrypt_1 = require("bcrypt");
const jsonwebtoken_1 = require("jsonwebtoken");
const typedi_1 = require("typedi");
const _config_1 = require("@config");
const _database_1 = require("@database");
const httpException_1 = require("@/exceptions/httpException");
const createToken = (user) => {
    const dataStoredInToken = { id: user.id };
    const expiresIn = 60 * 60;
    return { expiresIn, token: (0, jsonwebtoken_1.sign)(dataStoredInToken, _config_1.SECRET_KEY, { expiresIn }) };
};
const createCookie = (tokenData) => {
    return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn};`;
};
let AuthService = class AuthService {
    async signup(userData) {
        const findUser = await _database_1.DB.Users.findOne({ where: { email: userData.email } });
        if (findUser)
            throw new httpException_1.HttpException(409, `This email ${userData.email} already exists`);
        const hashedPassword = await (0, bcrypt_1.hash)(userData.password, 10);
        const createUserData = await _database_1.DB.Users.create(Object.assign(Object.assign({}, userData), { password: hashedPassword }));
        return createUserData;
    }
    async login(userData) {
        const findUser = await _database_1.DB.Users.scope('withPassword').findOne({ where: { email: userData.email } });
        if (!findUser)
            throw new httpException_1.HttpException(409, `This email ${userData.email} was not found`);
        const isPasswordMatching = await (0, bcrypt_1.compare)(userData.password, findUser.password);
        if (!isPasswordMatching)
            throw new httpException_1.HttpException(409, 'Login credentials are not valid');
        const tokenData = createToken(findUser);
        const cookie = createCookie(tokenData);
        return { cookie, findUser };
    }
    async logout(userData) {
        const findUser = await _database_1.DB.Users.findOne({ where: { email: userData.email } });
        if (!findUser)
            throw new httpException_1.HttpException(409, "User doesn't exist");
        return findUser;
    }
};
AuthService = tslib_1.__decorate([
    (0, typedi_1.Service)()
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map