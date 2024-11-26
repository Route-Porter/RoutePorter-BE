// config/config.js
import dotenv from 'dotenv';
// const dotenv = require('dotenv');

dotenv.config();

const config = {
  development: {
    username: process.env.DEV_DB_USERNAME,
    password: process.env.DEV_DB_PASSWORD,
    database: process.env.DEV_DB_DATABASE,
    host: process.env.DEV_DB_HOST,
    dialect: process.env.DEV_DB_DIALECT || 'mysql'
  },
  test: {
    username: process.env.TEST_DB_USERNAME,
    password: process.env.TEST_DB_PASSWORD,
    database: process.env.TEST_DB_DATABASE,
    host: process.env.TEST_DB_HOST,
    dialect: process.env.TEST_DB_DIALECT || 'mysql'
  },
  production: {
    username: process.env.PROD_DB_USERNAME,
    password: process.env.PROD_DB_PASSWORD,
    database: process.env.PROD_DB_DATABASE,
    host: process.env.PROD_DB_HOST,
    dialect: process.env.PROD_DB_DIALECT || 'mysql'
  }
};

// module.exports = config;
export default config;