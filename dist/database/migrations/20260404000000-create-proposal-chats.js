'use strict';
module.exports = {
    async up (queryInterface, Sequelize) {
        await queryInterface.createTable('proposal_chats', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false
            },
            proposal_request_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'proposal_requests',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },
            role: {
                type: Sequelize.ENUM('assistant', 'user'),
                allowNull: false
            },
            message: {
                type: Sequelize.TEXT,
                allowNull: false
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
            },
            updated_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
            }
        });
    },
    async down (queryInterface) {
        await queryInterface.dropTable('proposal_chats');
    }
};

//# sourceMappingURL=20260404000000-create-proposal-chats.js.map