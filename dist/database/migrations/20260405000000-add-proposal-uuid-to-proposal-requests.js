'use strict';
module.exports = {
    async up (queryInterface, Sequelize) {
        await queryInterface.addColumn('proposal_requests', 'proposal_uuid', {
            type: Sequelize.STRING,
            allowNull: true,
            defaultValue: null
        });
    },
    async down (queryInterface) {
        await queryInterface.removeColumn('proposal_requests', 'proposal_uuid');
    }
};

//# sourceMappingURL=20260405000000-add-proposal-uuid-to-proposal-requests.js.map