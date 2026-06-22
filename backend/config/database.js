const { Sequelize } = require('sequelize');
require('dotenv').config();

const {
  DB_HOST = '127.0.0.1',
  DB_PORT = '3306',
  DB_NAME = 'blog',
  DB_USER = 'root',
  DB_PASSWORD = '',
  DB_TIMEZONE = '+08:00',
  DB_LOGGING = 'false',
  DB_POOL_MAX = '10',
  DB_POOL_MIN = '0',
  DB_POOL_ACQUIRE = '30000',
  DB_POOL_IDLE = '10000'
} = process.env;

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  port: Number(DB_PORT),
  dialect: 'mysql',
  timezone: DB_TIMEZONE,
  logging: DB_LOGGING === 'true' ? console.log : false,
  dialectOptions: {
    charset: 'utf8mb4'
  },
  pool: {
    max: Number(DB_POOL_MAX),
    min: Number(DB_POOL_MIN),
    acquire: Number(DB_POOL_ACQUIRE),
    idle: Number(DB_POOL_IDLE)
  },
  define: {
    timestamps: true,
    charset: 'utf8mb4',
    collate: 'utf8mb4_unicode_ci'
  }
});

module.exports = sequelize;
