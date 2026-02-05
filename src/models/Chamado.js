import { Model, DataTypes } from 'sequelize';

class Chamado extends Model {
  static init(sequelize) {
    super.init({
      titulo: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      descricao: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM('aberto', 'em_atendimento', 'concluido'),
        defaultValue: 'aberto',
      },
      prioridade: {
        type: DataTypes.ENUM('baixa', 'media', 'alta'),
        defaultValue: 'baixa',
      },
      // Note que as Foreign Keys aqui também devem seguir o padrão do seu banco
      cliente_id: {
        type: DataTypes.INTEGER,
        references: { model: 'Usuarios', key: 'id' },
      },
      setor_id: {
        type: DataTypes.INTEGER,
        references: { model: 'Setores', key: 'id' },
      }
    }, {
      sequelize,
      tableName: 'Chamados',
      // Esta opção garante a compatibilidade com a tua config de snake_case
      underscored: true,
    });

    return this;
  }

  static associate(models) {
    // O chamado pertence a um utilizador (quem abriu)
    this.belongsTo(models.Usuario, { foreignKey: 'cliente_id', as: 'cliente' });
    // O chamado pertence a um setor específico
    this.belongsTo(models.Setor, { foreignKey: 'setor_id', as: 'setor' });
  }
}

export default Chamado;