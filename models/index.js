'use strict';

import { Sequelize } from 'sequelize';
import process from 'process';
import config from '../config/config.js';
import User from './user.js';
import Chat from './chat.js';
import Route from './route.js';

const env = process.env.NODE_ENV || 'development';
const db = {};
const sequelize = new Sequelize(config[env].database, config[env].username, config[env].password, config[env]);

// 모델 초기화
const initializeModels = () => {
    db.User = User.initiate(sequelize); // User 모델 초기화
    db.Chat = Chat.initiate(sequelize); // Chat 모델 초기화
    db.Route = Route.initiate(sequelize); // Route 모델 초기화
};

// 모델 간의 관계 설정
const associateModels = () => {
    User.associate(db); // User 관계 설정
    Chat.associate(db); // Chat 관계 설정
    Route.associate(db); // Route 관계 설정
};

// db에 sequelize와 Sequelize 추가
db.sequelize = sequelize;
db.Sequelize = Sequelize;

// initialize 및 associate 메서드 추가
db.initialize = initializeModels;
db.associate = associateModels;

// 모델 초기화 및 관계 설정 호출
db.initialize();
db.associate();

// 모듈 내보내기
export default db;
