'use strict';
const bcrypt = require('bcryptjs');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Encriptamos a senha antes de guardar no banco de dados
    const senhaHash = await bcrypt.hash('admin123', 10);

    // Inserimos o utilizador administrador inicial
    await queryInterface.bulkInsert('Usuarios', [{
      nome: 'Administrador do Sistema',
      email: 'admin@servicedesk.com',
      senha: senhaHash,
      cargo: 'admin',
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  async down(queryInterface, Sequelize) {
    // Permite reverter o seeder se necessário
    await queryInterface.bulkDelete('Usuarios', { email: 'admin@servicedesk.com' }, {});
  }
};