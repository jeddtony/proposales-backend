"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DB = void 0;
const tslib_1 = require("tslib");
const sequelize_1 = tslib_1.__importDefault(require("sequelize"));
const _config_1 = require("@config");
const users_model_1 = tslib_1.__importDefault(require("@models/users.model"));
const books_model_1 = tslib_1.__importDefault(require("@models/books.model"));
const shoppingCart_model_1 = tslib_1.__importDefault(require("@models/shoppingCart.model"));
const shoppingCartItems_model_1 = tslib_1.__importDefault(require("@models/shoppingCartItems.model"));
const order_model_1 = tslib_1.__importDefault(require("@models/order.model"));
const orderItems_model_1 = tslib_1.__importDefault(require("@models/orderItems.model"));
const transaction_model_1 = tslib_1.__importDefault(require("@models/transaction.model"));
const proposalRequest_model_1 = tslib_1.__importDefault(require("@models/proposalRequest.model"));
const proposalChat_model_1 = tslib_1.__importDefault(require("@models/proposalChat.model"));
const logger_1 = require("@utils/logger");
const sequelize = new sequelize_1.default.Sequelize(_config_1.DB_DATABASE, _config_1.DB_USER, _config_1.DB_PASSWORD, {
    dialect: 'mysql',
    host: _config_1.DB_HOST,
    port: _config_1.DB_PORT,
    timezone: '+09:00',
    define: {
        charset: 'utf8mb4',
        collate: 'utf8mb4_general_ci',
        underscored: true,
        freezeTableName: true,
    },
    pool: {
        min: 0,
        max: 5,
    },
    logQueryParameters: _config_1.NODE_ENV === 'development',
    logging: (query, time) => {
        logger_1.logger.info(time + 'ms' + ' ' + query);
    },
    benchmark: true,
});
sequelize.authenticate();
// Initialize models
const Users = (0, users_model_1.default)(sequelize);
const Books = (0, books_model_1.default)(sequelize);
const ShoppingCart = (0, shoppingCart_model_1.default)(sequelize);
const ShoppingCartItems = (0, shoppingCartItems_model_1.default)(sequelize);
const Order = (0, order_model_1.default)(sequelize);
const OrderItems = (0, orderItems_model_1.default)(sequelize);
const Transaction = (0, transaction_model_1.default)(sequelize);
const ProposalRequest = (0, proposalRequest_model_1.default)(sequelize);
const ProposalChat = (0, proposalChat_model_1.default)(sequelize);
// Model relationships are listed here
Users.hasOne(ShoppingCart, { foreignKey: 'user_id', sourceKey: 'id' });
Users.hasMany(Order, { foreignKey: 'user_id', sourceKey: 'id' });
Users.hasMany(Transaction, { foreignKey: 'user_id', sourceKey: 'id' });
ShoppingCart.belongsTo(Users, { foreignKey: 'user_id', targetKey: 'id' });
Order.belongsTo(Users, { foreignKey: 'user_id', targetKey: 'id' });
Transaction.belongsTo(Users, { foreignKey: 'user_id', targetKey: 'id' });
ShoppingCart.hasMany(ShoppingCartItems, { foreignKey: 'shopping_cart_id', sourceKey: 'id', as: 'items' });
ShoppingCartItems.belongsTo(ShoppingCart, { foreignKey: 'shopping_cart_id', targetKey: 'id', as: 'shoppingCart' });
Books.hasMany(ShoppingCartItems, { foreignKey: 'book_id', sourceKey: 'id' });
Books.hasMany(OrderItems, { foreignKey: 'book_id', sourceKey: 'id' });
ShoppingCartItems.belongsTo(Books, { foreignKey: 'book_id', targetKey: 'id', as: 'book' });
Order.hasMany(OrderItems, { foreignKey: 'order_id', sourceKey: 'id', as: 'items' });
OrderItems.belongsTo(Order, { foreignKey: 'order_id', targetKey: 'id', as: 'order' });
OrderItems.belongsTo(Books, { foreignKey: 'book_id', targetKey: 'id', as: 'book' });
Transaction.belongsTo(Order, { foreignKey: 'order_id', targetKey: 'id', as: 'order' });
Order.hasOne(Transaction, { foreignKey: 'order_id', sourceKey: 'id', as: 'transaction' });
ProposalRequest.hasMany(ProposalChat, { foreignKey: 'proposal_request_id', sourceKey: 'id', as: 'chats' });
ProposalChat.belongsTo(ProposalRequest, { foreignKey: 'proposal_request_id', targetKey: 'id', as: 'proposalRequest' });
exports.DB = {
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
    Sequelize: sequelize_1.default,
};
//# sourceMappingURL=index.js.map