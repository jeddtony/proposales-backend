"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("@/app");
const auth_route_1 = require("@routes/auth.route");
const users_route_1 = require("@routes/users.route");
const books_route_1 = require("@routes/books.route");
const validateEnv_1 = require("@utils/validateEnv");
const shoppingCart_route_1 = require("@routes/shoppingCart.route");
const order_route_1 = require("@routes/order.route");
const proposalRequest_route_1 = require("@routes/proposalRequest.route");
(0, validateEnv_1.ValidateEnv)();
const app = new app_1.App([new auth_route_1.AuthRoute(), new users_route_1.UserRoute(), new books_route_1.BooksRoute(), new shoppingCart_route_1.ShoppingCartRoute(), new order_route_1.OrderRoute(), new proposalRequest_route_1.ProposalRequestRoute()]);
app.listen();
//# sourceMappingURL=server.js.map