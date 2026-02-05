import { Model, DataTypes } from 'sequelize';

class Setor extends Model {
  static init(sequelize) {
    super.init({
      nome: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      // CORREÇÃO: Alterado de Sequelize para DataTypes
      created_at: {
        allowNull: false,
        type: DataTypes.DATE
      },
      updated_at: {
        allowNull: false,
        type: DataTypes.DATE
      }
    }, {
      sequelize,
      tableName: 'Setores',
      underscored: true, // Recomendado para lidar com nomes de colunas com snake_case
    });

    return this;
  }

  static associate(models) {
    this.hasMany(models.Chamado, { foreignKey: 'setorId', as: 'chamados' });
  }
}

export default Setor;