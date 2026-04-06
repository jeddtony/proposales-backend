'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('proposal_requests', 'proposal_uuid', {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: null,
    });
    await queryInterface.addColumn('proposal_requests', 'proposal_url', {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: null,
    });
    await queryInterface.addColumn('proposal_requests', 'proposal_generated_at', {
      type: Sequelize.DATE,
      allowNull: true,
      defaultValue: null,
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('proposal_requests', 'proposal_uuid');
    await queryInterface.removeColumn('proposal_requests', 'proposal_url');
    await queryInterface.removeColumn('proposal_requests', 'proposal_generated_at');
  },
};
