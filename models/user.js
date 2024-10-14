import { Model, BIGINT, STRING, INTEGER, DATEONLY, DATE } from 'sequelize';

class User extends Model {
  static initiate(sequelize) {
    return super.init(
      {
        user_id: {
          type: BIGINT,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true
        },
        sign_id: {
          type: STRING(255),
          allowNull: false,
          unique: true, 
        },
        user_name: {
          type: STRING(255),
          allowNull: false,
        },
        user_email: {
          type: STRING(255),
          allowNull: false,
          unique: true,
        },
        user_nick: {
          type: STRING(255),
          allowNull: false,
        },
        user_gender: {
          type: INTEGER, // 예: 0 - 남성, 1 - 여성
          allowNull: true,
        },
        user_birthday: {
          type: DATEONLY, // 날짜만 가져오기
          allowNull: true,
        },
        user_point: {
          type: BIGINT,
          allowNull: false,
          defaultValue: 0,
        },
        last_login: {
          type: DATE, // 최근 접속일 필드
          allowNull: true,
        },
      },
      {
        sequelize,
        timestamps: true,
        underscored: false,
        modelName: 'User',
        tableName: 'users',
        paranoid: false,
        charset: 'utf8',
        collate: 'utf8_general_ci',
      }
    );
  }

  static associate(db) {
    this.hasMany(db.Chat, { foreignKey: 'user_id', sourceKey: 'user_id', onDelete: 'CASCADE' });
    this.hasMany(db.Route, { foreignKey: 'user_id', sourceKey: 'user_id', onDelete: 'CASCADE' });
  }
}

export default User;
