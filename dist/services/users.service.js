"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const tslib_1 = require("tslib");
const bcrypt_1 = require("bcrypt");
const typedi_1 = require("typedi");
const _database_1 = require("@database");
const httpException_1 = require("@/exceptions/httpException");
let UserService = class UserService {
    async findAllUser() {
        const allUser = await _database_1.DB.Users.findAll();
        return allUser;
    }
    async findUserById(userId) {
        const findUser = await _database_1.DB.Users.findByPk(userId);
        if (!findUser)
            throw new httpException_1.HttpException(409, "User doesn't exist");
        return findUser;
    }
    async createUser(userData) {
        const findUser = await _database_1.DB.Users.scope('withPassword').findOne({ where: { email: userData.email } });
        if (findUser)
            throw new httpException_1.HttpException(409, `This email ${userData.email} already exists`);
        const hashedPassword = await (0, bcrypt_1.hash)(userData.password, 10);
        const createUserData = await _database_1.DB.Users.create(Object.assign(Object.assign({}, userData), { password: hashedPassword }));
        return createUserData;
    }
    async updateUser(userId, userData) {
        const findUser = await _database_1.DB.Users.findByPk(userId);
        if (!findUser)
            throw new httpException_1.HttpException(409, "User doesn't exist");
        const hashedPassword = await (0, bcrypt_1.hash)(userData.password, 10);
        await _database_1.DB.Users.update(Object.assign(Object.assign({}, userData), { password: hashedPassword }), { where: { id: userId } });
        const updateUser = await _database_1.DB.Users.findByPk(userId);
        return updateUser;
    }
    async deleteUser(userId) {
        const findUser = await _database_1.DB.Users.findByPk(userId);
        if (!findUser)
            throw new httpException_1.HttpException(409, "User doesn't exist");
        await _database_1.DB.Users.destroy({ where: { id: userId } });
        return findUser;
    }
};
UserService = tslib_1.__decorate([
    (0, typedi_1.Service)()
], UserService);
exports.UserService = UserService;
//# sourceMappingURL=users.service.js.map