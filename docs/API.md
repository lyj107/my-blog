# 个人技术博客后端 API 文档

## 概述

本文档详细描述了个人技术博客系统的后端 API 接口，包括认证、文章管理、分类管理、标签管理、评论管理、项目管理、统计数据和文件上传等功能。

### 基础信息

- **基础 URL**: `http://localhost:3000/api`
- **认证方式**: JWT Token（Bearer Token）
- **数据格式**: JSON
- **字符编码**: UTF-8

---

## 认证接口

### 1. 登录

**请求**

- **方法**: POST
- **路径**: `/auth/login`
- **Content-Type**: application/json

**请求体**

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| username | string | 是 | 用户名 |
| password | string | 是 | 密码 |

**示例**

```json
{
  "username": "admin",
  "password": "admin123"
}
```

**成功响应** (200)

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "admin",
    "email": "admin@example.com",
    "nickname": "管理员",
    "avatar": null,
    "role": "admin"
  }
}
```

**失败响应** (401)

```json
{
  "message": "用户名或密码错误"
}
```

---

### 2. 获取当前用户信息

**请求**

- **方法**: GET
- **路径**: `/auth/me`
- **Authorization**: Bearer Token

**成功响应** (200)

```json
{
  "id": 1,
  "username": "admin",
  "email": "admin@example.com",
  "nickname": "管理员",
  "avatar": null,
  "bio": "个人技术博客管理员",
  "role": "admin",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

**失败响应** (401)

```json
{
  "message": "Unauthorized"
}
```

---

### 3. 更新个人信息

**请求**

- **方法**: PUT
- **路径**: `/auth/me`
- **Authorization**: Bearer Token
- **Content-Type**: application/json

**请求体**

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| nickname | string | 否 | 用户昵称 |
| avatar | string | 否 | 头像 URL |
| bio | string | 否 | 个人简介 |

**成功响应** (200)

```json
{
  "message": "个人信息更新成功",
  "user": {
    "id": 1,
    "username": "admin",
    "email": "admin@example.com",
    "nickname": "新昵称",
    "avatar": "/uploads/avatar.png",
    "bio": "新简介",
    "role": "admin"
  }
}
```

---

### 4. 修改密码

**请求**

- **方法**: PUT
- **路径**: `/auth/password`
- **Authorization**: Bearer Token
- **Content-Type**: application/json

**请求体**

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| oldPassword | string | 是 | 旧密码 |
| newPassword | string | 是 | 新密码 |

**成功响应** (200)

```json
{
  "message": "密码修改成功"
}
```

**失败响应** (401)

```json
{
  "message": "旧密码不正确"
}
```

---

## 文章接口

### 1. 获取文章列表

**请求**

- **方法**: GET
- **路径**: `/articles`

**查询参数**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| page | number | 否 | 页码，默认 1 |
| limit | number | 否 | 每页数量，默认 10 |
| categoryId | number | 否 | 分类 ID |
| tagId | number | 否 | 标签 ID |
| keyword | string | 否 | 搜索关键词 |
| status | string | 否 | 状态：published/draft/archived，默认 published |
| year | number | 否 | 年份筛选 |
| month | number | 否 | 月份筛选（需配合 year） |

**成功响应** (200)

```json
{
  "articles": [
    {
      "id": 1,
      "title": "欢迎来到我的技术博客",
      "slug": "welcome-to-my-blog",
      "excerpt": "欢迎来到我的技术博客...",
      "coverImage": null,
      "viewCount": 100,
      "likeCount": 10,
      "status": "published",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "category": {
        "id": 1,
        "name": "前端开发"
      },
      "author": {
        "id": 1,
        "username": "admin",
        "nickname": "管理员"
      },
      "tags": [
        { "id": 1, "name": "Vue" },
        { "id": 3, "name": "JavaScript" }
      ]
    }
  ],
  "total": 100,
  "page": 1,
  "limit": 10
}
```

---

### 2. 获取单篇文章

**请求**

- **方法**: GET
- **路径**: `/articles/:slug`

**路径参数**

| 参数 | 类型 | 说明 |
|------|------|------|
| slug | string | 文章的 slug |

**成功响应** (200)

```json
{
  "id": 1,
  "title": "欢迎来到我的技术博客",
  "slug": "welcome-to-my-blog",
  "content": "# 欢迎来到我的技术博客...",
  "excerpt": "欢迎来到我的技术博客...",
  "coverImage": null,
  "viewCount": 101,
  "likeCount": 10,
  "status": "published",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "publishedAt": "2024-01-01T00:00:00.000Z",
  "category": {
    "id": 1,
    "name": "前端开发",
    "slug": "frontend"
  },
  "author": {
    "id": 1,
    "username": "admin",
    "nickname": "管理员",
    "avatar": null
  },
  "tags": [
    { "id": 1, "name": "Vue" }
  ]
}
```

**失败响应** (404)

```json
{
  "message": "文章不存在"
}
```

---

### 3. 创建文章

**请求**

- **方法**: POST
- **路径**: `/articles`
- **Authorization**: Bearer Token
- **Content-Type**: application/json

**请求体**

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| title | string | 是 | 文章标题 |
| content | string | 是 | 文章内容（Markdown） |
| excerpt | string | 否 | 摘要，默认截取前200字符 |
| coverImage | string | 否 | 封面图片 URL |
| categoryId | number | 是 | 分类 ID |
| tagIds | number[] | 否 | 标签 ID 数组 |
| status | string | 否 | 状态：draft/published/archived，默认 draft |

**成功响应** (201)

```json
{
  "message": "文章创建成功",
  "article": {
    "id": 10,
    "title": "新文章",
    "slug": "new-article-1234567890",
    "content": "# 新文章内容...",
    "excerpt": "新文章摘要...",
    "category": { "id": 1, "name": "前端开发" },
    "tags": [{ "id": 1, "name": "Vue" }]
  }
}
```

---

### 4. 更新文章

**请求**

- **方法**: PUT
- **路径**: `/articles/:id`
- **Authorization**: Bearer Token
- **Content-Type**: application/json

**路径参数**

| 参数 | 类型 | 说明 |
|------|------|------|
| id | number | 文章 ID |

**请求体**

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| title | string | 否 | 文章标题 |
| content | string | 否 | 文章内容 |
| excerpt | string | 否 | 摘要 |
| coverImage | string | 否 | 封面图片 |
| categoryId | number | 否 | 分类 ID |
| tagIds | number[] | 否 | 标签 ID 数组 |
| status | string | 否 | 状态 |

**成功响应** (200)

```json
{
  "message": "文章更新成功",
  "article": { ... }
}
```

**失败响应** (403)

```json
{
  "message": "无权限修改此文章"
}
```

---

### 5. 删除文章

**请求**

- **方法**: DELETE
- **路径**: `/articles/:id`
- **Authorization**: Bearer Token

**路径参数**

| 参数 | 类型 | 说明 |
|------|------|------|
| id | number | 文章 ID |

**成功响应** (200)

```json
{
  "message": "文章删除成功"
}
```

---

## 分类接口

### 1. 获取所有分类

**请求**

- **方法**: GET
- **路径**: `/categories`

**成功响应** (200)

```json
[
  {
    "id": 1,
    "name": "前端开发",
    "slug": "frontend",
    "description": "Vue、React、JavaScript等前端技术",
    "sortOrder": 0,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "articleCount": 10
  }
]
```

---

### 2. 获取单个分类

**请求**

- **方法**: GET
- **路径**: `/categories/:id`

**成功响应** (200)

```json
{
  "id": 1,
  "name": "前端开发",
  "slug": "frontend",
  "description": "前端技术文章",
  "sortOrder": 0,
  "articleCount": 10
}
```

---

### 3. 创建分类（管理员）

**请求**

- **方法**: POST
- **路径**: `/categories`
- **Authorization**: Bearer Token (admin)
- **Content-Type**: application/json

**请求体**

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| name | string | 是 | 分类名称 |
| description | string | 否 | 分类描述 |
| sortOrder | number | 否 | 排序序号，默认 0 |

**成功响应** (201)

```json
{
  "message": "分类创建成功",
  "category": {
    "id": 6,
    "name": "新分类",
    "slug": "new-category",
    "description": "描述",
    "sortOrder": 0
  }
}
```

---

### 4. 更新分类（管理员）

**请求**

- **方法**: PUT
- **路径**: `/categories/:id`
- **Authorization**: Bearer Token (admin)
- **Content-Type**: application/json

**请求体**

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| name | string | 否 | 分类名称 |
| description | string | 否 | 分类描述 |
| sortOrder | number | 否 | 排序序号 |

**成功响应** (200)

```json
{
  "message": "分类更新成功",
  "category": { ... }
}
```

---

### 5. 删除分类（管理员）

**请求**

- **方法**: DELETE
- **路径**: `/categories/:id`
- **Authorization**: Bearer Token (admin)

**成功响应** (200)

```json
{
  "message": "分类删除成功"
}
```

**失败响应** (400)

```json
{
  "message": "该分类下存在文章，无法删除"
}
```

---

## 标签接口

### 1. 获取所有标签

**请求**

- **方法**: GET
- **路径**: `/tags`

**成功响应** (200)

```json
[
  {
    "id": 1,
    "name": "Vue",
    "slug": "vue",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "articleCount": 5
  }
]
```

---

### 2. 创建标签（管理员）

**请求**

- **方法**: POST
- **路径**: `/tags`
- **Authorization**: Bearer Token (admin)
- **Content-Type**: application/json

**请求体**

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| name | string | 是 | 标签名称 |

**成功响应** (201)

```json
{
  "message": "标签创建成功",
  "tag": {
    "id": 11,
    "name": "TypeScript",
    "slug": "typescript"
  }
}
```

---

### 3. 更新标签（管理员）

**请求**

- **方法**: PUT
- **路径**: `/tags/:id`
- **Authorization**: Bearer Token (admin)

**请求体**

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| name | string | 是 | 标签名称 |

---

### 4. 删除标签（管理员）

**请求**

- **方法**: DELETE
- **路径**: `/tags/:id`
- **Authorization**: Bearer Token (admin)

---

## 评论接口

### 1. 获取评论列表

**请求**

- **方法**: GET
- **路径**: `/comments`
- **Authorization**: Bearer Token (admin)

**查询参数**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| page | number | 否 | 页码 |
| limit | number | 否 | 每页数量 |
| articleId | number | 否 | 文章 ID |
| status | string | 否 | 状态：approved/pending/rejected |

**成功响应** (200)

```json
{
  "comments": [
    {
      "id": 1,
      "content": "很棒的文章！",
      "status": "approved",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "user": {
        "id": 1,
        "username": "admin",
        "nickname": "管理员"
      }
    }
  ],
  "total": 10,
  "page": 1,
  "limit": 10
}
```

---

### 2. 获取文章评论（嵌套结构）

**请求**

- **方法**: GET
- **路径**: `/comments/article/:articleId`

**成功响应** (200)

```json
[
  {
    "id": 1,
    "content": "父评论",
    "status": "approved",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "user": { "id": 1, "username": "admin" },
    "children": [
      {
        "id": 2,
        "content": "回复评论",
        "user": { "id": 2, "username": "user" }
      }
    ]
  }
]
```

---

### 3. 创建评论

**请求**

- **方法**: POST
- **路径**: `/comments`
- **Content-Type**: application/json

**请求体**

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| articleId | number | 是 | 文章 ID |
| content | string | 是 | 评论内容 |
| parentId | number | 否 | 父评论 ID（回复时使用） |
| guestName | string | 否 | 游客昵称（未登录评论时使用） |

**成功响应** (201)

```json
{
  "message": "评论提交成功",
  "comment": { ... }
}
```

---

### 4. 更新评论

**请求**

- **方法**: PUT
- **路径**: `/comments/:id`
- **Authorization**: Bearer Token

**请求体**

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| content | string | 否 | 评论内容（仅作者可修改） |
| status | string | 否 | 状态（仅管理员可修改） |

---

### 5. 删除评论

**请求**

- **方法**: DELETE
- **路径**: `/comments/:id`
- **Authorization**: Bearer Token

---

## 项目接口

### 1. 获取项目列表

**请求**

- **方法**: GET
- **路径**: `/projects`

**成功响应** (200)

```json
[
  {
    "id": 1,
    "name": "个人技术博客",
    "description": "基于 Vue3 + Node.js 构建...",
    "coverImage": "https://example.com/image.jpg",
    "demoUrl": "https://demo.example.com",
    "githubUrl": "https://github.com/example/project",
    "techStack": "Vue3, Node.js, Express, MySQL",
    "status": "active",
    "sortOrder": 1,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
]
```

---

### 2. 创建项目（管理员）

**请求**

- **方法**: POST
- **路径**: `/projects`
- **Authorization**: Bearer Token (admin)
- **Content-Type**: application/json

**请求体**

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| name | string | 是 | 项目名称 |
| description | string | 否 | 项目描述 |
| coverImage | string | 否 | 封面图片 URL |
| demoUrl | string | 否 | 演示地址 |
| githubUrl | string | 否 | GitHub 地址 |
| techStack | string | 否 | 技术栈（逗号分隔） |
| status | string | 否 | 状态：active/completed/in_progress |
| sortOrder | number | 否 | 排序序号 |

---

### 3. 更新项目（管理员）

**请求**

- **方法**: PUT
- **路径**: `/projects/:id`
- **Authorization**: Bearer Token (admin)

---

### 4. 删除项目（管理员）

**请求**

- **方法**: DELETE
- **路径**: `/projects/:id`
- **Authorization**: Bearer Token (admin)

---

## 统计接口

### 1. 获取统计数据（管理员）

**请求**

- **方法**: GET
- **路径**: `/stats`
- **Authorization**: Bearer Token (admin)

**成功响应** (200)

```json
{
  "articles": {
    "total": 50,
    "published": 45,
    "draft": 3,
    "archived": 2
  },
  "categories": 10,
  "tags": 20,
  "comments": {
    "total": 100,
    "approved": 80,
    "pending": 15,
    "rejected": 5
  },
  "projects": {
    "total": 15,
    "active": 10,
    "completed": 5
  }
}
```

---

### 2. 获取月度文章统计（管理员）

**请求**

- **方法**: GET
- **路径**: `/stats/articles/monthly`
- **Authorization**: Bearer Token (admin)

**查询参数**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| year | number | 否 | 年份，默认当前年份 |

**成功响应** (200)

```json
{
  "year": 2024,
  "data": [5, 8, 12, 10, 15, 20, 18, 14, 9, 6, 4, 3]
}
```

---

### 3. 获取热门文章（管理员）

**请求**

- **方法**: GET
- **路径**: `/stats/articles/top`
- **Authorization**: Bearer Token (admin)

**成功响应** (200)

```json
[
  {
    "id": 1,
    "title": "最热门的文章",
    "viewCount": 1000,
    "likeCount": 50
  }
]
```

---

## 文件上传接口

### 1. 上传图片

**请求**

- **方法**: POST
- **路径**: `/upload`
- **Authorization**: Bearer Token
- **Content-Type**: multipart/form-data

**请求体**

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| file | file | 是 | 图片文件（支持 jpeg/png/gif/webp） |

**成功响应** (200)

```json
{
  "message": "文件上传成功",
  "url": "/uploads/1234567890.png",
  "filename": "1234567890.png"
}
```

**失败响应** (400)

```json
{
  "message": "只允许上传图片文件"
}
```

---

## 错误响应格式

所有错误响应都遵循以下格式：

```json
{
  "message": "错误描述",
  "error": "详细错误信息（可选）"
}
```

### HTTP 状态码

| 状态码 | 说明 |
|--------|------|
| 400 | 请求参数错误 |
| 401 | 未授权（需要登录） |
| 403 | 禁止访问（权限不足） |
| 404 | 资源不存在 |
| 500 | 服务器内部错误 |

---

## 认证说明

1. 登录成功后，服务器返回 JWT Token
2. 所有需要认证的接口，需在请求头中携带：`Authorization: Bearer <token>`
3. Token 有效期为 7 天
4. Token 失效后需重新登录

---

## 数据库表结构

### users 表

| 字段 | 类型 | 说明 |
|------|------|------|
| id | INT | 主键，自增 |
| username | VARCHAR(50) | 用户名，唯一 |
| email | VARCHAR(100) | 邮箱，唯一 |
| password | VARCHAR(255) | 密码（加密存储） |
| nickname | VARCHAR(50) | 昵称 |
| avatar | VARCHAR(255) | 头像 URL |
| bio | TEXT | 个人简介 |
| role | VARCHAR(20) | 角色：admin/user |
| createdAt | DATETIME | 创建时间 |
| updatedAt | DATETIME | 更新时间 |

### articles 表

| 字段 | 类型 | 说明 |
|------|------|------|
| id | INT | 主键，自增 |
| title | VARCHAR(255) | 文章标题 |
| slug | VARCHAR(255) | 文章别名，唯一 |
| content | TEXT | 文章内容 |
| excerpt | VARCHAR(500) | 摘要 |
| coverImage | VARCHAR(255) | 封面图片 |
| viewCount | INT | 浏览次数 |
| likeCount | INT | 点赞次数 |
| status | VARCHAR(20) | 状态：published/draft/archived |
| categoryId | INT | 分类 ID |
| authorId | INT | 作者 ID |
| publishedAt | DATETIME | 发布时间 |
| createdAt | DATETIME | 创建时间 |
| updatedAt | DATETIME | 更新时间 |

### categories 表

| 字段 | 类型 | 说明 |
|------|------|------|
| id | INT | 主键，自增 |
| name | VARCHAR(50) | 分类名称 |
| slug | VARCHAR(50) | 分类别名 |
| description | VARCHAR(500) | 分类描述 |
| sortOrder | INT | 排序序号 |
| createdAt | DATETIME | 创建时间 |
| updatedAt | DATETIME | 更新时间 |

### tags 表

| 字段 | 类型 | 说明 |
|------|------|------|
| id | INT | 主键，自增 |
| name | VARCHAR(50) | 标签名称 |
| slug | VARCHAR(50) | 标签别名 |
| createdAt | DATETIME | 创建时间 |
| updatedAt | DATETIME | 更新时间 |

### comments 表

| 字段 | 类型 | 说明 |
|------|------|------|
| id | INT | 主键，自增 |
| content | TEXT | 评论内容 |
| guestName | VARCHAR(50) | 游客昵称（可选） |
| articleId | INT | 文章 ID |
| userId | INT | 用户 ID（可选） |
| parentId | INT | 父评论 ID（可选） |
| status | VARCHAR(20) | 状态：approved/pending/rejected |
| createdAt | DATETIME | 创建时间 |
| updatedAt | DATETIME | 更新时间 |

### projects 表

| 字段 | 类型 | 说明 |
|------|------|------|
| id | INT | 主键，自增 |
| name | VARCHAR(100) | 项目名称 |
| description | TEXT | 项目描述 |
| coverImage | VARCHAR(255) | 封面图片 |
| demoUrl | VARCHAR(255) | 演示地址 |
| githubUrl | VARCHAR(255) | GitHub 地址 |
| techStack | VARCHAR(255) | 技术栈 |
| status | VARCHAR(20) | 状态：active/completed/in_progress |
| sortOrder | INT | 排序序号 |
| createdAt | DATETIME | 创建时间 |
| updatedAt | DATETIME | 更新时间 |

### article_tags 表（中间表）

| 字段 | 类型 | 说明 |
|------|------|------|
| articleId | INT | 文章 ID |
| tagId | INT | 标签 ID |
