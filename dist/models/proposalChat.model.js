"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get ProposalChatModel () {
        return ProposalChatModel;
    },
    get default () {
        return _default;
    }
});
const _sequelize = require("sequelize");
function _define_property(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
let ProposalChatModel = class ProposalChatModel extends _sequelize.Model {
    constructor(...args){
        super(...args), _define_property(this, "id", void 0), _define_property(this, "proposal_request_id", void 0), _define_property(this, "role", void 0), _define_property(this, "message", void 0), _define_property(this, "created_at", void 0), _define_property(this, "updated_at", void 0);
    }
};
function _default(sequelize) {
    ProposalChatModel.init({
        id: {
            type: _sequelize.DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        proposal_request_id: {
            type: _sequelize.DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'proposal_requests',
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE'
        },
        role: {
            type: _sequelize.DataTypes.ENUM('assistant', 'user'),
            allowNull: false
        },
        message: {
            type: _sequelize.DataTypes.TEXT,
            allowNull: false
        }
    }, {
        tableName: 'proposal_chats',
        sequelize
    });
    return ProposalChatModel;
}

//# sourceMappingURL=proposalChat.model.js.map