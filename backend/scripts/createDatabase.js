const mysql = require('mysql2/promise');
require('dotenv').config();

const {
  DB_HOST = '127.0.0.1',
  DB_PORT = '3306',
  DB_NAME = 'blog',
  DB_USER = 'root',
  DB_PASSWORD = ''
} = process.env;

async function createDatabase() {
  if (!/^[a-zA-Z0-9_-]+$/.test(DB_NAME)) {
    throw new Error('DB_NAME 只能包含字母、数字、下划线和中划线');
  }

  const connection = await mysql.createConnection({
    host: DB_HOST,
    port: Number(DB_PORT),
    user: DB_USER,
    password: DB_PASSWORD
  });

  await connection.query(
    `CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
  );
  await connection.end();

  console.log(`数据库 ${DB_NAME} 已准备就绪`);
}

createDatabase().catch((error) => {
  console.error('创建数据库失败:', error.message);
  process.exit(1);
});
