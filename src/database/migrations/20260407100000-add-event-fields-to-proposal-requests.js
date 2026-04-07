'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('proposal_requests', 'event_date', {
      type: Sequelize.DATEONLY,
      allowNull: true,
      defaultValue: null,
    });
    await queryInterface.addColumn('proposal_requests', 'guests', {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: null,
    });
    await queryInterface.addColumn('proposal_requests', 'budget', {
      type: Sequelize.FLOAT,
      allowNull: true,
      defaultValue: null,
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('proposal_requests', 'event_date');
    await queryInterface.removeColumn('proposal_requests', 'guests');
    await queryInterface.removeColumn('proposal_requests', 'budget');
  },
};
