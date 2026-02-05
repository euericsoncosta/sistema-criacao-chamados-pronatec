'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Chamados', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      titulo: { 
        type: Sequelize.STRING, 
        allowNull: false 
      },
      descricao: { 
        type: Sequelize.TEXT, 
        allowNull: false 
      },
      status: { 
        type: Sequelize.ENUM('aberto', 'em_atendimento', 'concluido'), 
        defaultValue: 'aberto' 
      },
      prioridade: { 
        type: Sequelize.ENUM('baixa', 'media', 'alta'), 
        defaultValue: 'baixa' 
      },
      // Relacionamento: Ajustado para cliente_id
      cliente_id: {
        type: Sequelize.INTEGER,
        references: { model: 'Usuarios', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      // Relacionamento: Ajustado para setor_id
      setor_id: {
        type: Sequelize.INTEGER,
        references: { model: 'Setores', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      // Timestamps em snake_case
      created_at: { 
        allowNull: false, 
        type: Sequelize.DATE 
      },
      updated_at: { 
        allowNull: false, 
        type: Sequelize.DATE 
      }
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('Chamados');
  }
};