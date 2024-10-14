import { Model, BIGINT, TEXT } from 'sequelize';

class Chat extends Model {
  static initiate(sequelize) {
    return super.init(
      {
        chat_id: {
          type: BIGINT,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true
        },
        que_content: {
          type: TEXT,
          allowNull: false,
        },
        ans_content: {
          type: TEXT,
          allowNull: true,
        },
        user_id: {
          type: BIGINT,
          allowNull: false,
          references: {
            model: 'users',
            key: 'user_id',
          },
          onDelete: 'CASCADE',
        },
      },
      {
        sequelize,
        timestamps: true,
        underscored: false,
        modelName: 'Chat',
        tableName: 'chats',
        paranoid: false,
        charset: 'utf8',
        collate: 'utf8_general_ci',
      }
    );
  }

  static associate(db) {
    this.belongsTo(db.User, { foreignKey: 'user_id', targetKey: 'user_id' });
    this.hasMany(db.Route, { foreignKey: 'chat_id', sourceKey: 'chat_id', onDelete: 'CASCADE' });
  }
}

export default Chat;
