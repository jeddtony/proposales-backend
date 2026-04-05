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
    get ProposalRequestModel () {
        return ProposalRequestModel;
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
let ProposalRequestModel = class ProposalRequestModel extends _sequelize.Model {
    constructor(...args){
        super(...args), _define_property(this, "id", void 0), _define_property(this, "name", void 0), _define_property(this, "email", void 0), _define_property(this, "phone_number", void 0), _define_property(this, "company_name", void 0), _define_property(this, "details", void 0), _define_property(this, "proposal_uuid", void 0), _define_property(this, "created_at", void 0), _define_property(this, "updated_at", void 0);
    }
};
function _default(sequelize) {
    ProposalRequestModel.init({
        id: {
            type: _sequelize.DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: _sequelize.DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: _sequelize.DataTypes.STRING,
            allowNull: false
        },
        phone_number: {
            type: _sequelize.DataTypes.STRING,
            allowNull: false
        },
        company_name: {
            type: _sequelize.DataTypes.STRING,
            allowNull: false
        },
        details: {
            type: _sequelize.DataTypes.TEXT,
            allowNull: false
        },
        proposal_uuid: {
            type: _sequelize.DataTypes.STRING,
            allowNull: true,
            defaultValue: null
        }
    }, {
        tableName: 'proposal_requests',
        sequelize
    });
    return ProposalRequestModel;
}

//# sourceMappingURL=proposalRequest.model.js.map