'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('settings', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      llm_provider: {
        type: Sequelize.ENUM('claude', 'openai', 'huggingface', 'vercel-ai'),
        allowNull: false,
        defaultValue: 'claude',
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
      },
    });

    // Seed default settings row
    await queryInterface.bulkInsert('settings', [{ llm_provider: 'claude', created_at: new Date(), updated_at: new Date() }]);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('settings');
  },
};
