"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "DB", {
    enumerable: true,
    get: function() {
        return DB;
    }
});
const _sequelize = /*#__PURE__*/ _interop_require_default(require("sequelize"));
const _config = require("../config");
const _usersmodel = /*#__PURE__*/ _interop_require_default(require("../models/users.model"));
const _booksmodel = /*#__PURE__*/ _interop_require_default(require("../models/books.model"));
const _shoppingCartmodel = /*#__PURE__*/ _interop_require_default(require("../models/shoppingCart.model"));
const _shoppingCartItemsmodel = /*#__PURE__*/ _interop_require_default(require("../models/shoppingCartItems.model"));
const _ordermodel = /*#__PURE__*/ _interop_require_default(require("../models/order.model"));
const _orderItemsmodel = /*#__PURE__*/ _interop_require_default(require("../models/orderItems.model"));
const _transactionmodel = /*#__PURE__*/ _interop_require_default(require("../models/transaction.model"));
const _proposalRequestmodel = /*#__PURE__*/ _interop_require_default(require("../models/proposalRequest.model"));
const _proposalChatmodel = /*#__PURE__*/ _interop_require_default(require("../models/proposalChat.model"));
const _logger = require("../utils/logger");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const sequelize = new _sequelize.default.Sequelize(_config.DB_DATABASE, _config.DB_USER, _config.DB_PASSWORD, {
    dialect: 'mysql',
    host: _config.DB_HOST,
    port: _config.DB_PORT,
    timezone: '+09:00',
    define: {
        charset: 'utf8mb4',
        collate: 'utf8mb4_general_ci',
        underscored: true,
        freezeTableName: true
    },
    pool: {
        min: 0,
        max: 5
    },
    logQueryParameters: _config.NODE_ENV === 'development',
    logging: (query, time)=>{
        _logger.logger.info(time + 'ms' + ' ' + query);
    },
    benchmark: true
});
sequelize.authenticate();
const Users = (0, _usersmodel.default)(sequelize);
const Books = (0, _booksmodel.default)(sequelize);
const ShoppingCart = (0, _shoppingCartmodel.default)(sequelize);
const ShoppingCartItems = (0, _shoppingCartItemsmodel.default)(sequelize);
const Order = (0, _ordermodel.default)(sequelize);
const OrderItems = (0, _orderItemsmodel.default)(sequelize);
const Transaction = (0, _transactionmodel.default)(sequelize);
const ProposalRequest = (0, _proposalRequestmodel.default)(sequelize);
const ProposalChat = (0, _proposalChatmodel.default)(sequelize);
Users.hasOne(ShoppingCart, {
    foreignKey: 'user_id',
    sourceKey: 'id'
});
Users.hasMany(Order, {
    foreignKey: 'user_id',
    sourceKey: 'id'
});
Users.hasMany(Transaction, {
    foreignKey: 'user_id',
    sourceKey: 'id'
});
ShoppingCart.belongsTo(Users, {
    foreignKey: 'user_id',
    targetKey: 'id'
});
Order.belongsTo(Users, {
    foreignKey: 'user_id',
    targetKey: 'id'
});
Transaction.belongsTo(Users, {
    foreignKey: 'user_id',
    targetKey: 'id'
});
ShoppingCart.hasMany(ShoppingCartItems, {
    foreignKey: 'shopping_cart_id',
    sourceKey: 'id',
    as: 'items'
});
ShoppingCartItems.belongsTo(ShoppingCart, {
    foreignKey: 'shopping_cart_id',
    targetKey: 'id',
    as: 'shoppingCart'
});
Books.hasMany(ShoppingCartItems, {
    foreignKey: 'book_id',
    sourceKey: 'id'
});
Books.hasMany(OrderItems, {
    foreignKey: 'book_id',
    sourceKey: 'id'
});
ShoppingCartItems.belongsTo(Books, {
    foreignKey: 'book_id',
    targetKey: 'id',
    as: 'book'
});
Order.hasMany(OrderItems, {
    foreignKey: 'order_id',
    sourceKey: 'id',
    as: 'items'
});
OrderItems.belongsTo(Order, {
    foreignKey: 'order_id',
    targetKey: 'id',
    as: 'order'
});
OrderItems.belongsTo(Books, {
    foreignKey: 'book_id',
    targetKey: 'id',
    as: 'book'
});
Transaction.belongsTo(Order, {
    foreignKey: 'order_id',
    targetKey: 'id',
    as: 'order'
});
Order.hasOne(Transaction, {
    foreignKey: 'order_id',
    sourceKey: 'id',
    as: 'transaction'
});
ProposalRequest.hasMany(ProposalChat, {
    foreignKey: 'proposal_request_id',
    sourceKey: 'id',
    as: 'chats'
});
ProposalChat.belongsTo(ProposalRequest, {
    foreignKey: 'proposal_request_id',
    targetKey: 'id',
    as: 'proposalRequest'
});
const DB = {
    Users,
    Books,
    ShoppingCart,
    ShoppingCartItems,
    Order,
    OrderItems,
    Transaction,
    ProposalRequest,
    ProposalChat,
    sequelize,
    Sequelize: _sequelize.default
};

//# sourceMappingURL=index.js.map