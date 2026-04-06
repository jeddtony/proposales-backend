"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoute = void 0;
const express_1 = require("express");
const users_controller_1 = require("@controllers/users.controller");
const users_dto_1 = require("@dtos/users.dto");
const validation_middleware_1 = require("@middlewares/validation.middleware");
class UserRoute {
    constructor() {
        this.path = '/users';
        this.router = (0, express_1.Router)();
        this.user = new users_controller_1.UserController();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.get(`${this.path}`, this.user.getUsers);
        this.router.get(`${this.path}/:id(\\d+)`, this.user.getUserById);
        this.router.post(`${this.path}`, (0, validation_middleware_1.ValidationMiddleware)(users_dto_1.CreateUserDto), this.user.createUser);
        this.router.put(`${this.path}/:id(\\d+)`, (0, validation_middleware_1.ValidationMiddleware)(users_dto_1.CreateUserDto, true), this.user.updateUser);
        this.router.delete(`${this.path}/:id(\\d+)`, this.user.deleteUser);
    }
}
exports.UserRoute = UserRoute;
//# sourceMappingURL=users.route.js.map