const { sequelize, User, Category, Tag, Article, Project, ArticleTag } = require('../models');

async function init() {
  try {
    console.log('正在同步数据库...');
    await sequelize.sync({ force: true });
    console.log('数据库表已创建');

    // 创建管理员（密码由 User 模型的 beforeCreate 钩子自动加密）
    const admin = await User.create({
      username: 'admin',
      email: 'admin@example.com',
      password: 'admin123',
      nickname: '管理员',
      role: 'admin',
      bio: '全栈开发者 / 设计爱好者 / 记录技术与生活的点滴'
    });
    console.log('管理员用户已创建: admin / admin123');

    // 创建分类
    const categories = await Category.bulkCreate([
      { name: '前端开发', slug: 'frontend', description: 'Vue、React、JavaScript 等前端技术探索', sortOrder: 1 },
      { name: '后端开发', slug: 'backend', description: 'Node.js、Python、数据库等后端技术', sortOrder: 2 },
      { name: '系统架构', slug: 'architecture', description: '系统设计、架构模式、性能优化', sortOrder: 3 },
      { name: '工具推荐', slug: 'tools', description: '开发工具、效率工具推荐与评测', sortOrder: 4 },
      { name: '生活随笔', slug: 'life', description: '技术之外的思考与记录', sortOrder: 5 }
    ]);
    console.log('分类数据已创建');

    // 创建标签
    const tags = await Tag.bulkCreate([
      { name: 'Vue', slug: 'vue' },
      { name: 'React', slug: 'react' },
      { name: 'JavaScript', slug: 'javascript' },
      { name: 'TypeScript', slug: 'typescript' },
      { name: 'Node.js', slug: 'nodejs' },
      { name: 'CSS', slug: 'css' },
      { name: 'Docker', slug: 'docker' },
      { name: 'Git', slug: 'git' },
      { name: 'VS Code', slug: 'vscode' },
      { name: '性能优化', slug: 'performance' }
    ]);
    console.log('标签数据已创建');

    // 创建文章
    const articles = [
      {
        title: '从零搭建 Vue3 企业级项目架构',
        slug: 'vue3-enterprise-architecture',
        excerpt: '探讨如何基于 Vue3 + Vite + Pinia 搭建一个规范、可维护的企业级前端项目架构，涵盖目录结构、代码规范、状态管理等核心内容。',
        content: `## 为什么需要好的项目架构

一个清晰的项目架构是团队协作的基础。它能降低维护成本、提高开发效率，让新人更快上手。

## 技术选型

- **Vue 3** — 渐进式框架，Composition API 带来更好的逻辑复用
- **Vite** — 极速构建工具，开发体验拉满
- **Pinia** — Vue 官方推荐的状态管理库
- **Vue Router** — 官方路由方案
- **Element Plus** — UI 组件库

## 目录结构设计

\`\`\`
src/
├── api/          # 接口请求
├── assets/       # 静态资源
├── components/   # 公共组件
├── composables/  # 组合式函数
├── layouts/      # 布局组件
├── router/       # 路由配置
├── stores/       # Pinia 状态管理
├── styles/       # 全局样式
├── utils/        # 工具函数
└── views/        # 页面组件
\`\`\`

## 代码规范

使用 ESLint + Prettier + EditorConfig 三件套保证代码风格统一。

\`\`\`javascript
// eslint.config.js
import js from '@eslint/js'
import vue from 'eslint-plugin-vue'

export default [
  js.configs.recommended,
  ...vue.configs['flat/recommended'],
  {
    rules: {
      'vue/multi-word-component-names': 'off',
      'no-unused-vars': 'warn'
    }
  }
]
\`\`\`

## 状态管理策略

Pinia 的设计非常直觉。每个 store 独立管理自己的状态：

\`\`\`javascript
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUserStore = defineStore('user', () => {
  const token = ref('')
  const userInfo = ref(null)
  const isLoggedIn = computed(() => !!token.value)

  function login(t, info) {
    token.value = t
    userInfo.value = info
  }

  return { token, userInfo, isLoggedIn, login }
})
\`\`\`

## 总结

好的架构不是一蹴而就的，需要在实践中不断迭代。关键是保持目录清晰、职责分明、规范统一。`,
        categoryId: 1,
        tagIds: [1, 3, 4],
        status: 'published'
      },
      {
        title: '深入理解 JavaScript 事件循环机制',
        slug: 'javascript-event-loop',
        excerpt: 'Event Loop 是 JavaScript 异步编程的核心。本文从浏览器和 Node.js 两个角度，深入剖析事件循环的工作原理。',
        content: `## 什么是事件循环

JavaScript 是单线程语言，但通过事件循环机制实现了异步非阻塞 I/O。

## 浏览器中的事件循环

浏览器的事件循环包含以下组件：

1. **Call Stack** — 调用栈
2. **Web APIs** — 浏览器提供的 API
3. **Task Queue** — 任务队列（宏任务）
4. **Microtask Queue** — 微任务队列

### 宏任务 vs 微任务

\`\`\`javascript
console.log('1. 同步代码');

setTimeout(() => {
  console.log('4. 宏任务 setTimeout');
}, 0);

Promise.resolve().then(() => {
  console.log('3. 微任务 Promise');
});

console.log('2. 同步代码结束');
\`\`\`

输出顺序：1 → 2 → 3 → 4

## Node.js 的事件循环

Node.js 的事件循环分为 6 个阶段：

1. **timers** — 执行 setTimeout/setInterval 回调
2. **pending callbacks** — 系统级回调
3. **idle, prepare** — 内部使用
4. **poll** — 获取新 I/O 事件
5. **check** — 执行 setImmediate 回调
6. **close callbacks** — 关闭事件回调

## 实践建议

- 避免在微任务中创建无限循环
- 大量计算使用 Worker 线程
- 合理使用 \`requestIdleCallback\``,
        categoryId: 1,
        tagIds: [3],
        status: 'published'
      },
      {
        title: 'CSS 现代布局完全指南',
        slug: 'css-modern-layout-guide',
        excerpt: '从 Flexbox 到 Grid，再到 Container Queries，CSS 布局技术在过去几年发生了翻天覆地的变化。',
        content: `## Flexbox — 一维布局之王

Flexbox 适合一维（行或列）布局：

\`\`\`css
.container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}
\`\`\`

## Grid — 二维布局利器

CSS Grid 擅长二维布局，是复杂页面的最佳选择：

\`\`\`css
.layout {
  display: grid;
  grid-template-columns: 250px 1fr 300px;
  grid-template-rows: auto 1fr auto;
  grid-template-areas:
    "header header header"
    "sidebar main aside"
    "footer footer footer";
  min-height: 100vh;
}
\`\`\`

## Container Queries — 组件级响应式

\`\`\`css
.card-container {
  container-type: inline-size;
}

@container (min-width: 400px) {
  .card {
    display: grid;
    grid-template-columns: 120px 1fr;
  }
}
\`\`\`

## 实用技巧

- 使用 \`gap\` 替代 margin 处理间距
- \`min-height: 100dvh\` 替代 \`100vh\` 处理移动端
- \`clamp()\` 实现流式排版`,
        categoryId: 1,
        tagIds: [3, 6],
        status: 'published'
      },
      {
        title: 'Node.js 性能监控与优化实战',
        slug: 'nodejs-performance-optimization',
        excerpt: '后端服务的性能直接影响用户体验。本文分享 Node.js 生产环境中的性能监控手段和优化策略。',
        content: `## 性能监控指标

### 1. 响应时间

\`\`\`javascript
const startTime = Date.now();
// ... 处理逻辑
const duration = Date.now() - startTime;
if (duration > 1000) {
  logger.warn('慢请求', { duration, path: req.path });
}
\`\`\`

### 2. 内存使用

\`\`\`javascript
const used = process.memoryUsage();
console.log(\`RSS: \${Math.round(used.rss / 1024 / 1024)}MB\`);
console.log(\`Heap: \${Math.round(used.heapUsed / 1024 / 1024)}MB\`);
\`\`\`

## 优化策略

### 数据库查询优化

- 添加合理索引
- 避免 N+1 查询
- 使用分页减少数据量

### 缓存策略

\`\`\`javascript
const cache = new Map();

async function getCached(key, fetcher, ttl = 60000) {
  if (cache.has(key)) {
    const { value, time } = cache.get(key);
    if (Date.now() - time < ttl) return value;
  }
  const value = await fetcher();
  cache.set(key, { value, time: Date.now() });
  return value;
}
\`\`\`

### 集群模式

利用 Node.js cluster 模块充分利用多核 CPU：

\`\`\`javascript
const cluster = require('cluster');
const os = require('os');

if (cluster.isPrimary) {
  for (let i = 0; i < os.cpus().length; i++) {
    cluster.fork();
  }
} else {
  // 启动 worker
  app.listen(3000);
}
\`\`\``,
        categoryId: 2,
        tagIds: [5, 10],
        status: 'published'
      },
      {
        title: 'Docker 容器化部署最佳实践',
        slug: 'docker-deployment-best-practices',
        excerpt: 'Docker 让应用的部署变得简单可复现。从 Dockerfile 编写到多阶段构建，本文带你掌握容器化部署的精髓。',
        content: `## 多阶段构建

多阶段构建可以大幅减小镜像体积：

\`\`\`dockerfile
# 构建阶段
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# 运行阶段
FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
EXPOSE 3000
CMD ["node", "dist/server.js"]
\`\`\`

## Docker Compose 编排

\`\`\`yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    restart: unless-stopped
\`\`\`

## 最佳实践

1. 使用 \`.dockerignore\` 排除不必要文件
2. 合并 RUN 指令减少层数
3. 使用特定版本标签，不用 latest
4. 非 root 用户运行应用`,
        categoryId: 3,
        tagIds: [7],
        status: 'published'
      },
      {
        title: '我的 VS Code 高效开发配置',
        slug: 'vscode-productivity-setup',
        excerpt: '工欲善其事，必先利其器。分享我使用 VS Code 三年积累的高效配置和必备插件清单。',
        content: `## 必装插件

### 通用开发
- **ESLint** — 代码检查
- **Prettier** — 代码格式化
- **GitLens** — Git 增强
- **Error Lens** — 错误提示增强

### Vue 开发
- **Vue - Official** — Vue 官方插件
- **Volar** — Vue 3 语言支持

### 体验提升
- **Material Icon Theme** — 文件图标
- **One Dark Pro** — 主题
- **Indent Rainbow** — 缩进彩虹

## settings.json 配置

\`\`\`json
{
  "editor.fontSize": 14,
  "editor.fontFamily": "'JetBrains Mono', monospace",
  "editor.formatOnSave": true,
  "editor.tabSize": 2,
  "editor.minimap.enabled": false,
  "editor.bracketPairColorization.enabled": true,
  "editor.guides.bracketPairs": true,
  "workbench.colorTheme": "One Dark Pro",
  "files.autoSave": "afterDelay",
  "terminal.integrated.fontSize": 13
}
\`\`\`

## 快捷键

- \`Ctrl+P\` — 快速打开文件
- \`Ctrl+Shift+P\` — 命令面板
- \`Ctrl+D\` — 选中相同词
- \`Alt+Click\` — 多光标编辑`,
        categoryId: 4,
        tagIds: [9],
        status: 'published'
      },
      {
        title: '程序员的效率方法论',
        slug: 'developer-productivity-methodology',
        excerpt: '效率不是关于加班，而是关于做正确的事。分享我作为开发者五年来总结的效率方法论。',
        content: `## 时间管理

### 番茄工作法

25 分钟专注 + 5 分钟休息。简单但有效。

### 深度工作

每天预留 2-3 小时不受打扰的深度工作时间，处理最难的任务。

## 知识管理

### 费曼学习法

1. 选择一个概念
2. 用简单的语言解释它
3. 找出解释中的漏洞
4. 简化并重复

### 写作驱动学习

写博客是检验理解深度的最佳方式。如果你不能清楚地写出来，说明你还没有真正理解。

## 工具哲学

> 工具是手段，不是目的。

不要花太多时间折腾工具配置。选择一个够用的方案，然后把时间花在真正重要的事情上。

## 健康

- 每小时起身活动
- 保护颈椎和腰椎
- 充足睡眠是最好的效率提升手段`,
        categoryId: 5,
        tagIds: [],
        status: 'published'
      },
      {
        title: 'TypeScript 类型体操入门',
        slug: 'typescript-type-gymnastics',
        excerpt: 'TypeScript 的类型系统是图灵完备的。从条件类型到映射类型，带你走进类型编程的世界。',
        content: `## 条件类型

\`\`\`typescript
type IsString<T> = T extends string ? true : false;

type A = IsString<'hello'>; // true
type B = IsString<42>;      // false
\`\`\`

## 映射类型

\`\`\`typescript
type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};

type Optional<T> = {
  [P in keyof T]?: T[P];
};
\`\`\`

## 实用工具类型

\`\`\`typescript
// 深层 Partial
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// 获取 Promise 返回类型
type Awaited<T> = T extends Promise<infer U> ? U : T;
\`\`\`

## 总结

类型体操不是为了炫技，而是为了在编译时捕获更多错误。适度使用，保持可读性。`,
        categoryId: 1,
        tagIds: [4],
        status: 'draft'
      }
    ];

    for (const articleData of articles) {
      const { tagIds, ...data } = articleData;
      const article = await Article.create({
        ...data,
        authorId: admin.id,
        publishedAt: data.status === 'published' ? new Date() : null
      });
      if (tagIds && tagIds.length > 0) {
        await article.addTags(tagIds);
      }
    }
    console.log(`已创建 ${articles.length} 篇文章`);

    // 创建项目
    const projects = [
      {
        name: '个人技术博客',
        description: '基于 Vue3 + Node.js 构建的现代化个人技术博客系统，支持 Markdown 编辑、分类标签管理、评论系统、数据统计等功能。',
        coverImage: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800',
        demoUrl: 'https://blog.example.com',
        githubUrl: 'https://github.com/example/blog',
        techStack: 'Vue3, Node.js, Express, MySQL',
        status: 'active',
        sortOrder: 1
      },
      {
        name: '实时聊天应用',
        description: '基于 WebSocket 的实时聊天应用，支持群聊、私聊、消息撤回、文件传输等功能。',
        coverImage: 'https://images.unsplash.com/photo-1611606063065-ee7946f0787a?w=800',
        demoUrl: 'https://chat.example.com',
        githubUrl: 'https://github.com/example/chat',
        techStack: 'Vue3, Socket.io, Node.js, Redis',
        status: 'completed',
        sortOrder: 2
      },
      {
        name: '在线代码编辑器',
        description: '支持多语言的在线代码编辑器，实时运行代码并查看结果，适合算法练习和教学演示。',
        coverImage: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=800',
        demoUrl: 'https://code.example.com',
        githubUrl: 'https://github.com/example/editor',
        techStack: 'React, Monaco Editor, Docker',
        status: 'in_progress',
        sortOrder: 3
      }
    ];

    for (const project of projects) {
      await Project.create(project);
    }
    console.log(`已创建 ${projects.length} 个项目`);

    console.log('\n✅ 初始化完成！');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('管理员账号: admin');
    console.log('管理员密码: admin123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    process.exit(0);
  } catch (error) {
    console.error('初始化失败:', error);
    process.exit(1);
  }
}

init();
