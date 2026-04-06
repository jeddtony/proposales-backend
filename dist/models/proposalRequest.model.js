"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProposalRequestModel = void 0;
const sequelize_1 = require("sequelize");
class ProposalRequestModel extends sequelize_1.Model {
}
exports.ProposalRequestModel = ProposalRequestModel;
function default_1(sequelize) {
    ProposalRequestModel.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        phone_number: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        company_name: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        details: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
        },
        proposal_uuid: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true,
            defaultValue: null,
        },
    }, {
        tableName: 'proposal_requests',
        sequelize,
    });
    return ProposalRequestModel;
}
exports.default = default_1;
//# sourceMappingURL=proposalRequest.model.js.map