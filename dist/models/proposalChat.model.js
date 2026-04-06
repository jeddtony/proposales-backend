"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProposalChatModel = void 0;
const sequelize_1 = require("sequelize");
class ProposalChatModel extends sequelize_1.Model {
}
exports.ProposalChatModel = ProposalChatModel;
function default_1(sequelize) {
    ProposalChatModel.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        proposal_request_id: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'proposal_requests',
                key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
        },
        role: {
            type: sequelize_1.DataTypes.ENUM('assistant', 'user'),
            allowNull: false,
        },
        message: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
        },
    }, {
        tableName: 'proposal_chats',
        sequelize,
    });
    return ProposalChatModel;
}
exports.default = default_1;
//# sourceMappingURL=proposalChat.model.js.map