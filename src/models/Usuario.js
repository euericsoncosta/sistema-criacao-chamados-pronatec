import { Model, DataTypes } from 'sequelize';

class Usuario extends Model {
  static init(sequelize) {
    super.init({
      nome: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      senha: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      cargo: {
        type: DataTypes.ENUM('cliente', 'tecnico', 'admin'),
        defaultValue: 'cliente',
      },
      // CORREÇÃO AQUI: Use DataTypes em vez de Sequelize
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
      tableName: 'Usuarios',
      // Dica: Se você usa created_at e updated_at (com underscore), 
      // adicione a opção underscored: true para o Sequelize mapear automaticamente
      underscored: true,
    });

    return this;
  }

  static associate(models) {
    this.hasMany(models.Chamado, { foreignKey: 'clienteId', as: 'meus_chamados' });
  }
}

export default Usuario;