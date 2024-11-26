'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('users', 'snsPrimaryKey',{
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('users','snsType',{
      type: Sequelize.STRING,
      allowNull: true,
    });
      await queryInterface.changeColumn('users', 'user_email', {
        type: Sequelize.STRING,
        allowNull: true, // user_email 컬럼을 null 허용으로 수정
      });
  },
  async down (queryInterface, Sequelize) {
  }
};
