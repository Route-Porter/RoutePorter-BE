import { Model, INTEGER, TEXT,BIGINT } from 'sequelize';

class Route extends Model {
  static initiate(sequelize) {
    return super.init(
      {
        route_id: {
          type: INTEGER,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true
        },
        route_url: {
          type: TEXT,
          allowNull: false,
          validate: {
            isUrl: true,
          }
        },
        chat_id: {
          type: BIGINT,
          allowNull: false,
        },
      },
      {
        sequelize,
        timestamps: true,
        underscored: false,
        modelName: 'Route',
        tableName: 'routes',
        paranoid: false,
        charset: 'utf8',
        collate: 'utf8_general_ci',
      }
    );
  }

  static associate(db) {
    this.belongsTo(db.Chat, { foreignKey: 'chat_id', targetKey: 'chat_id' });
  }
}

export default Route;

