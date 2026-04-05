"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _app = require("./app");
const _authroute = require("./routes/auth.route");
const _usersroute = require("./routes/users.route");
const _booksroute = require("./routes/books.route");
const _validateEnv = require("./utils/validateEnv");
const _shoppingCartroute = require("./routes/shoppingCart.route");
const _orderroute = require("./routes/order.route");
const _proposalRequestroute = require("./routes/proposalRequest.route");
(0, _validateEnv.ValidateEnv)();
const app = new _app.App([
    new _authroute.AuthRoute(),
    new _usersroute.UserRoute(),
    new _booksroute.BooksRoute(),
    new _shoppingCartroute.ShoppingCartRoute(),
    new _orderroute.OrderRoute(),
    new _proposalRequestroute.ProposalRequestRoute()
]);
app.listen();

//# sourceMappingURL=server.js.map