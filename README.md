# 博客后端运行教程（MySQL）

## 1. 环境准备

- Node.js 18+（推荐 20+）
- MySQL 8.x 或兼容版本
- 当前目录：`backend`

```bash
cd backend
npm install
```

## 2. 配置环境变量

复制示例配置：

```bash
copy .env.example .env
```

打开 `.env`，至少修改这些值：

```env
PORT=3000
DB_HOST=127.0.0.1
DB_PORT=3306
DB_NAME=blog
DB_USER=root
DB_PASSWORD=你的MySQL密码
JWT_SECRET=请换成一段足够长的随机字符串
CORS_ORIGIN=http://localhost:5173,http://localhost:5174
```

说明：

- `DB_NAME` 是后端要连接的数据库名。
- `JWT_SECRET` 用于签发后台登录 token，生产环境必须修改。
- `DB_SYNC_ALTER=false` 默认不自动改已有表结构；本地开发需要自动补字段时可以临时设为 `true`。

## 3. 创建数据库

确保 MySQL 服务已启动，然后执行：

```bash
npm run db:create
```

这个命令会根据 `.env` 自动创建数据库，并使用 `utf8mb4_unicode_ci`，支持中文和 emoji。

也可以手动执行 SQL：

```sql
CREATE DATABASE IF NOT EXISTS blog
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
```

## 4. 初始化表和演示数据

第一次运行建议执行：

```bash
npm run seed
```

这会重建表并插入演示数据。默认后台账号：

```text
用户名：admin
密码：admin123
```

注意：`npm run seed` 会使用 `sequelize.sync({ force: true })`，会清空已有表。已有数据时不要执行。

## 5. 启动后端

开发模式：

```bash
npm run dev
```

生产/普通模式：

```bash
npm start
```

启动成功后检查健康接口：

```bash
curl http://localhost:3000/api/health
```

正常返回：

```json
{"status":"ok","message":"Server is running"}
```

## 6. 联调前台和管理端

前台：

```bash
cd ../frontend
npm install
npm run dev
```

管理端：

```bash
cd ../admin
npm install
npm run dev
```

默认端口：

- 后端：`http://localhost:3000`
- 前台：`http://localhost:5173`
- 管理端：`http://localhost:5174`

如果后端地址不是 `/api` 代理，可以在前台和管理端分别创建 `.env`：

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

前台的管理入口可配置：

```env
VITE_ADMIN_URL=http://localhost:5174/
```

## 7. 常见问题

`Access denied for user`：
检查 `.env` 里的 `DB_USER` 和 `DB_PASSWORD`。

`Unknown database`：
先执行 `npm run db:create`，或手动创建数据库。

后台登录后接口 403：
检查 `.env` 的 `JWT_SECRET` 是否在启动后被改过。改了密钥后需要重新登录。

上传图片无法访问：
确认 `UPLOAD_PATH=uploads`，并通过 `/uploads/文件名` 访问。后端会自动创建上传目录。

## 在线演示地址
http://121.40.25.56:10086/
